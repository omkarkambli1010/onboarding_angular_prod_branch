import {
  Component,
  HostListener,
  OnInit,
  NgZone,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { NgOtpInputConfig } from 'ng-otp-input';

import * as bootstrap from 'bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgModel } from '@angular/forms';
import { MoengagesdkService } from '../moengagesdk.service';
declare const google: any;
declare let $: any;

@Component({
    selector: 'app-yono-email',
    templateUrl: './yono-email.component.html',
    styleUrls: ['./yono-email.component.css'],
    standalone: false
})
export class YonoEmailComponent implements OnInit {
  @ViewChild('otpEmailInput') otpEmailInput: any | NgModel;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');
  clientid: any;
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  emailFormatVal: boolean = false;
  emailspecialchars: boolean = false;
  emailReq: boolean = false;
  Googleoath: boolean = true;
  emailmultiplesymb: boolean = false;
  sbiemailFormatVal: boolean = false;

  EmailPageFlag: boolean = true;
  EnterEmailIDFlag: boolean = false;
  OTPPageFlag: boolean = false;

  isValidEmailBtn: boolean = true;
  isEmailDisableBtn: boolean = true;

  googleprompt: string = '';
  googlebtn: boolean = false;
  googleHideBtn: boolean = false;

  isWrongOTP: boolean = false;
  isRightOTP: boolean = false;

  emailOTPResponse: any;
  timeLeft: number = 30;
  interval: any;
  timerStart: any;
  displayEmail: any;
  timeroff1: any = true;
  otpEmail: any;
  otpFieldEmail: any;

  sendOtp: any = {
    mobile: window.sessionStorage.getItem('mobile'),
    email: window.sessionStorage.getItem('yonoEmail') ?? '',
  };

  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };

  gmailparams: any = {
    email: '',
    name: '',
    email_verified: '',
    EmailError: '',
  };

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
    private chCookie: CookieService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private MoengageService: MoengagesdkService,
  ) {}

  ngOnInit(): void {
    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source = this.route.snapshot.queryParams['utm_source'] || 'YONO';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';
    this.validateEmail();

    this.MoengageService.MoeInit();
  }

  checkAtSymbolCount(inputString: string): number {
    return (inputString.match(/@/g) || []).length;
  }

  validateEmail() {
    var symbcount = this.checkAtSymbolCount(this.sendOtp.email);

    if (symbcount > 1) {
      this.emailmultiplesymb = true;

      this.isEmailDisableBtn = this.emailmultiplesymb;
    } else {
      this.emailmultiplesymb = false;

      this.isEmailDisableBtn = false;
    }

    this.emailReq = this.sendOtp.email.length === 0;

    this.emailFormatVal =
      !this.emailReq && !this.isEmailValid(this.sendOtp.email);

    this.emailspecialchars = this.checkEmailSecialchars(this.sendOtp.email);

    this.sbiemailFormatVal = this.sendOtp.email.includes('sbi.co.in');

    this.isEmailDisableBtn =
      this.emailReq ||
      this.emailFormatVal ||
      this.sbiemailFormatVal ||
      this.emailmultiplesymb ||
      this.emailspecialchars;
  }

  focusOutFunction() {
    this.validateEmail();
  }

  checkEmailSecialchars(email: string): boolean {
    const invalidCharsRegex = /[^a-z0-9_.@]/i;

    const isValidFormat = invalidCharsRegex.test(email);

    return isValidFormat;
  }

  isEmailValid(email: string): boolean {
    //const emailRegex = /^[a-z](?!.*[_.]{2})[a-z0-9_.]*@[a-z0-9]+\.[a-z]{2,}$/i;

    const emailRegex =
      /^[a-z](?!.*[_.]{2})[a-z0-9_.]*@[a-z0-9-]+(\.[a-z]{2,})+$/i;

    // const emailRegex = /^[a-zA-Z0-9][^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/i;

    const isValidFormat = emailRegex.test(email);
    const isExcludedDomain = email.endsWith('@sbi.co.in');
    return isValidFormat && !isExcludedDomain;
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

          //console.log('Reason: ', reason);

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

  responsePayload: any = null;

  handleGoogleResponse(response: any) {
    try {
      if (response.credential) {
        this.responsePayload = this.decodeJwtResponse(response.credential);
        if (this.responsePayload.email_verified == true) {
          this.getEmailOtpVerify(false);
        }
      } else {
      }
    } catch (error) {}
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
        .join(''),
    );
    return JSON.parse(jsonPayload);
  }

  delete_cookie(name: string) {
    document.cookie =
      name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  CheckGoogleoath() {
    if (this.Googleoath != true) {
      this.toastr.warning(
        'Please provide permission to fetch your data from Google or please enter Email ID manually',
        'Warning',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        },
      );
    } else {
      this.Googleoath = true;
    }

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  emailWindowBox() {
    const panConfirmationDone = document.getElementById('email2faotp');
    if (panConfirmationDone) {
      const myModal = new bootstrap.Modal(panConfirmationDone);
      myModal.show();
      // this.getEmailOtp(false);
    } else {
      this.removeModal();
    }
  }

  clearEmailOtpModal() {
    const emailModalOtpModal = document.getElementById(
      'emailotp',
    ) as HTMLElement;
    const emailIDModal = document.getElementById('email2faotp') as HTMLElement;
    const mobileOtpModal = document.getElementById('mobileotp') as HTMLElement;

    mobileOtpModal.classList.add('d-none');
    mobileOtpModal.classList.remove('d-block');
    emailIDModal.classList.add('d-none');
    emailIDModal.classList.remove('d-block');
    emailModalOtpModal.classList.add('d-none');
    emailModalOtpModal.classList.remove('d-block');
  }

  timer() {
    this.clearTimer();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 30;
      }
    }, 1000);
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

  checkIfAllOTPEmailFilled() {
    this.isValidEmailBtn = this.otpFieldEmail?.length !== 6;
    if (this.otpFieldEmail >= 6) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    } else if (this.otpFieldEmail === 6) {
      this.isValidEmailBtn = false;
    } else if (this.otpFieldEmail.length < 6) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    }
  }

  onOtpChangeEmail(otpEmail: string) {
    this.zone.run(() => {
      this.otpFieldEmail = otpEmail;
      this.checkIfAllOTPEmailFilled();
      this.cdr.detectChanges();
    });
  }

  getEmailOtp(isRetry: boolean) {
    this.spinner.show();

    // const emailModalOtpModal = document.getElementById(
    //   'emailotp'
    // ) as HTMLElement;
    // //console.log("Removing none");

    // emailModalOtpModal.classList.remove('d-none');
    // emailModalOtpModal.classList.add('d-block');

    this.clearTimer();
    this.clearEmailOTPFields();
    if (this.emailReq || this.emailFormatVal) {
      return;
    }
    this.isEmailDisableBtn = false;
    this.emailReq = false;
    this.isWrongOTP = false;
    this.isRightOTP = false;
    const reqData = {
      Flag: 'InsertOtpEmail',
      emailid: this.sendOtp.email,
      mobileno: window.sessionStorage.getItem('mobile'),
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
          //const emailModal = document.getElementById('email2faotp');
          //if (emailModal) {
          this.clearTimer();
          //emailModal.classList.remove('show');
          this.clearEmailOTPFields();
          //}
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
        }
        this.emailOTPResponse = response;
        if (resp.body.status === true) {
          $('#emailotp').modal('show');

          this.startTimerEmail();
          this.timeroff1 = true;

          this.EmailPageFlag = false;
          this.EnterEmailIDFlag = false;
          this.OTPPageFlag = true;

          this.MoengageService.setUserAttributes(
            window.sessionStorage.getItem('FormNumber') ?? '',
            window.sessionStorage.getItem('mobile') ?? '',
            this.sendOtp.email,
            '',
            '',
          );

          this.MoengageService.trackEvent('YONO Email OTP Sent', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'YONO Email OTP',
            verificationmethod: 'OTP',
            EmailID: this.sendOtp.email,
          });

          // this.mainContent = false;
        } else if (resp.body.status === false) {
          if (response.message === 'Internal server error') {
            this.toastr.error('Internal Server Error!', 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
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

          this.MoengageService.trackEvent('YONO Email OTP Sent Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'YONO Email OTP',
            verificationmethod: 'OTP',
            EmailID: this.sendOtp.email,
            ErrorMsg: response.message,
          });
        }
      });
  }

  getEmailOtpVerify(isRetry: boolean) {
    const emailModalOtpModal = document.getElementById(
      'emailotp',
    ) as HTMLElement;
    if (emailModalOtpModal) {
      $('#emailotp').modal('show');
    }

    // emailModalOtpModal.classList.remove('d-none');
    // emailModalOtpModal.classList.add('d-block');

    if (this.responsePayload != null) {
      const emailModalOtpModal = document.getElementById(
        'emailotp',
      ) as HTMLElement;
      if (emailModalOtpModal) {
        $('#emailotp').modal('hide');
      }

      const panConfirmationDone = document.getElementById('email2faotp');
      if (panConfirmationDone) {
        $('#email2faotp').modal('hide');
      }

      const reqData = {
        Flag: 'SaveGmail',
        emailid: this.responsePayload.email,
        emailidverified: this.responsePayload.email_verified,
        GmailProfileName: this.responsePayload.name,
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        mobileno: this.sendOtp.mobile,
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
                this.clientid,
              ),
            );

            this.isRightOTP = true;
            this.clearTimer();
            this.clearEmailOTPFields();
            this.removeModal();

            const emailModalOtpModal = document.getElementById(
              'emailotp',
            ) as HTMLElement;
            if (emailModalOtpModal) {
              $('#emailotp').modal('hide');
            }

            const panConfirmationDone = document.getElementById('email2faotp');
            if (panConfirmationDone) {
              $('#email2faotp').modal('hide');
            }

            setTimeout(() => {
              this.router.navigate(['/uploadProcess', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            const emailModalOtpModal = document.getElementById(
              'emailotp',
            ) as HTMLElement;
            if (emailModalOtpModal) {
              $('#emailotp').modal('hide');
            }

            const panConfirmationDone = document.getElementById('email2faotp');
            if (panConfirmationDone) {
              $('#email2faotp').modal('hide');
            }

            // emailModalOtpModal.classList.add('d-none');
            // emailModalOtpModal.classList.remove('d-block');

            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            this.emailWindowBox();
          }
        });
    } else if (this.gmailparams.email != '' && this.otpFieldEmail != '') {
      const emailModalOtpModal = document.getElementById(
        'emailotp',
      ) as HTMLElement;
      if (emailModalOtpModal) {
        $('#emailotp').modal('hide');
      }

      const panConfirmationDone = document.getElementById('email2faotp');
      if (panConfirmationDone) {
        $('#email2faotp').modal('hide');
      }

      const reqData = {
        Flag: 'SaveGmail',
        emailid: this.gmailparams.email,
        emailidverified: this.gmailparams.email_verified,
        GmailProfileName: this.gmailparams.name,
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        mobileno: this.sendOtp.mobile,
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
                this.clientid,
              ),
            );

            this.isRightOTP = true;
            this.clearTimer();
            this.clearEmailOTPFields();
            this.removeModal();

            const emailModalOtpModal = document.getElementById(
              'emailotp',
            ) as HTMLElement;
            if (emailModalOtpModal) {
              $('#emailotp').modal('hide');
            }

            const panConfirmationDone = document.getElementById('email2faotp');
            if (panConfirmationDone) {
              $('#email2faotp').modal('hide');
            }

            setTimeout(() => {
              this.router.navigate(['/uploadProcess', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            const emailModalOtpModal = document.getElementById(
              'emailotp',
            ) as HTMLElement;
            if (emailModalOtpModal) {
              $('#emailotp').modal('hide');
            }

            const panConfirmationDone = document.getElementById('email2faotp');
            if (panConfirmationDone) {
              $('#email2faotp').modal('hide');
            }

            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            this.emailWindowBox();
          }
        });
    } else {
      this.isWrongOTP = false;
      this.isRightOTP = false;
      let otpFieldEmail = this.otpFieldEmail;
      if (otpFieldEmail == '') {
        this.toastr.info('Please enter the OTP', 'Info', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        this.isValidEmailBtn = true;
        return;
      }
      this.isValidEmailBtn = false;
      const reqData = {
        Flag: 'VerifyOTPEmail',
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        emailid: this.sendOtp.email,
        mobileno: this.sendOtp.mobile,
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
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid,
              ),
            );
          }
          if (
            resp.body.message == 'OTP Verify successfully' &&
            resp.body.status == true
          ) {
            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              this.sendOtp.mobile,
              this.sendOtp.email,
              '',
              '',
            );

            this.MoengageService.trackEvent('YONO Email OTP Verified', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'YONO Email OTP',
              verificationmethod: 'OTP',
              EmailID: this.sendOtp.email,
            });

            const emailOtpModal = document.getElementById('emailotp');
            if (emailOtpModal) {
              this.isRightOTP = true;
              this.clearTimer();

              // $('#emailotp').modal('hide');

              // const emailModalOtpModal = document.getElementById(
              //   'emailotp'
              // ) as HTMLElement;
              // if (emailModalOtpModal) {
              //   $('#emailotp').modal('hide');
              // }

              const emailModalOtpModal = document.getElementById(
                'emailotp',
              ) as HTMLElement;
              if (emailModalOtpModal) {
                $('#emailotp').modal('hide');
              }

              const panConfirmationDone =
                document.getElementById('email2faotp');
              if (panConfirmationDone) {
                $('#email2faotp').modal('hide');
              }

              // emailOtpModal.classList.remove('show');
              this.clearEmailOTPFields();
              this.removeModal();
              // this.mainContent = false;
              setTimeout(() => {
                this.router.navigate(['/uploadProcess', 1]);
                this.spinner.hide();
              }, 200);
            }
          } else if (resp.body.status == false) {
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
              this.toastr.info(response.message, 'Info', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });
              this.isWrongOTP = false;
              this.isRightOTP = false;
            }

            this.MoengageService.trackEvent(
              'YONO Email OTP Verification Error',
              {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'YONO Email OTP',
                verificationmethod: 'OTP',
                Email: this.sendOtp.email,
                ErrorMsg: response.message
              }
            );
          }
        });
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

  clearEmailOTPFields() {
    if (this.otpFieldEmail) {
      this.otpEmailInput.setValue('');
      this.otpFieldEmail = '';
      this.isRightOTP = false;
      this.isWrongOTP = false;
    }
    this.clearTimer();
  }

  clearTimer() {
    // this.mainContent = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.timeLeft = 30;
  }

  BackToYonoEmail() {
    this.EmailPageFlag = true;
    this.EnterEmailIDFlag = false;
    this.OTPPageFlag = false;
  }

  EnterEmailID() {
    this.EmailPageFlag = false;
    this.EnterEmailIDFlag = true;
    this.OTPPageFlag = false;
  }

  BackToYonoMobile() {
    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/yono-mobile']);
      this.spinner.hide();
    }, 200);
  }

  // editEmail() {
  //   const emailModalOtpModal = document.getElementById('emailotp');
  //   if (emailModalOtpModal) {
  //     this.clearTimer();
  //     emailModalOtpModal.classList.remove('show');
  //     emailModalOtpModal.classList.add('d-none');

  //     this.removeModal();
  //     this.dismissEmailOtp();
  //     this.emailWindowBox();
  //   } else {
  //     this.dismissEmailOtp();
  //     this.clearEmailOTPFields();
  //     this.removeModal();
  //   }
  // }

  editEmail() {
    $('#emailotp').modal('hide'); // Note the leading #
    this.clearTimer();
    this.EmailPageFlag = true;
  }

  dismissEmailOtp() {
    const dismissEmailOtpModal = document.getElementById('emailotp');
    if (dismissEmailOtpModal) {
      dismissEmailOtpModal.classList.remove('show');
    }
    this.clearEmailOTPFields();
  }
}
