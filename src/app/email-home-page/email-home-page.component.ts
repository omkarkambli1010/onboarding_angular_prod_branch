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

@Component({
  selector: 'app-email-home-page',
  templateUrl: './email-home-page.component.html',
  styleUrls: ['./email-home-page.component.css'],
})
export class EmailHomePageComponent {
  emailOTPResponse: any;
  timeroff: any = true;
  displayEmail: any;
  timeroff1: any = true;
  interval: any;

  clientid: any;
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  status: string = '';

  googleprompt: string = '';
  googlebtn: boolean = false;
  Googleoath: boolean = true;
  responsePayload: any = null;
  isEmailDisableBtn: boolean = true;

  sendEmailOtp: any = {
    email: '',
  };

  isWrongOTP: boolean = false;
  isRightOTP: boolean = false;

  emailmultiplesymb: boolean = false;
  sbiemailFormatVal: boolean = false;
  emailReq: boolean = false;
  emailFormatVal: boolean = false;
  emailspecialchars: boolean = false;

  otpFieldEmail: any;

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
    this.title.setTitle(
      'Open Demat Account - Free Demat & Trading Account Opening Online | SBI Securities'
    );

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

    // if (this.sendEmailOtp.email) {
    //   window.sessionStorage.setItem('email', this.sendEmailOtp.email);
    // } else {
    //   window.sessionStorage.removeItem('email');
    // }
    this.sendEmailOtp.email = sessionStorage.getItem('email');
  }

  validateEmail() {
    var symbcount = this.checkAtSymbolCount(this.sendEmailOtp.email);

    if (symbcount > 1) {
      this.emailmultiplesymb = true;
      this.isEmailDisableBtn = this.emailmultiplesymb;
    } else {
      this.emailmultiplesymb = false;
      this.isEmailDisableBtn = false;
    }
    this.emailReq = this.sendEmailOtp.email.length === 0;
    this.emailFormatVal =
      !this.emailReq && !this.isEmailValid(this.sendEmailOtp.email);
    this.emailspecialchars = this.checkEmailSecialchars(
      this.sendEmailOtp.email
    );
    this.sbiemailFormatVal = this.sendEmailOtp.email.includes('sbi.co.in');
    this.isEmailDisableBtn =
      this.emailReq ||
      this.emailFormatVal ||
      this.sbiemailFormatVal ||
      this.emailmultiplesymb ||
      this.emailspecialchars;
  }

  checkAtSymbolCount(inputString: string): number {
    return (inputString.match(/@/g) || []).length;
  }

  checkEmailSecialchars(email: string): boolean {
    const invalidCharsRegex = /[^a-z0-9_.@]/i;
    const isValidFormat = invalidCharsRegex.test(email);
    return isValidFormat;
  }

  isEmailValid(email: string): boolean {
    const emailRegex =
      /^[a-z](?!.*[_.]{2})[a-z0-9_.]*@[a-z0-9-]+(\.[a-z]{2,})+$/i;
    const isValidFormat = emailRegex.test(email);
    const isExcludedDomain = email.endsWith('@sbi.co.in');
    return isValidFormat && !isExcludedDomain;
  }

  emailScreen() {
    // window.location.href = '/email-home'
    this.router.navigate(['/email']);
  }

  startTimerEmail() {
    this.clearTimer();
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
  }

  getEmailOtp(isRetry: boolean) {
    window.sessionStorage.setItem('email', this.sendEmailOtp.email);
    this.spinner.show();
    if (this.emailReq || this.emailFormatVal) {
      return;
    }
    let reqData = {
      Flag: 'InsertOtpEmail',
      emailid: window.sessionStorage.getItem('email'),
      mobileno: window.sessionStorage.getItem('mobile'),
      isRetry: isRetry,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      Formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/oauth/service/otp/send', reqData)
      .subscribe((resp) => {
        this.spinner.hide();
        let response: any = resp.body;
        if (response.status === true) {
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
          // window.location.href = '/email-home-otp'
          this.spinner.show();
          setTimeout(() => {
            this.router.navigate(['/email-home-otp']);
            this.spinner.hide();
          }, 200);

        } else if (resp.body.status === false) {
          this.MoengageService.trackEvent('Email OTP Sent Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Email OTP',
            EmailID: this.sendEmailOtp.email,
            verificationmethod: 'OTP',
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
          }
        }
      });
  }
}
