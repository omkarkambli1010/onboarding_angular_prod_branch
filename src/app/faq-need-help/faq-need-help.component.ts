import { ChangeDetectorRef, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { AesService } from '../aes.service';
import { APIService } from '../api.service';
import { Location } from '@angular/common';
declare let $: any;

@Component({
  selector: 'app-faq-need-help',
  templateUrl: './faq-need-help.component.html',
  styleUrls: ['./faq-need-help.component.css'],
})
export class FaqNeedHelpComponent {
  stageName: any;
  clientid: any;
  faqResponse: any;
  filteredFaqResponse: any[] = [];

  constructor(
    private router: Router,
    private _http: APIService,
    private aesService: AesService,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private _location: Location,
  ) {}

  ngOnInit(): void {
    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.meta.updateTag({
      name: 'description',
      content: 'FAQ of the customer',
    });
    this.title.setTitle('FAQ - Onboarding-DIY-PWA');
    this.getFAQ();
    this.route.queryParamMap.subscribe((params) => {
      const encodedStageName = params.get('stageName');
      if (encodedStageName) {
        try {
          this.stageName = atob(encodedStageName);
        } catch (error) {
          this.stageName = '';
        }
      }
    });
  }

  getFAQ() {
    this.spinner.show();
    setTimeout(() => {
      var reqData = {
        flag: 'all',
        FormNumber: window.sessionStorage.getItem('FormNumber'),
      };
      this._http
        .postRequest('api/v1/masters/get', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid,
              ),
            );
          }
          this.faqResponse = response.data19;
          this.filteredFaqResponse = this.faqResponse.filter(
            (item: any) =>
              item.Stage_Information &&
              item.Stage_Information.toUpperCase() ===
                this.stageName?.toUpperCase(),
          );

          this.spinner.hide();
        });
    }, 100);
  }

  redirectBack(pageName: any) {
    this.spinner.show();
    pageName = this.stageName;
    if (pageName === 'Pan') {
      window.location.href = `uploadProcess/1`;
    } else if (pageName === 'Selfie') {
      window.location.href = `CaptureSelfie/1`;
    } else if (pageName === 'Signature') {
      window.location.href = `uploadSignature`;
    } else if (pageName === 'Bankaccount') {
      window.location.href = `personalDetailsForm/6`;
    } else if (pageName === 'Nominee') {
      window.location.href = `addNominee/1`;
    } else if (pageName === 'Esign') {
      window.location.href = `esign`;
    } else if (pageName === 'FnoEsign') {
      window.location.href = `fnoesign`;
    } else if (pageName === 'Digilocker') {
      window.location.href = `digilocker-screen`;
    } else {
      window.location.href = `/page-not-found`;
    }
    // this._location.back();
    this.spinner.hide();
  }
}
