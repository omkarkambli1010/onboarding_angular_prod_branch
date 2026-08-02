import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import ImageCompressor from 'image-compressor.js';
import { Observable, Observer } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
  selector: 'app-father-spouse-name',
  templateUrl: './father-spouse-name.component.html',
  styleUrls: ['./father-spouse-name.component.css'],
})
export class FatherSpouseNameComponent implements OnInit {
  clientid: any;
  guid: any;
  PersonalResponse: any;

  kycParents: any = {
    motherName: '',
    fatherName: '',
  };

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  isPersonalForm: boolean = true;

  motherNameReq: boolean = false;
  fatherNameReq: boolean = false;

  motherNameReqSpecial: boolean = false;
  motherNameReqDigit: boolean = false;
  motherNameReqSpace: boolean = false;

  fatherNameSpecial: boolean = false;
  fatherNameDigit: boolean = false;
  fatherNameSpace: boolean = false;

  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  showEmptyWarning: boolean = false;

  constructor(
    private _http: APIService,
    private aesService: AesService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private navService: NavigationService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Personal Details - Onboarding-DIY-PWA');
    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Personal Details of the customer.',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.getFatherSpouseData();
  }

  getFatherSpouseData() {
    this.spinner.show();
    const reqData = {
      flag: 'ParentsName',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe(
        (resp) => {
          if (resp.body && resp.body.status === true) {
            let response: any = resp.body;

            if (response.data) {
              response.data = JSON.parse(
                this.aesService.decrypt(
                  response.data,
                  this.clientid,
                  this.clientid
                )
              );
            }

            if (response.message === 'Data found' && response.data[0]) {
              this.kycParents.fatherName = response.data[0].FatherName || '';
              this.kycParents.motherName = response.data[0].MotherName || '';

              this.spinner.hide();

              // this.validateForm();

              this.updateFatherName(this.kycParents.fatherName, 'change');
            } else {
              this.isPersonalForm = true;

              this.spinner.hide();
            }
          } else {
            this.isPersonalForm = true;
            this.spinner.hide();
          }
        },
        (error) => {
          this.spinner.hide();
          console.error('Error fetching data:', error);
          this.isPersonalForm = true;
        }
      );
  }

  PersonalDetailsave(flag: string, declaration: string) {
    let reqData;
    this.spinner.show();

    reqData = {
      Flag: flag,
      MotherName: this.kycParents.motherName,
      FatherName: this.kycParents.fatherName,
      FormNumber: window.sessionStorage.getItem('FormNumber'),
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      Guid: this.guid,
      Stage: '5',
    };

    this._http
      .postRequest('api/v1/personalDetail/save', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.MoengageService.trackEvent('Parent Details Added', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Father_Spouse_name: this.kycParents.fatherName,
            product_name: 'Onboarding DIY',
            category: 'Personal Details',
          });

          var mode = window.sessionStorage.getItem('mode');

          let yonobankstatus = window.sessionStorage.getItem('yonobank') ?? '';
          let IsYonoClient = window.sessionStorage.getItem('IsYono') ?? '';

          if (this.RejectStatus === 'R') {
            this.spinner.hide();
            this.navService.navigateToNextStep();
          } else if (yonobankstatus === 'UNIQUE' && (IsYonoClient === 'YONO'|| IsYonoClient === 'Branch Portal')) {
            setTimeout(() => {
              const modalBackdrops =
                document.querySelectorAll('.modal-backdrop');
              modalBackdrops.forEach((backdrop) => {
                if (backdrop instanceof HTMLElement) {
                  backdrop.remove();
                }
              });
              this.router.navigate(['/planprocess', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            if (mode === 'Penny Drop') {
              setTimeout(() => {
                const modalBackdrops =
                  document.querySelectorAll('.modal-backdrop');
                modalBackdrops.forEach((backdrop) => {
                  if (backdrop instanceof HTMLElement) {
                    backdrop.remove();
                  }
                });
                this.router.navigate(['/PennyDrop', 2]);
                this.spinner.hide();
              }, 200);
            } else if (mode === 'RevPennyDrop') {
              setTimeout(() => {
                const modalBackdrops =
                  document.querySelectorAll('.modal-backdrop');
                modalBackdrops.forEach((backdrop) => {
                  if (backdrop instanceof HTMLElement) {
                    backdrop.remove();
                  }
                });
                this.router.navigate(['/reversePennyDrop', 2]);
                this.spinner.hide();
              }, 200);
            } else {
              setTimeout(() => {
                this.router.navigate(['/personalDetailsForm', 6]);
                this.spinner.hide();
              }, 200);
            }
          }
          // this.spinner.hide();
        } else {

          this.MoengageService.trackEvent('Parent Details Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Father_Spouse_name: this.kycParents.fatherName,
            product_name: 'Onboarding DIY',
            category: 'Personal Details',
            ErrorMsg: response.message,
          });

          this.toastr.error(response.message, 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 4000,
          });

          this.spinner.hide();
        }
      });
  }

