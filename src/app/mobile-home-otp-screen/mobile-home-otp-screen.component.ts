import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Inject,
  NgZone,
  Renderer2,
  ViewChild,
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
  selector: 'app-mobile-home-otp-screen',
  templateUrl: './mobile-home-otp-screen.component.html',
  styleUrls: ['./mobile-home-otp-screen.component.css'],
})
export class MobileHomeOtpScreenComponent {
  @ViewChild('otpMobileInput') otpMobileInput: any | NgModel;
  @ViewChild('mobileInput') mobileInput: ElementRef | undefined;

  clientid: any;
  mobile: string = '';
  mobileOTPResponse: any;
  timeLeft: number = 30;
  interval: any;
  timerStart: any;
  displayMobile: any;
  timeroff: any = true;
  resendStatusMsg: string = '';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  page_source: string = '';

  sendMobileOtp: any = {
    mobile: '',
    fullname: '',
  };

  isWrongOTP: boolean = false;
  isRightOTP: boolean = false;
  mobileReq: boolean = false;
  mobileDigitReq: boolean = false;
  isDisabledLoginBtn: boolean = true;
  isMobileVerifyBtn: boolean = true;
  otpFieldMobile: any;

  otpMobile: any;
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
  ) {}

  ngOnInit(): void {

    this.meta.updateTag({
      name: 'description',
      content: '',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';

    this.utm_source = this.route.snapshot.queryParams['utm_source'] || 'NA';
    this.utm_medium = this.route.snapshot.queryParams['utm_medium'] || 'NA';
    this.utm_campaign = this.route.snapshot.queryParams['utm_campaign'] || 'NA';
    this.page_source = this.route.snapshot.queryParams['page_source'] || 'NA';
    this.status = this.route.snapshot.queryParams['status'];

    this.sendMobileOtp.mobile = sessionStorage.getItem('mobile') || '';
    this.sendMobileOtp.fullname = sessionStorage.getItem('NameSubmitted') || '';

    this.startTimerMobile();
    this.timeroff = true;

    this.route.queryParams.subscribe((params: any) => {
      if (Object.keys(params).length === 0) {
        this.spinner.hide();
        return;
      }

      // ---------- Step 1: Get Raw Query Params ----------
      this.mobileEncrpyt = decodeURIComponent(params.request || '');
      this.fullnameEncrpyt = decodeURIComponent(params.name_submitted || '');

      console.log('Encrypted mobile:', this.mobileEncrpyt);
      console.log('Encrypted name:', this.fullnameEncrpyt);

      if (!this.mobileEncrpyt && !this.fullnameEncrpyt) return;

      // ---------- Step 2: Normalize Ciphertext ----------
      let enc_mob = this.mobileEncrpyt;
      let enc_fullname = this.fullnameEncrpyt;

      enc_mob = enc_mob.replaceAll('/slash/g', '/');
      enc_mob = enc_mob.replaceAll('/plus/g', '+');
      enc_mob = enc_mob.replaceAll('/equal/g', '=');

      enc_fullname = enc_fullname.replaceAll('/slash/g', '/');
      enc_fullname = enc_fullname.replaceAll('/plus/g', '+');
      enc_fullname = enc_fullname.replaceAll('/equal/g', '=');

      console.log('Normalized mobile:', enc_mob);
      console.log('Normalized name:', enc_fullname);

      // ---------- Step 3: Run AES Decryption ----------
      this.mobileDecrpyt = this.aesService.decrypt(
        enc_mob,
        this.clientid,
        this.clientid,
      );
      this.fullnameDecrpyt = this.aesService.decrypt(
        enc_fullname,
        this.clientid,
        this.clientid,
      );

      console.log('Decrypted mobile:', this.mobileDecrpyt);
      console.log('Decrypted name:', this.fullnameDecrpyt);

      // ---------- Step 4: Save to UI + Session ----------
      this.sendMobileOtp.mobile = this.mobileDecrpyt;
      this.sendMobileOtp.fullname = this.fullnameDecrpyt;

      sessionStorage.setItem('mobile', this.mobileDecrpyt);
      sessionStorage.setItem('NameSubmitted', this.fullnameDecrpyt);

      sessionStorage.setItem('UTMSOURCE', this.utm_source);
      sessionStorage.setItem('UTMMEDIUM', this.utm_medium);
      sessionStorage.setItem('UTMCAMP', this.utm_campaign);
      sessionStorage.setItem('PAGESOURCE', this.page_source);

      if (this.status === 'valid') {
        this.mobileReq = false;
        this.mobileDigitReq = false;
      }
    });
  }

  startTimerMobile() {
    // this.clearTimer();
    // Announce to screen readers that the code was sent and when a new
    // one can be requested (WCAG 4.1.3 - status message for resend timer).
    this.resendStatusMsg = '';
    setTimeout(() => {
      this.resendStatusMsg =
        'Verification code sent to your mobile number. You can request another code in 30 seconds.';
    }, 100);
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

  onOtpChangeMobile(otpMobile: string) {
    this.zone.run(() => {
      this.otpFieldMobile = otpMobile;
      this.checkIfAllOTPMobileFilled();
      this.cdr.detectChanges();
    });
  }

  checkIfAllOTPMobileFilled() {
    const isComplete = this.otpFieldMobile?.length === 6;
    this.isMobileVerifyBtn = !isComplete;

    if (isComplete) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    } else {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    }
  }

  goHome() {
    this.removeModal();
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

  editMobileNumber() {
    if (this.page_source === 'women_page') {
      window.location.href =
        // 'https://awsuat.sbisecurities.in/broking-plan-for-women';
        'https://www.sbisecurities.in/broking-plan-for-women';
      return;
    }
    if (this.page_source === 'microsite_page') {
      window.location.href =
        // 'https://udn.sbisecurities.in/diy-microsite/open-account-dbg-001';
        'https://diy.sbisecurities.in/campaign/open-account-dbg-001';
      return;
    }
    if (this.page_source === 'prozero_page') {
      window.location.href =
        // 'https://udn.sbisecurities.in/diy-microsite/pro-zero';
        'https://diy.sbisecurities.in/campaign/pro-zero';
      return;
    }

    const hostname = window.location.hostname;
    if (hostname === 'localhost') {
      this.router.navigate(['/home']);
    } else if (hostname === 'diy.sbisecurities.in') {
      window.location.href = 'https://diy.sbisecurities.in/open-demat-account/';
    } else {
      window.location.href = 'https://udn.sbisecurities.in/diy/';
    }

    this.mobileInput?.nativeElement.focus();
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

  getMobileOtp(isRetry: boolean) {
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.clientid = '';
    this.clearTimer();
    // this.clearMobileOTPFields();
    if (this.sendMobileOtp.mobile.length == 0) {
      this.mobileReq = true;
      return;
    } else if (
      this.sendMobileOtp.mobile == null ||
      this.sendMobileOtp.mobile == ''
    ) {
      this.mobileDigitReq = false;
      this.mobileReq = true;
      return;
    } else if (this.sendMobileOtp.mobile.length < 10) {
      this.mobileDigitReq = true;
      this.mobileReq = false;
      return;
    } else {
      this.mobileReq = false;
    }
    const reqData = {
      Flag: 'InsertOtpMobile',
      name_submitted: this.sendMobileOtp.fullname,
      mobileno: this.sendMobileOtp.mobile,
      emailid: '',
      isRetry: isRetry,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };

    this.MoengageService.MoeInit();

    window.sessionStorage.setItem('mobile', reqData.mobileno);
    window.sessionStorage.setItem('NameSubmitted', reqData.name_submitted);

    this.spinner.show();
    this._http
      .postRequest('api/v1/oauth/service/otp/send', reqData)
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
        console.log('response', response);
        this.mobileOTPResponse = response;
        console.log('this.mobileOTPResponse', this.mobileOTPResponse);
        this.spinner.hide();
        this.startTimerMobile();
        this.timeroff = true;
        if (resp.body.status == true) {
          this.mobileReq = false;
          this.mobileDigitReq = false;
          // this.spinner.hide();
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
            this.spinner.hide();
            this.clearMobileOTPFields();
          }
        }
      });
  }

  getMobileOtpVerify(isRetry: boolean) {
    this.spinner.show();
    let Fullname = sessionStorage.getItem('NameSubmitted');

    this.utm_source = sessionStorage.getItem('UTMSOURCE') ?? 'NA';
    this.utm_medium = sessionStorage.getItem('UTMMEDIUM') ?? 'NA';
    this.utm_campaign = sessionStorage.getItem('UTMCAMP') ?? 'NA';
    console.log('this.utm_source', this.utm_source);
    console.log('this.utm_medium', this.utm_medium);
    console.log('this.utm_campaign', this.utm_campaign);

    let otpFieldMobile = this.otpFieldMobile;

    this.isWrongOTP = false;
    this.isRightOTP = false;
    this.isMobileVerifyBtn = false;
    const reqData = {
      Flag: 'VerifyOTPMobile',
      mobileno: this.sendMobileOtp.mobile,
      emailid: '',
      name_submitted: Fullname,
      isRetry: isRetry,
      otp: otpFieldMobile,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    console.log('reqData', reqData);

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
          this.isMobileVerifyBtn = true;
          return;
        }
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
        } else {
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
        }
        console.log("RESPONSE:", response.Table3[0])
        window.sessionStorage.setItem('token', response.Table[0].token ?? '');
        window.sessionStorage.setItem(
          'clientid',
          response.Table[0].FormNumber ?? '',
        );
        this.clientid = window.sessionStorage.getItem('clientid') ?? '';

        window.sessionStorage.setItem(
          'UTMSOURCE',
          response.Table[0].UTMSOURCE ?? 'NA',
        );

        window.sessionStorage.setItem(
              'yonobank',
              response.Table3[0].bankStatus
            );
            window.sessionStorage.setItem(
              'IsYono',
              response.Table[0].UTMSOURCE ?? 'NA'
            );
            window.sessionStorage.setItem(
              'YonoClient',
              response.Table[0].UTMSOURCE ?? 'NA'
            );
        
        this.utm_source = window.sessionStorage.getItem('UTMSOURCE') ?? 'NA';

        if (
          response.Table[0].PhoneNumberVerify !=
            window.sessionStorage.getItem('mobile') ||
          response.Table[0].VerifyOtp != this.otpFieldMobile
        ) {
          this.MoengageService.trackEvent('Mobile Verification Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Mobile OTP',
            verificationmethod: 'OTP',
            MobileNumber: this.sendMobileOtp.mobile,
            ErrorMsg: 'Session Expired or Unauthorized Access',
          });

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
            //window.sessionStorage.clear();
            //window.sessionStorage.clear();

            var ts = this.getNumericTimestamp();

            this.MoengageService.setUserAttributes(
              response.Table[0].FormNumber,
              this.sendMobileOtp.mobile,
              '',
              '',
              '',
            );

            this.MoengageService.trackEvent('Mobile Verified', {
              product_id: response.Table[0].FormNumber,
              product_name: 'Onboarding DIY',
              category: 'Mobile OTP',
              Account_Opened: 'No',
              verificationmethod: 'OTP',
              MobileNumber: this.sendMobileOtp.mobile,
            });

            console.log(this.sendMobileOtp.mobile + ts);

            // console.log('DSS0-->', response);
            // console.log('DSS1-->', response.Table1);
            // console.log('DSS2-->', response.Table2);

            if (
              response.Table1 == '' ||
              response.Table1.length == 0 ||
              response.Table1[0].dsw_StageUrl === '/email'
            ) {
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber,
              );
              this.isRightOTP = true;
              this.isWrongOTP = false;
              this.clearTimer();
              // mobileOtpModal.classList.remove('show');
              // $('#mobileotp').modal('hide');
              this.clearMobileOTPFields();
              // this.removeModal();
              // this.emailWindowBox();
              // window.location.href = '/email-home';
              this.router.navigate(['/email']);
              // this.mainContent = false;
            } else if (
              response.Table1[0].dsw_StageId != '' &&
              response.Table1[0].dsw_StageId != null &&
              response.Table1[0].dsw_StageId != '26' &&
              response.Table1[0].stagestaus != 'R'
            ) {
              //this.trackApplicationWindow();

              //window.sessionStorage.clear();
              //window.sessionStorage.clear();
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber,
              );

              this.isRightOTP = true;
              this.clearTimer();
              this.clearMobileOTPFields();
              if (response.Table2.length > 0) {
                window.sessionStorage.setItem('mode', response.Table2[0].mode);
                window.sessionStorage.setItem(
                  'selectedBankPrefix',
                  response.Table2[0].selectedBankPrefix,
                );
              }
              if (response.Table3.length > 0) {
                if (response.Table3[0].nomineeOptOut === 'Yes') {
                  window.sessionStorage.setItem(
                    'NomineeOptOut',
                    'NomineeOptOut',
                  );
                } else {
                  window.sessionStorage.removeItem('NomineeOptOut');
                }
              }

              this.router.navigate([response.Table1[0].dsw_StageUrl]);
              // window.location.href = '/email-home';

              // this.dismissTrackApplicationModal2();
            } else if (
              response.Table1[0].dsw_StageId === '26' &&
              response.Table1[0].stagestaus != 'R'
            ) {
              if (
                response.Table4[0].TradingSegment ===
                'Equity & Mutual Fund, Derivative'
              ) {
                //this.trackApplicationWindow();

                //window.sessionStorage.clear();
                //window.sessionStorage.clear();
                window.sessionStorage.setItem(
                  'FormNumber',
                  response.Table[0].FormNumber,
                );

                this.isRightOTP = true;
                this.clearTimer();
                // mobileOtpModal.classList.remove('show');
                this.clearMobileOTPFields();
                if (response.Table2.length > 0) {
                  window.sessionStorage.setItem(
                    'mode',
                    response.Table2[0].mode,
                  );
                  window.sessionStorage.setItem(
                    'selectedBankPrefix',
                    response.Table2[0].selectedBankPrefix,
                  );
                }

                if (response.Table3.length > 0) {
                  if (response.Table3[0].nomineeOptOut === 'Yes') {
                    window.sessionStorage.setItem(
                      'NomineeOptOut',
                      'NomineeOptOut',
                    );
                  } else {
                    window.sessionStorage.removeItem('NomineeOptOut');
                  }
                }

                this.router.navigate(['/thankyou'], {
                  queryParams: { esign: 'y' },
                });

                // this.dismissTrackApplicationModal2();
              } else {
                this.trackApplicationWindow2();
                window.sessionStorage.setItem(
                  'FormNumber',
                  response.Table[0].FormNumber,
                );
                this.isRightOTP = true;
                this.clearTimer();
                this.clearMobileOTPFields();
              }
            } else if (response.Table1[0].stagestaus === 'R') {
              //this.trackApplicationWindow();
              //window.sessionStorage.clear();
              //window.sessionStorage.clear();
              window.sessionStorage.setItem(
                'RejectStatus',
                response.Table1[0].stagestaus,
              );
              const rejectedRoutes = response.Table1.map(
                (entry: { dsw_StageUrl: any }) => entry.dsw_StageUrl,
              );
              this.navService.fetchRejectedRoutes(rejectedRoutes, 'home');
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber,
              );
              this.isRightOTP = true;
              this.clearTimer();
              this.clearMobileOTPFields();
            } else {
              //window.sessionStorage.clear();
              //window.sessionStorage.clear();
              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber,
              );
              this.isRightOTP = true;
              this.clearTimer();
              this.clearMobileOTPFields();
            }
          } else {
            this.MoengageService.trackEvent('Mobile Verification Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Mobile OTP',
              verificationmethod: 'OTP',
              MobileNumber: this.sendMobileOtp.mobile,
              ErrorMsg: response.Table[0].Msg,
            });

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
          }
        }
      });
  }

  getNumericTimestamp(): string {
    const now = new Date();
    return (
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0') +
      now.getMilliseconds().toString().padStart(3, '0')
    );
  }

  trackApplicationWindow2() {
    // this.goHome();
    $('#tracktimeline2').modal('show');
  }

  removeModal() {
    $('#tracktimeline2').modal('hide');
  }
}
