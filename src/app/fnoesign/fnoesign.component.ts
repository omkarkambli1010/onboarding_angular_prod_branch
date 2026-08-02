import { Component } from '@angular/core';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-fnoesign',
  templateUrl: './fnoesign.component.html',
  styleUrls: ['./fnoesign.component.css']
})
export class FnoesignComponent {
  PersonalFormOne: boolean = true;
  PersonalFormTwo: boolean = false;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  clientid: any;
  isActiveProeedBtn: boolean = true;
  NomineeRedirection: any;

  RejectStatus = window.sessionStorage.getItem('RejectStatus')
  btnReviewApplication: boolean = false;

  constructor(

    private _http: APIService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private aesService: AesService,
    private route: ActivatedRoute,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Esign Verification - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Esign Verification during the onboarding process journey',
    });


    this.NomineeRedirection = sessionStorage.getItem('NomineeOptOut') ?? '';

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';
  }


  redirectAddNominee() {
    this.spinner.show();

    if (this.NomineeRedirection === 'NomineeOptOut') {
      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.router.navigate(['/addNominee', 1]);
        this.spinner.hide();
      }, 200);
    }
    else {
      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.router.navigate(['/addNominee', 2]);
        this.spinner.hide();
      }, 200);
    }
  }


  ReviewApplication() {
    const reqData = {
      FormNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/esign/getEsignPDFDataFNO', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          this.spinner.hide();

          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          if (response.AOFurl != '') {
            // this.spinner.hide();

            fetch(response.AOFurl)
            .then(response => response.blob())
            .then(blob => {
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            window.open(link.toString());
            })
            .catch(error => console.error(error));
          } else {

            this.spinner.hide();

            this.toastr.error('Something went Wrong...', '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
          }
        } else {

          this.spinner.hide();

          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        }
      });
  }

  proceedToEsign() {

    this.isActiveProeedBtn = false;

    this.btnReviewApplication = true;

    this.spinner.show();

    const reqData = {
      FormNumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/esign/getEsignPDFDataFNO', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.btnReviewApplication = true;

          if (response.esignURL != '') {

            this.spinner.show();
            
            window.location.href = response.esignURL;

            // setTimeout(() => {
            //   this.spinner.hide();
            // }, 4000);

          } else {

            this.isActiveProeedBtn = true;

            this.btnReviewApplication = false;

            this.spinner.hide();
            this.toastr.error('Something went Wrong..', '', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });
            // return;
          }
        } else {

          this.isActiveProeedBtn = true;

          this.btnReviewApplication = false;

          this.spinner.hide();
          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
          // return;
        }
      });
  }

    faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName
    )}`;
  }

}
