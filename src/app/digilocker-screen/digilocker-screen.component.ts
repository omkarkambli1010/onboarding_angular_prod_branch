import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MoengagesdkService } from '../moengagesdk.service';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
@Component({
  selector: 'app-digilocker-screen',
  templateUrl: './digilocker-screen.component.html',
  styleUrls: ['./digilocker-screen.component.css'],
})
export class DigilockerScreenComponent {
  clientid: any;
  nameSubmitted: any;
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  videos: any = [
    {
      sources: [
        {
          src: 'assets/images/diy//digilocker_toogle_video.mp4',
          type: 'video/mp4',
        },
        {
          src: 'assets/images/diy//digilocker_toogle_video.mp4',
          type: 'video/ogg',
        },
      ],
    },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private _http: APIService,
    private aesService: AesService,
    private route: ActivatedRoute,
    private router: Router,
    private MoengageService: MoengagesdkService,
    private toastr: ToastrService,
    private datePipe: DatePipe,
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Digilocker Screen - Onboarding-DIY-PWA');
    this.meta.updateTag({
      name: 'description',
      content: 'Digilocker Screen of the customer.',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source = window.sessionStorage.getItem('UTMSOURCE') ?? '';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';
    this.getDigilockerName();
  }

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName,
    )}`;
  }

  gotoPan() {
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate(['/uploadProcess', 1]);
      this.spinner.hide();
    }, 500);
  }

  redirectDigiLocker() {
    this.dismissModal();
    var reqData = {
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/Digilocker/getRedirectURL', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
          response = JSON.parse(response);
          let redirectUrl = response.data;

          this.MoengageService.trackEvent('Digilocker Redirection', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Digilocker Redirection',
            Redirection_URL: redirectUrl,
          });

          if (redirectUrl) {
            window.location.href = redirectUrl;
            setTimeout(() => {
              this.removeModal();
              this.dismissSuccessModal();
              // this.clearDetails();
              this.spinner.hide();
            }, 2000);
          } else {
            this.MoengageService.trackEvent('Digilocker Redirection Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Digilocker Redirection',
              Redirection_URL: redirectUrl,
              ErrorMsg: response.message,
            });

            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.removeModal();
            this.dismissSuccessModal();
            // this.clearDetails();
            this.spinner.hide();
          }
        } else {
          this.MoengageService.trackEvent('Digilocker Redirection Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Digilocker Redirection',
            ErrorMsg: response.message,
          });

          this.toastr.warning(response.message, 'Warning', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });
          this.removeModal();
          this.dismissSuccessModal();
          // this.clearDetails();
          this.spinner.hide();
        }
      });
  }

  getDigilockerName() {
    var reqData = {
      flag: 'Getnameasperpan',
      FormNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http.postRequest('api/v1/masters/get', reqData).subscribe((resp) => {
      let response: any = resp.body;
      if (response.status == true) {
        response = JSON.parse(
          this.aesService.decrypt(response.data, this.clientid, this.clientid),
        );
        this.nameSubmitted = response.data[0].nameasperpan;
      }
    });
  }

  dismissModal() {
    //console.log("DISMISS MODAL")

    const successCheckLoadingModal =
      document.getElementById('completePanManual');
    const successCheckModal = document.getElementById('successClose');
    const failureCheckModal = document.getElementById(
      'bankUploadStatementClose',
    );

    if (successCheckLoadingModal) {
      const bootstrapModalLoader =
        bootstrap.Modal.getInstance(successCheckLoadingModal) ||
        new bootstrap.Modal(successCheckLoadingModal);
      bootstrapModalLoader.hide();
    } else if (successCheckModal) {
      const bootstrapModal =
        bootstrap.Modal.getInstance(successCheckModal) ||
        new bootstrap.Modal(successCheckModal);
      bootstrapModal.hide();
    } else if (failureCheckModal) {
      const bootstrapModalError =
        bootstrap.Modal.getInstance(failureCheckModal) ||
        new bootstrap.Modal(failureCheckModal);
      bootstrapModalError.hide();
    }
  }

  dismissSuccessModal() {
    const completeVerifyPanDone = document.getElementById(
      'completePanVerifyDone',
    );
    if (completeVerifyPanDone) {
      completeVerifyPanDone.classList.remove('show');
    }
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });
  }
}
