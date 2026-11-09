import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Renderer2,
  ViewChild,
  DOCUMENT
} from '@angular/core';
import { NgModel } from '@angular/forms';
import { NgOtpInputConfig } from 'ng-otp-input';
import { CookieService } from 'ngx-cookie-service';
import { MoengagesdkService } from '../moengagesdk.service';

import { NavigationService } from '../navigation.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Meta, Title } from '@angular/platform-browser';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
declare let $: any;

@Component({
    selector: 'app-email-home-otp-screen',
    templateUrl: './email-home-otp-screen.component.html',
    styleUrls: ['./email-home-otp-screen.component.css'],
    standalone: false
})
export class EmailHomeOtpScreenComponent {
  @ViewChild('otpEmailInput') otpEmailInput: any | NgModel;

  clientid: any;
  emailOTPResponse: any;
  timeLeft: number = 30;
  interval: any;
  timerStart: any;
  displayEmail: any;
  timeroff1: any = true;
  resendStatusMsg: string = '';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  sendEmailOtp: any = {
    email: '',
    mobile: '',
  };

  isWrongOTP: boolean = false;
  isRightOTP: boolean = false;
  mobileReq: boolean = false;
  mobileDigitReq: boolean = false;
  isDisabledLoginBtn: boolean = true;
  isEmailVerifyBtn: boolean = true;
  isValidEmailBtn: boolean = true;
  otpFieldEmail: any;

