import { Component, ElementRef, NgZone, ViewChild } from '@angular/core';
import { APIService } from '../api.service';
import { NgModel } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { MoengagesdkService } from '../moengagesdk.service';
import { CookieService } from 'ngx-cookie-service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NavigationService } from '../navigation.service';

declare const google: any;

@Component({
  selector: 'app-email-home-screen',
  templateUrl: './email-home-screen.component.html',
  styleUrls: ['./email-home-screen.component.css'],
})
export class EmailHomeScreenComponent {
  clientid: any;
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  status: string = '';

  googleprompt: string = '';
  googlebtn: boolean = false;
  Googleoath: boolean = true;
  responsePayload: any = null;
  otpFieldEmail: any;

  gmailparams: any = {
    email: '',
    name: '',
    email_verified: '',
    EmailError: '',
  };

  sendEmailOtp: any = {
    mobile: '',
    email: '',
    fullname: '',
  };

  homeURL: any;
  mobileEncrpyt: any;
  mobileDecrpyt: any;
  fullnameEncrpyt: any;
  fullnameDecrpyt: any;
  googleHideBtn: boolean = false;

  constructor(
    private _http: APIService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private aesService: AesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private zone: NgZone,
    private navService: NavigationService,
    private chCookie: CookieService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {

    this.meta.updateTag({
      name: 'description',
      content: '',
    });

    this.clientid = window.sessionStorage.getItem('clientid') ?? '';
    this.utm_source = this.route.snapshot.queryParams['utm_source'] || 'NA';
    this.utm_medium = this.route.snapshot.queryParams['utm_medium'] || 'NA';
    this.utm_campaign = this.route.snapshot.queryParams['utm_campaign'] || 'NA';
    this.status = this.route.snapshot.queryParams['status'];

    //If coming fom utm parameters

    // const urlParams = new URLSearchParams(window.location.search);
    // const utmSource = urlParams.get('utm_source');

    // if (
    //   !utmSource ||
    //   utmSource === 'search-engine' ||
    //   utmSource === 'search_engine' ||
    //   utmSource === 'NA' ||
    //   utmSource === ''
    // ) {
    //   this.googleHideBtn = false;
    // } else {
    //   this.googleHideBtn = true;
    // }

    // var cookie = this.chCookie.getAll();

    // this.route.queryParams.subscribe((params: any) => {
    //   if (Object.keys(params).length > 0) {
    //     this.mobileEncrpyt = params.request;
    //     this.fullnameEncrpyt = params.name_submitted;
    //     console.log('this.fullnameEncrpyt', this.fullnameEncrpyt);

    //     if (
    //       (this.mobileEncrpyt != null &&
    //         this.mobileEncrpyt != '' &&
    //         this.mobileEncrpyt != undefined) ||
    //       (this.fullnameEncrpyt != null &&
    //         this.fullnameEncrpyt != '' &&
    //         this.fullnameEncrpyt != undefined)
    //     ) {
    //       this.homeURL = {
    //         utm_source: params['utm_source'] || 'NA',
    //         utm_campaign: params['utm_campaign'] || 'NA',
    //         utm_medium: params['utm_medium'] || 'NA',
    //         status: params['status'] || '',
    //       };
    //       var enc_mob = this.mobileEncrpyt;
    //       enc_mob = enc_mob.replaceAll('/slash/g', '/');
    //       enc_mob = enc_mob.replaceAll('/plus/g', '+');
    //       enc_mob = enc_mob.replaceAll('/equal/g', '==');

    //       var enc_fullname = this.fullnameEncrpyt;
    //       enc_fullname = enc_fullname.replaceAll('/slash/g', '/');
    //       enc_fullname = enc_fullname.replaceAll('/plus/g', '+');
    //       enc_fullname = enc_fullname.replaceAll('/equal/g', '==');

    //       this.mobileDecrpyt = this.aesService.decrypt(
    //         enc_mob,
    //         this.clientid,
    //         this.clientid
    //       );
    //       this.fullnameDecrpyt = this.aesService.decrypt(
    //         enc_fullname,
    //         this.clientid,
    //         this.clientid
    //       );
    //       console.log('enc_mob---->', this.mobileDecrpyt);
    //       console.log('enc_fullname---->', this.fullnameDecrpyt);
    //       this.sendEmailOtp.mobile = this.mobileDecrpyt;
    //       this.sendEmailOtp.fullname = this.fullnameDecrpyt;
    //       sessionStorage.setItem('mobile', this.sendEmailOtp.mobile);
    //       sessionStorage.setItem('NameSubmitted', this.sendEmailOtp.fullname);
    //     }
    //   } else {
    //     this.spinner.hide();
    //   }
    // });

    this.gmailparams.email_verified =
      this.route.snapshot.queryParams['email_verified'] || '';

    this.gmailparams.email = this.route.snapshot.queryParams['email'] || '';

    this.gmailparams.name = this.route.snapshot.queryParams['name'] || '';

    this.gmailparams.EmailError =
      this.route.snapshot.queryParams['Error'] || '';

    //console.log('email:', this.gmailparams.email);
    //console.log('email_verified:', this.gmailparams.email_verified);
    //console.log('name:', this.gmailparams.name);

    this.MoengageService.MoeInit();

    setTimeout(() => {
      this.MoengageService.setUserAttributes(
        window.sessionStorage.getItem('FormNumber') ?? '',
        '',
        '',
        '',
        ''
      );
    }, 500);

    if (
      this.gmailparams.email != '' &&
      this.gmailparams.email_verified === 'true'
    ) {
      this.getEmailOtpVerify(false);
    } else if (
      this.gmailparams.EmailError != '' &&
      this.gmailparams.EmailError != null
    ) {
      //this.MoengageService.MoeInit();

      setTimeout(() => {
        // this.MoengageService.setUserAttributes(
        //   window.sessionStorage.getItem('FormNumber') ?? '',
        //   '',
        //   '',
        //   '',
        //   ''
        // );

        this.MoengageService.trackEvent('Google Authentication Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          product_name: 'Onboarding DIY',
          category: 'Google Authentication',
          verificationmethod: 'Google Auth',
          ErrorMsg: 'Google Authentication Failed, Please Try Again...',
        });
      }, 500);

      // const mobileOtpModal = document.getElementById('mobileotp');
      // mobileOtpModal?.classList.remove('show');
      // $('#mobileOtpModal').modal('show');
      // this.clearMobileOTPFields();
      // this.removeModal();
      // this.emailWindowBox();

      this.toastr.error(
        'Google Authentication Failed, Please Try Again...',
        'Error',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 5000,
        }
      );
    }
  }

  initGoogleSignIn() {
    try {
      google.accounts.id.initialize({
        client_id:
          '652145000458-ebpj0tfffq6e2lolfl3ei5fu11mhr831.apps.googleusercontent.com',
        context: 'use',
        use_fedcm_for_prompt: true,
        callback: this.handleGoogleResponse.bind(this),
        cancel_on_tap_outside: false,
        prompt_paraent_id: 'one-tap-container',
        auto_select: false,
        itp_support: true,
      });
    } catch (error) {
      //console.log('Google Error: ', error);
    }
  }

  signInWithGoogle(): void {
    this.spinner.show();

    google.accounts.id.cancel();

    // this.chCookie.set('g_state', '{"i_p":1725374488233,"i_l":2}', {
    //   path: '/',
    //   expires: new Date(0),
    // });

    this.chCookie.delete('g_state');

    this.chCookie.delete('g_state', '//');

    this.googleprompt =
      this.googleprompt ?? window.sessionStorage.getItem('Reason');

    if (this.googleprompt === '' || this.googleprompt === null) {
      this.initGoogleSignIn();

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          //console.log('Prompt Not Dispayed', notification);
          let reason = 'Unknown reason';
          if (notification.isNotDisplayed()) {
            reason = notification.getNotDisplayedReason
              ? notification.getNotDisplayedReason()
              : 'Prompt Not Displayed';
          } else if (notification.isSkippedMoment()) {
            reason = notification.getSkippedMomentReason
              ? notification.getSkippedMomentReason()
              : 'Prompt Skipped';
          }
          window.sessionStorage.setItem('GoogleError', reason);
          this.googleprompt = reason;
          this.Googleoath = false;
          this.zone.run(() => {
            this.CheckGoogleoath();
          });
        }
      });

      setTimeout(() => {
        this.spinner.hide();
      }, 2500);
    } else {
      this.spinner.show();
      //window.location.href = "https://localhost:44326/GoogleSignIn.aspx?clientcode=" + window.sessionStorage.getItem("FormNumber");
      this.googlebtn = true;
      
      window.location.href =
        'https://diy.sbisecurities.in/GoogleAuthentication/GoogleSignIn.aspx?clientcode=' +
        window.sessionStorage.getItem('FormNumber');

      // window.location.href =
      //   'https://udn.sbisecurities.in/GoogleAuthentication/GoogleSignIn.aspx?clientcode=' +
      //   window.sessionStorage.getItem('FormNumber');
    }
  }

  CheckGoogleoath() {
    if (this.Googleoath != true) {
      this.toastr.warning(
        'Please provide permission to fetch your data from Google or please enter Email ID manually',
        'Warning',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        }
      );
    } else {
      this.Googleoath = true;
    }

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  handleGoogleResponse(response: any) {
    try {
      if (response.credential) {
        this.responsePayload = this.decodeJwtResponse(response.credential);
        if (this.responsePayload.email_verified == true) {
          this.getEmailOtpVerify(false);
        }
      } else {
      }
    } catch (error) {
      this.MoengageService.trackEvent('Google Authentication Error', {
        product_id: window.sessionStorage.getItem('FormNumber') ?? '',
        product_name: 'Onboarding DIY',
        category: 'Google Authentication',
        verificationmethod: 'Google Auth',
        EmailID: this.responsePayload.email,
        ErrorMsg: error,
      });
    }
  }

  decodeJwtResponse(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  getEmailOtpVerify(isRetry: boolean) {
    if (this.responsePayload != null) {
      const reqData = {
        Flag: 'SaveGmail',
        emailid: this.responsePayload.email,
        emailidverified: this.responsePayload.email_verified,
        GmailProfileName: this.responsePayload.name,
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        mobileno: window.sessionStorage.getItem('mobile'),
        utm_source: this.utm_source,
        utm_medium: this.utm_medium,
        utm_campaign: this.utm_campaign,
      };

      this.spinner.show();
      this._http
        .postRequest('api/v1/oauth/service/otp/savegmail', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          this.spinner.hide();
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );

            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              window.sessionStorage.getItem('mobile') ?? '',
              this.responsePayload.email,
              '',
              ''
            );

            this.MoengageService.trackEvent('Email Verified via Google', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              verificationmethod: 'Google Auth',
              EmailID: this.responsePayload.email,
            });

            // this.isRightOTP = true;
            // this.clearTimer();
            // this.clearEmailOTPFields();
            // this.removeModal();

            // const emailModalOtpModal = document.getElementById(
            //   'emailotp'
            // ) as HTMLElement;
            // if (emailModalOtpModal) {
            //   $('#emailotp').modal('hide');
            // }

            // const panConfirmationDone = document.getElementById('email2faotp');
            // if (panConfirmationDone) {
            //   $('#email2faotp').modal('hide');
            // }
            setTimeout(() => {
              this.router.navigate(['/uploadProcess', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            this.MoengageService.trackEvent('Google Authentication Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              verificationmethod: 'Google Auth',
              EmailID: this.responsePayload.email,
              ErrorMsg: response.message,
            });

            // const emailModalOtpModal = document.getElementById(
            //   'emailotp'
            // ) as HTMLElement;
            // if (emailModalOtpModal) {
            //   $('#emailotp').modal('hide');
            // }

            // const panConfirmationDone = document.getElementById('email2faotp');
            // if (panConfirmationDone) {
            //   $('#email2faotp').modal('hide');
            // }

            // emailModalOtpModal.classList.add('d-none');
            // emailModalOtpModal.classList.remove('d-block');

            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            // this.emailWindowBox();
          }
        });
    } else if (this.gmailparams.email != '' && this.otpFieldEmail != '') {
      // const emailModalOtpModal = document.getElementById(
      //   'emailotp'
      // ) as HTMLElement;
      // if (emailModalOtpModal) {
      //   $('#emailotp').modal('hide');
      // }

      // const panConfirmationDone = document.getElementById('email2faotp');
      // if (panConfirmationDone) {
      //   $('#email2faotp').modal('hide');
      // }

      const reqData = {
        Flag: 'SaveGmail',
        emailid: this.gmailparams.email,
        emailidverified: this.gmailparams.email_verified,
        GmailProfileName: this.gmailparams.name,
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        mobileno: window.sessionStorage.getItem('mobile'),
        utm_source: this.utm_source,
        utm_medium: this.utm_medium,
        utm_campaign: this.utm_campaign,
      };

      this.spinner.show();
      this._http
        .postRequest('api/v1/oauth/service/otp/savegmail', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          this.spinner.hide();
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );

            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              window.sessionStorage.getItem('mobile') ?? '',
              this.gmailparams.email,
              '',
              ''
            );

            this.MoengageService.trackEvent('Email Verified via Google', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              verificationmethod: 'Google Auth',
              EmailID: this.gmailparams.email,
            });

            // this.isRightOTP = true;
            // this.clearTimer();
            // this.clearEmailOTPFields();
            // this.removeModal();

            // const emailModalOtpModal = document.getElementById(
            //   'emailotp'
            // ) as HTMLElement;
            // if (emailModalOtpModal) {
            //   $('#emailotp').modal('hide');
            // }

            // const panConfirmationDone = document.getElementById('email2faotp');
            // if (panConfirmationDone) {
            //   $('#email2faotp').modal('hide');
            // }

            setTimeout(() => {
              this.router.navigate(['/uploadProcess', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            this.MoengageService.trackEvent('Google Authentication Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              verificationmethod: 'Google Auth',
              EmailID: this.responsePayload.email,
              ErrorMsg: response.message,
            });

            // const emailModalOtpModal = document.getElementById(
            //   'emailotp'
            // ) as HTMLElement;
            // if (emailModalOtpModal) {
            //   $('#emailotp').modal('hide');
            // }

            // const panConfirmationDone = document.getElementById('email2faotp');
            // if (panConfirmationDone) {
            //   $('#email2faotp').modal('hide');
            // }

            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            // this.emailWindowBox();
          }
        });
    }
  }

  emailTextPage() {
    // window.location.href = '/email-home-textpage'
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate(['/email-home-textpage']);
      this.spinner.hide();
    }, 200);
  }

  homeScreen() {
    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      window.location.href = 'http://localhost:4200/home';
    } else if (hostname === 'udn.sbisecurities.in') {
      window.location.href = 'https://udn.sbisecurities.in/diy/';
    } else if (hostname === 'diy.sbisecurities.in') {
      window.location.href = 'https://diy.sbisecurities.in/open-demat-account/';
    } else if (hostname === 'bridge.sbisecurities.in') {
      window.location.href = 'https://udn.sbisecurities.in/diy/';
    } else {
      window.location.href = '/home';
    }
  }
}