  checkInput(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.kycParents.fatherName = value;
  }

  // updateFatherName(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   const value = input.value.trim();

  //   const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   const hasSpecialChar = specialCharRegex.test(value);
  //   const hasDigit = /\d/.test(value);
  //   const hasMultipleSpaces = /\s{2,}/.test(value);
  //   const containsEmoji = emojiRegex.test(value);

  //   this.fatherNameSpecial = hasSpecialChar;
  //   this.fatherNameDigit = hasDigit;
  //   this.fatherNameSpace = hasMultipleSpaces;
  //   this.showEmptyWarning = value === '';

  //   if (
  //     value.length > 0 &&
  //     !hasMultipleSpaces &&
  //     !hasSpecialChar &&
  //     !hasDigit &&
  //     !containsEmoji
  //   ) {
  //     this.kycParents.fatherName = value.toUpperCase();
  //     this.isPersonalForm = false;
  //   } else {
  //     this.isPersonalForm = true;
  //   }

  //   this.validateForm();
  // }

  updateFatherName(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    const hasSpecialChar = specialCharRegex.test(trimmedValue);
    const hasDigit = /\d/.test(trimmedValue);
    const hasMultipleSpaces = /\s{2,}/.test(trimmedValue);
    const containsEmoji = emojiRegex.test(trimmedValue);

    this.fatherNameSpecial = hasSpecialChar;
    this.fatherNameDigit = hasDigit;
    this.fatherNameSpace = hasMultipleSpaces;

    if (
      trimmedValue.length > 0 &&
      !hasMultipleSpaces &&
      !hasSpecialChar &&
      !hasDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.kycParents.fatherName = value.toUpperCase();
      }
      this.isPersonalForm = false;
      this.showEmptyWarning = false;
    } else {
      if (flag === 'fout') {
        this.showEmptyWarning = trimmedValue === '';
      }
      this.isPersonalForm = true;
    }

    //this.validateForm();
  }

  // validateForm() {
  //   const validNamePattern = /^[A-Z](?:\s?[A-Z])*$/;
  //   const isInvalidInput = !validNamePattern.test(this.kycParents.fatherName);
  //   this.isPersonalForm = isInvalidInput;
  // }

  // onKeyPress(event: KeyboardEvent) {
  //   const char = event.key;
  //   const regExp = /^[\u0041-\u005A\u0061-\u007A\s]*$/;
  //   const emojiRegExp =
  //     /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}-\u{2B07}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/u;

  //   if (!regExp.test(char) || emojiRegExp.test(char)) {
  //     event.preventDefault();
  //   }
  // }

  onKeyPress(event: KeyboardEvent): void {
    const char = event.key;
    const regExp = /^[a-zA-Z\s]*$/;

    if (!regExp.test(char)) {
      event.preventDefault();
    }
  }

  BackToFour() {
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate(['/personalDetailsForm', 4]);
      this.spinner.hide();
    }, 200);
  }
}
