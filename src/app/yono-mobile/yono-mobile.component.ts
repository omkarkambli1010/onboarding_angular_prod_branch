import {
  ChangeDetectorRef,
  Component,
  NgZone,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy
} from '@angular/core';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AesService } from '../aes.service';
import { APIService } from '../api.service';
import { NgModel } from '@angular/forms';
import { NgOtpInputConfig } from 'ng-otp-input';
import { NavigationService } from '../navigation.service';
import { MoengagesdkService } from '../moengagesdk.service';
declare let $: any;

@Component({
    selector: 'app-yono-mobile',
    templateUrl: './yono-mobile.component.html',
    styleUrls: ['./yono-mobile.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class YonoMobileComponent implements OnInit {
  @ViewChild('mobilecloseModal') mobilecloseModal: any;
  @ViewChild('otpMobileInput') otpMobileInput: any | NgModel;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');
  clientid: any;
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  yono_medium: string = '';

  MobilePageFlag: boolean = true;
  // OTPPageFlag: boolean = false;

  sendOtp: any = {
    mobile: '',
    email: '',
  };

  isDisabledLoginBtn: boolean = true;
  isMobileVerifyBtn: boolean = true;

  displaymobile: string = window.sessionStorage.getItem('ExistingMobile') ?? '';
  mobile: string = '';
  mobileOTPResponse: any;
  isWrongOTP: boolean = false;
  isRightOTP: boolean = false;
  mobileReq: boolean = false;
  mobileDigitReq: boolean = false;
  timeLeft: number = 30;
  interval: any;
  timerStart: any;
  displayMobile: any;
  timeroff: any = true;

  otpFieldMobile: any;
  otpMobile: any;

  ngOtpInput: any;
  otp: any;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
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
    private navService: NavigationService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source = this.route.snapshot.queryParams['utm_source'] || 'YONO';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.MoengageService.MoeInit();

    this.yono_medium = window.sessionStorage.getItem('UTM_MEDIUM') ?? '';

    this.sendOtp.mobile =
      window.sessionStorage.getItem('ExistingMobile') ??
      window.sessionStorage.getItem('mobile') ??
      '';

    if (this.yono_medium === 'TAB') {
      $('#mobileotp').modal('show');
      this.startTimerMobile();
      this.timeroff = true;
      this.mobileReq = false;
      this.mobileDigitReq = false;
    }
  }

  mobileNoValidation2(event: any) {
    let input = event.target.value;
    this.mobileNoValidation(event, true);
  }

  mobileNoValidation(event: any, showError: boolean) {
    this.mobileDigitReq = false;
    this.isDisabledLoginBtn = true;
    let input = event.target.value;
    input = input.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    if (input.length >= 1 && !['6', '7', '8', '9'].includes(input.charAt(0))) {
      input = input.slice(1);
    }
    event.target.value = input;

    if (input.length >= 10) this.isDisabledLoginBtn = false;

    if (showError) {
      if (input.length >= 10) {
        this.mobileReq = false;
        this.mobileDigitReq = false;
        this.isDisabledLoginBtn = false;
      } else {
        this.mobileReq = false;
        this.mobileDigitReq = true;
        this.isDisabledLoginBtn = true;
      }
    }
    if (input.length > 0) {
      this.sendOtp.mobile = input;
    } else {
    }
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }
  onOtpChangeMobile(otpMobile: string) {
    this.zone.run(() => {
      this.otpFieldMobile = otpMobile;
      this.checkIfAllOTPMobileFilled();
      this.cdr.detectChanges();
    });
  }

  checkIfAllOTPMobileFilled() {
    this.isMobileVerifyBtn = this.otpFieldMobile?.length !== 6;
    if (this.otpFieldMobile.length >= 6) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    } else if (this.otpFieldMobile === 6) {
      this.isMobileVerifyBtn = false;
    } else if (this.otpFieldMobile.length < 6) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    }
  }

  getMobileOtp(isRetry: boolean) {
    this.clearTimer();
    this.clearMobileOTPFields();
    if (this.sendOtp.mobile.length == 0) {
      this.mobileReq = true;
      return;
    } else if (this.sendOtp.mobile == null || this.sendOtp.mobile == '') {
      this.mobileDigitReq = false;
      this.mobileReq = true;
      return;
    } else if (this.sendOtp.mobile.length < 10) {
      this.mobileDigitReq = true;
      this.mobileReq = false;
      return;
    } else {
      this.mobileReq = false;
    }
    const reqData = {
      Flag: 'InsertOtpMobile',
      mobileno: this.sendOtp.mobile,
      emailid: this.sendOtp.email,
      isRetry: isRetry,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };
    window.sessionStorage.setItem('mobile', reqData.mobileno);
    this.spinner.show();
    this._http
      .postRequest('api/v1/oauth/service/otp/send', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        }
        this.mobileOTPResponse = response;
        if (resp.body.status == true) {
          // myModal.show();

          this.MoengageService.setUserAttributes(
            window.sessionStorage.getItem('FormNumber') ?? '',
            this.sendOtp.mobile,
            '',
            '',
            ''
          );

          this.MoengageService.trackEvent('YONO Mobile OTP Sent', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'YONO Mobile OTP',
            verificationmethod: 'OTP',
            MobileNumber: this.sendOtp.mobile,
          });

          $('#mobileotp').modal('show');
          this.startTimerMobile();
          this.timeroff = true;
          this.mobileReq = false;
          this.mobileDigitReq = false;

          // this.MobilePageFlag = false;
          // this.OTPPageFlag = true;

          // this.mainContent = false;
        } else if (resp.body.status == false) {
          if (response.message == 'Internal server error') {
            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.spinner.hide();
          } else if (
            response.message ===
            'Your Mobile OTP request limit is exhausted, please retry to log in after 15 minutes'
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

            this.clearMobileOTPFields();
          }

          this.MoengageService.trackEvent('YONO Mobile OTP Sent Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'YONO',
            verificationmethod: 'OTP',
            MobileNumber: this.sendOtp.mobile,
            ErrorMsg: response.message,
          });
        }
      });
  }

  getMobileOtpVerify(isRetry: boolean) {
    this.spinner.show();

    let otpFieldMobile = this.otpFieldMobile;

    if (otpFieldMobile == '') {
      this.toastr.info('Please enter the OTP', 'Info', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });
      this.isMobileVerifyBtn = true;
      return;
    }
    this.isWrongOTP = false;
    this.isRightOTP = false;
    this.isMobileVerifyBtn = false;

    const reqData = {
      Flag: 'YonoVerifyOTPMobile',
      mobileno: this.sendOtp.mobile,
      emailid: this.sendOtp.email,
      yono_reference_number:
        window.sessionStorage.getItem('yono_reference_number') ?? '',
      isRetry: isRetry,
      otp: otpFieldMobile,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/oauth/service/otp/yonoverify', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        //console.log('response', response);

        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        } else {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        }
        if (
          response.Table[0].PhoneNumberVerify !=
            window.sessionStorage.getItem('mobile') ||
          response.Table[0].VerifyOtp != this.otpFieldMobile
        ) {
          this.MoengageService.trackEvent(
            'YONO Mobile OTP Verification Error',
            {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'YONO Mobile OTP',
              verificationmethod: 'OTP',
              MobileNumber: this.sendOtp.mobile,
              ErrorMsg: 'Session Expired or Unauthorized Access',
            }
          );

          this.isWrongOTP = true;
          this.isRightOTP = false;

          this.toastr.error('Unauthorized', 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });
        } else {
          if (
            resp.body.message == 'OTP Verify successfully' &&
            resp.body.status == true
          ) {
            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              this.sendOtp.mobile,
              '',
              '',
              ''
            );

            this.MoengageService.trackEvent('YONO Mobile OTP Verified', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'YONO Mobile OTP',
              Account_Opened: 'No',
              verificationmethod: 'OTP',
              MobileNumber: this.sendOtp.mobile,
            });

            // //console.log("DSS-->", response)
            if (
              response.Table1 == '' ||
              response.Table1.length == 0 ||
              response.Table1[0].dsw_StageUrl === '/email'
            ) {
              //window.sessionStorage.clear();
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              this.isRightOTP = true;
              this.isWrongOTP = false;
              this.clearTimer();
              $('#mobileotp').modal('hide');
              this.clearMobileOTPFields();

              setTimeout(() => {
                this.router.navigate(['yono-email']);
                this.spinner.hide();
              }, 200);
              // this.mainContent = false;
            } else if (
              response.Table1[0].dsw_StageId != '' &&
              response.Table1[0].dsw_StageId != null &&
              response.Table1[0].dsw_StageId != '26' &&
              response.Table1[0].stagestaus != 'R'
            ) {
              //this.trackApplicationWindow();

              //window.sessionStorage.clear();
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              this.isRightOTP = true;
              this.clearTimer();
              $('#mobileotp').modal('hide');

              if (response.Table2.length > 0) {
                window.sessionStorage.setItem('mode', response.Table2[0].mode);
                window.sessionStorage.setItem(
                  'selectedBankPrefix',
                  response.Table2[0].selectedBankPrefix
                );
              }

              if (response.Table3.length > 0) {
                if (response.Table3[0].nomineeOptOut === 'Yes') {
                  window.sessionStorage.setItem(
                    'NomineeOptOut',
                    'NomineeOptOut'
                  );
                } else {
                  window.sessionStorage.removeItem('NomineeOptOut');
                }
              }

              this.router.navigate([response.Table1[0].dsw_StageUrl]);

              //this.dismissTrackApplicationModal2();
            } else if (
              response.Table1[0].dsw_StageId === '26' &&
              response.Table1[0].stagestaus != 'R'
            ) {
              //this.trackApplicationWindow2();
              window.localStorage.clear();
              window.sessionStorage.clear();
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              this.isRightOTP = true;
              $('#mobileotp').modal('hide');

              this.clearTimer();

              this.clearMobileOTPFields();
            } else if (response.Table1[0].stagestaus === 'R') {
              //this.trackApplicationWindow();

              window.localStorage.clear();
              window.sessionStorage.clear();

              window.sessionStorage.setItem(
                'RejectStatus',
                response.Table1[0].stagestaus
              );

              const rejectedRoutes = response.Table1.map(
                (entry: { dsw_StageUrl: any }) => entry.dsw_StageUrl
              );

              this.navService.fetchRejectedRoutes(rejectedRoutes, 'home');

              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              this.isRightOTP = true;
              $('#mobileotp').modal('hide');
              this.clearTimer();
              this.clearMobileOTPFields();

              this.removeModal();
              // this.mainContent = false;
            } else {
              window.localStorage.clear();
              window.sessionStorage.clear();
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              this.isRightOTP = true;
              $('#mobileotp').modal('hide');
              this.clearTimer();
              this.clearMobileOTPFields();
              this.removeModal();
              // this.mainContent = false;
            }
          } else {
            if (
              response.Table[0].Msg == 'Internal server error' &&
              response.status == 400
            ) {
              this.toastr.error(response.Table[0].statusText, 'Error', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });
            } else if (response.Table[0].Msg == 'OTP Limit Exceeded') {
              this.toastr.warning(response.Table[0].Msg, 'Warning', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });
            } else if (response.Table[0].Msg == 'Wrong Otp') {
              this.isWrongOTP = true;
              this.isRightOTP = false;
            } else {
              this.clearMobileOTPFields();
              this.toastr.info(response.Table[0].Msg, 'Info', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });
              this.isWrongOTP = false;
              this.isRightOTP = false;
            }

            this.MoengageService.trackEvent(
              'YONO Mobile OTP Verification Error',
              {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'YONO Mobile OTP',
                verificationmethod: 'OTP',
                MobileNumber: this.sendOtp.mobile,
                ErrorMsg: response.Table[0].Msg,
              }
            );
          }
        }
      });
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

  startTimerMobile() {
    this.clearTimer();
    let minute = 1;
    let seconds: number = minute * 30;
    let textSec: any = '0';
    let statSec: number = 30;
    this.displayMobile = `00:30`;
    const prefix = minute < 10 ? '0' : '';

    this.interval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 29;
      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displayMobile = `${prefix}${Math.floor(seconds / 30)}:${textSec}`;

      if (seconds == 0) {
        this.timeroff = false;
        this.clearTimer();
      }
    }, 1000);
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });
  }

  clearMobileOTPFields() {
    // this.mainContent = false;
    if (this.otpFieldMobile) {
      this.otpMobileInput.setValue('');
      this.otpFieldMobile = '';
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

  EnterMobileNo() {
    this.MobilePageFlag = true;
    // this.OTPPageFlag = false;
  }
}