  otpEmail: any;
  ngOtpInput: any;
  otp: any;
  status: string = '';
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };

  homeURL: any;
  mobileEncrpyt: any;
  mobileDecrpyt: any;
  fullnameEncrpyt: any;
  fullnameDecrpyt: any;

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
    private cdr: ChangeDetectorRef,
    private navService: NavigationService,
    private chCookie: CookieService,
    private MoengageService: MoengagesdkService,
    @Inject(DOCUMENT) private document: Document,
  ) { }

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

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');
    this.sendEmailOtp.email = sessionStorage.getItem('email');
    this.sendEmailOtp.mobile = sessionStorage.getItem('mobile');
    console.log('this.sendEmailOtp.email', this.sendEmailOtp.email);
    console.log('this.sendEmailOtp.mobile', this.sendEmailOtp.mobile);

    this.startTimerEmail();
    this.timeroff1 = true;
    this.mobileReq = false;
    this.mobileDigitReq = false;
  }

  startTimerEmail() {
    this.clearTimer();
    // WCAG 4.1.3 - the countdown is only shown visually, so announce that the
    // code went out and when another one can be requested.
    this.resendStatusMsg = '';
    setTimeout(() => {
      this.resendStatusMsg =
        'Verification code sent to your email. You can request another code in 30 seconds.';
    }, 100);
    let minute = 1;
    let seconds: number = minute * 30;
    let textSec: any = '0';
    let statSec: number = 30;
    this.displayEmail = `00:30`;
    const prefix = minute < 10 ? '0' : '';

    this.interval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 29;
      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displayEmail = `${prefix}${Math.floor(seconds / 30)}:${textSec}`;

      if (seconds == 0) {
        this.timeroff1 = false;
        this.clearTimer();
      }
    }, 1000);
  }

  clearTimer() {
    // this.mainContent = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.timeLeft = 30;
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  onOtpChangeEmail(otpEmail: string) {
    this.zone.run(() => {
      this.otpFieldEmail = otpEmail;
      this.checkIfAllOTPEmailFilled();
      this.cdr.detectChanges();
    });
  }

  checkIfAllOTPEmailFilled() {
    const isComplete = this.otpFieldEmail?.length === 6;
    this.isEmailVerifyBtn = !isComplete;

    if (isComplete) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    } else {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    }
  }

  getEmailOtp(isRetry: boolean) {
    this.spinner.show();
    this.clearTimer();
    this.clearEmailOTPFields();
    this.isEmailVerifyBtn = false;
    this.isWrongOTP = false;
    this.isRightOTP = false;
    const reqData = {
      Flag: 'InsertOtpEmail',
      emailid: this.sendEmailOtp.email,
      mobileno: this.sendEmailOtp.mobile,
      isRetry: isRetry,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      Formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    window.sessionStorage.setItem('email', reqData.emailid);
    this._http
      .postRequest('api/v1/oauth/service/otp/send', reqData)
      .subscribe((resp) => {
        this.spinner.hide();
        let response: any = resp.body;

        if (response.status === true) {
          this.clearTimer();
          this.clearEmailOTPFields();
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.MoengageService.setUserAttributes(
            window.sessionStorage.getItem('FormNumber') ?? '',
            window.sessionStorage.getItem('mobile') ?? '',
            this.sendEmailOtp.email,
            '',
            ''
          );

          this.MoengageService.trackEvent('Email OTP Sent', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Email OTP',
            verificationmethod: 'OTP',
            EmailID: this.sendEmailOtp.email,
          });
        }
        this.emailOTPResponse = response;
        this.startTimerEmail();
        this.timeroff1 = true;
        if (resp.body.status === true) {
        } else if (resp.body.status === false) {
          this.MoengageService.trackEvent('Email OTP Sent Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Email OTP',
            verificationmethod: 'OTP',
            EmailID: this.sendEmailOtp.email,
            ErrorMsg: response.message,
          });

          if (response.message === 'Internal server error') {
            this.toastr.error('Internal Server Error!', 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.spinner.hide();
          } else if (
            response.message ===
            'Your Email OTP request limit is exhausted, please retry to log in after 15 minutes'
          ) {
            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });
            this.spinner.hide();
          } else {
            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });

            this.clearEmailOTPFields();
          }
        }
      });
  }

  getEmailOtpVerify(isRetry: boolean) {
    this.isWrongOTP = false;
    this.isRightOTP = false;
    let otpFieldEmail = this.otpFieldEmail;

    this.isWrongOTP = false;
    this.isRightOTP = false;
    this.isEmailVerifyBtn = false;

    const reqData = {
      Flag: 'VerifyOTPEmail',
      Formnumber: window.sessionStorage.getItem('FormNumber'),
      emailid: this.sendEmailOtp.email,
      mobileno: this.sendEmailOtp.mobile,
      isRetry: isRetry,
      otp: otpFieldEmail,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/oauth/service/otp/verify', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == false) {
          this.toastr.error(response.message, 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 4000,
          });
          this.isWrongOTP = false;
          this.isRightOTP = false;
          this.isEmailVerifyBtn = true;
          return;
        }
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        }
        if (
          resp.body.message == 'OTP Verify successfully' &&
          resp.body.status == true
        ) {
          this.MoengageService.setUserAttributes(
            window.sessionStorage.getItem('FormNumber') ?? '',
            window.sessionStorage.getItem('mobile') ?? '',
            this.sendEmailOtp.email,
            '',
            ''
          );

          this.MoengageService.trackEvent('Email Verified', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Email OTP',
            verificationmethod: 'OTP',
            EmailID: this.sendEmailOtp.email,
          });

          this.clearTimer();
          // this.router.navigate(['/uploadProcess', 1]);
          window.sessionStorage.removeItem('email');
          setTimeout(() => {
            $('#emailSucessModal').modal('show');
            setTimeout(() => {
              $('#emailSucessModal').modal('hide');
              // window.location.href = '/uploadProcess/1';
              this.router.navigate(['/uploadProcess/1']);
              this.spinner.hide();
            }, 2000);
          }, 200);
        } else if (resp.body.status == false) {
          this.MoengageService.trackEvent('Email OTP Verification Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Email OTP',
            verificationmethod: 'OTP',
            EmailID: this.sendEmailOtp.email,
            ErrorMsg: response.message
          });

          if (
            response.message == 'Internal server error' &&
            response.status == 400
          ) {
            this.toastr.error(response.statusText, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
          } else if (response.message == 'OTP Limit Exceeded') {
            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
          } else if (response.message == 'Wrong Otp') {
            this.isWrongOTP = true;
            this.isRightOTP = false;
          } else {
            this.clearEmailOTPFields();
            this.toastr.info(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.isWrongOTP = false;
            this.isRightOTP = false;
          }
        } else {
          //this.spinner.show();

          this.MoengageService.trackEvent('Google Authentication Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Google Authentication',
            EmailID: this.sendEmailOtp.email,
            verificationmethod: 'Google Auth',
            ErrorMsg: response.message,
          });

          setTimeout(() => {
            this.router.navigate(['/email-home-textpage']);
            this.spinner.hide();
          }, 200);

          this.toastr.error(response.message, 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });

          //this.spinner.hide();
        }
      });
  }

  clearEmailOTPFields() {
    if (this.otpFieldEmail) {
      this.otpEmailInput.setValue('');
      this.otpFieldEmail = '';
      this.isRightOTP = false;
      this.isWrongOTP = false;
    }
    this.clearTimer();
  }

  editEmailID() {
    // window.location.href = '/email-home-textpage'
    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/email-home-textpage']);
      this.spinner.hide();
    }, 200);
  }
}
