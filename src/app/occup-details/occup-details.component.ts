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
  selector: 'app-occup-details',
  templateUrl: './occup-details.component.html',
  styleUrls: ['./occup-details.component.css'],
})
export class OccupDetailsComponent implements OnInit {
  clientid: any;
  guid: any;
  PersonalResponse: any;
  selectedOccupation: any;
  occupationResponse: any;

  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

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

    this.getPersonalDetails();

    this.getOccupationData();
  }

  getPersonalDetails() {
    var reqData = {
      flag: 'all',
    };
    this.spinner.show();
    this._http.postRequest('api/v1/masters/get', reqData).subscribe((resp) => {
      let response: any = resp.body;
      this.guid = response.request_id;
      this.spinner.hide();

      if (response.status == true) {
        response = JSON.parse(
          this.aesService.decrypt(response.data, this.clientid, this.clientid)
        );
      }

      this.PersonalResponse = response;

      this.occupationResponse = this.PersonalResponse.data7;
    });
  }

  getOccupationData() {
    this.spinner.show();
    var reqData = {
      flag: 'OCCUPATION',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (resp.body.message === 'Data found') {
            this.selectedOccupation = response[0].OccupationDetail;
          }
        }
      });
  }

  PersonalDetailsave(flag: string, declaration: string) {
    this.spinner.show();

    let reqData;

    reqData = {
      Flag: flag,
      Occupation: declaration,
      FormNumber: window.sessionStorage.getItem('FormNumber'),
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      Guid: this.guid,
      Stage: '4',
    };

    this._http
      .postRequest('api/v1/personalDetail/save', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.MoengageService.trackEvent('Occupation Details Selected', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Occupation: declaration,
            product_name: 'Onboarding DIY',
            category: 'Personal Details',
          });

          if (this.RejectStatus != 'R') {
            setTimeout(() => {
              this.router.navigate(['/personalDetailsForm', 5]);
              this.spinner.hide();
            }, 200);
          } else {
            this.navService.navigateToNextStep();
          }
        } else {

          this.MoengageService.trackEvent('Occupation Details Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Occupation: declaration,
            product_name: 'Onboarding DIY',
            category: 'Personal Details',
            ErrorMsg: response.message
          });

          this.toastr.error(response.message, 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 4000,
          });

          this.spinner.hide();
        }
      });
  }

  BackToThree() {
    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/personalDetailsForm', 3]);
      this.spinner.hide();
    }, 200);
  }
}
