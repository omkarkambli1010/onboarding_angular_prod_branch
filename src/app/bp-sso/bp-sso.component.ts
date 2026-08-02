import { Component, ElementRef, OnInit, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MoengagesdkService } from '../moengagesdk.service';
import { NgModel } from '@angular/forms';
import { NgOtpInputConfig } from 'ng-otp-input';
import { NavigationService } from '../navigation.service';

declare let $: any;

@Component({
  selector: 'app-bp-sso',
  templateUrl: './bp-sso.component.html',
  styleUrls: ['./bp-sso.component.css']
})
export class BpSsoComponent implements OnInit{
    @ViewChild('mobilecloseModal') mobilecloseModal: any;
    @ViewChild('emailclosebutton') emailclosebutton: any;
    @ViewChild('otpMobileInput') otpMobileInput: any | NgModel;
    @ViewChild('otpEmailInput') otpEmailInput: any | NgModel;
  
  @ViewChild('canvasElement', { static: false })
  canvas!: ElementRef<HTMLCanvasElement>;
  PersonalFormOne: boolean = true;
  personalFormNumber: any;
  enteredPANNumber: string = '';
  panValidation: boolean = false;
  fourthCharValidation: boolean = false;
  specialCharValidation: boolean = false;
  dateValidation: boolean = false;
  panEnterValidation: boolean = false;
  panFullNameReq: boolean = false;
  clientid: any;
  panFullNameReqSpecial: boolean = false;
  panFullNameReqDigit: boolean = false;
  panFullNameReqSpace: boolean = false;
  id: any;
  otpFieldMobile: any;
  isWrongOTP: boolean = false;
  isRightOTP: boolean = false;
  panDetailsManual: any = {
    pannumber: '',
    dob: '',
    fullname_as_pancard: '',
  };
  sendOtp: any = {
    mobile: '',
    email: '',
    fullname: '',
    pan:''
  };
  guid: any;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  displayMobile: any;

  utm_medium: string = '';
  utm_campaign: string = '';
  isVerifyPanBtn: boolean = true;
  dateOfBirthId = 'PanBirthDate';
  formattedDOB: any;
  minDate: any;
  maxDate: any;
  panflag: any;
  ageBelow18warning: boolean = false;
  dateInput: string = '';
  date1: Date | null = null;
  interval: any;  
  timeLeft: number = 30;
  isMobileVerifyBtn: boolean = true;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };
  RejectStatus = window.sessionStorage.getItem('RejectStatus');
  timeroff: any = true;
  timeroff1: any = true;

  constructor(
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private _http: APIService,
    private aesService: AesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private navService: NavigationService,
    
    private datePipe: DatePipe,
    private router: Router,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Upload Process - Onboarding-DIY-PWA');
    this.meta.updateTag({
      name: 'description',
      content: 'Uploading the details of the customer.',
    });
    this.route.params.subscribe((params) => {
      const formNumber = params['formNumber'];
      this.setFormVisibility(formNumber);
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    // this.getExistingPanData();
    this.validateForm();
    const today = new Date();
    this.minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate()
    );
  }

  getExistingPanData() {
    this.spinner.show();
    var reqData = {
      flag: 'PAN',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        let IsYonoClient = window.sessionStorage.getItem('YonoClient') ?? '';
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          let IsPANFetch = response[0].IspanFetch;
          if (resp.body.message === 'Data found') {
            if (IsYonoClient === 'YONO' || IsYonoClient === 'Branch Portal' ) {
              //window.sessionStorage.removeItem('YonoClient');

              this.panDetailsManual.pannumber = response[0].pan;
              this.panDetailsManual.dob = response[0].dob;
              this.panDetailsManual.fullname_as_pancard =
                response[0].nameasperpan;
              this.isVerifyPanBtn = false;

              const pannumber = document.getElementById('EnterPanNo');
              // const dob = document.getElementById('PanBirthDate');
              // const fullname_as_pancard = document.getElementById('EnterFullNameCard');

              if (pannumber) {
                pannumber?.setAttribute('disabled', 'true');
              }
            } else if (IsPANFetch.toUpperCase() == 'YES') {
              this.panDetailsManual.pannumber = response[0].pan;

              this.panDetailsManual.dob = response[0].dob;

              this.panDetailsManual.fullname_as_pancard =
                response[0].nameasperpan;

              this.isVerifyPanBtn = false;
            } else {
              this.panDetailsManual.pannumber = response[0].pan;
              this.panDetailsManual.dob = response[0].dob;
              this.panDetailsManual.fullname_as_pancard =
                response[0].nameasperpan;
              this.isVerifyPanBtn = false;

              const pannumber = document.getElementById('EnterPanNo');
              const dob = document.getElementById('PanBirthDate');
              const fullname_as_pancard =
                document.getElementById('EnterFullNameCard');

              if (fullname_as_pancard && dob && pannumber) {
                fullname_as_pancard?.setAttribute('disabled', 'true');

                dob?.setAttribute('disabled', 'true');

                pannumber?.setAttribute('disabled', 'true');
              }

              ////console.log("Aadhar page",window.sessionStorage.getItem('AadharPage'))
              // if (
              //   window.sessionStorage.getItem('AadharPage') != '' ||
              //   window.sessionStorage.getItem('AadharPage') != null
              // ) {

              this.getDigilockerStatus();
              // this.openPanVerificationSuccessModal();
              //}
            }
          }
        }

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
      });
  }

  getDigilockerStatus() {
    this.spinner.show();
    var reqData = {
      flag: 'IsDigilocker',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        // let IsYonoClient = window.sessionStorage.getItem('YonoClient')
        //this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          if (resp.body.message === 'Data found') {
            if (
              response[0].IsDigilocker == 1 &&
              response[0].isKraBenefit.toUpperCase() === 'N'
            ) {
              this.spinner.hide();
              this.openPanVerificationSuccessModal();
            } else if (response[0].isKraBenefit.toUpperCase() === 'Y') {
              setTimeout(() => {
                this.spinner.hide();
                this.router.navigate(['/aadhar']);
              }, 200);
            } else {
              setTimeout(() => {
                this.spinner.hide();
                this.router.navigate(['/personalDetailsForm/1']);
              }, 200);
            }
          } else {
            this.spinner.hide();
            this.openPanVerificationSuccessModal();
          }
        }
      });
  }

  setFormVisibility(formNumber: string) {
    this.PersonalFormOne = false;
    switch (formNumber) {
      case '1':
        this.PersonalFormOne = true;
        break;
      default:
    }
  }

  checkInput(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.panDetailsManual.fullname_as_pancard = value;
  }

  updateDisplayedName(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.panFullNameReqSpecial = specialCharRegex.test(trimmedValue);
    this.panFullNameReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);
    if (
      trimmedValue.length > 0 &&
      !this.panFullNameReqSpecial &&
      !this.panFullNameReqDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.panDetailsManual.fullname_as_pancard = trimmedValue.toUpperCase();
      }
      this.panFullNameReqSpace = false;
    } else {
      this.panFullNameReqSpace = true;
    }
    this.validateForm();
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
    emailWindowBox() {
    const panConfirmationDone = document.getElementById('email2faotp');
    if (panConfirmationDone) {
      // const myModal = new bootstrap.Modal(panConfirmationDone);
      // myModal.show();
      // this.getEmailOtp(false);
      $('#email2faotp').modal('show');
    } else {
      this.removeModal();
    }
  }
    dismissTrackApplicationModal2() {
    const completeTrackApplication = document.getElementById('tracktimeline2');
    if (completeTrackApplication) {
      // completeTrackApplication.classList.remove('show');
      $('#tracktimeline2').modal('hide');
    }
    this.clearMobileOTPFields();
  }

    trackApplicationWindow2() {
    const timelineStatus = document.getElementById('tracktimeline2');
    if (timelineStatus) {
      // const myTimeLineModal = new bootstrap.Modal(timelineStatus);
      // myTimeLineModal.show();
      $('#tracktimeline2').modal('show');
    } else {
      this.removeModal();
    }
  }
  onKeyPress(event: KeyboardEvent): void {
    const char = event.key;
    const regExp = /^[a-zA-Z\s]*$/;

    if (!regExp.test(char)) {
      event.preventDefault();
    }
  }

  containsEmoji(str: string): boolean {
    const emojiPattern =
      /([\p{Emoji_Presentation}\uFE0F]|\u200D[\p{Emoji_Presentation}\uFE0F]|[\p{Emoji}\uFE0F])/gu;
    return emojiPattern.test(str);
  }

  redirectInvalidPersonalPage() {
    setTimeout(() => {
      const completePanModalError = document.getElementById(
        'completePanVerifyError'
      );
      if (completePanModalError) {
        const bootstrapModal = new bootstrap.Modal(completePanModalError);
        bootstrapModal.hide();
      }
    }, 2000);
  }

  validateForm() {
    var { pannumber, dob, fullname_as_pancard } = this.panDetailsManual;
    const panPattern = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/;
    const isValidDate =
      this.panDetailsManual.dob instanceof Date &&
      !isNaN(this.panDetailsManual.dob.getTime());
    const today = new Date();
    const minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );
    const maxDate = today;

    var name = fullname_as_pancard.trim();

    if (
      panPattern.test(pannumber) 

    ) {
      this.isVerifyPanBtn = false;
    } else {
      this.isVerifyPanBtn = true;
    }
      // this.panDetailsManual.dob != '' &&
      // this.panFullNameReqSpecial == false &&
      // this.panFullNameReqDigit == false &&
      // this.panFullNameReqSpace == false &&
      // name.replace(/\s/g, '').length >= 3
      // &&
      // this.fourthCharValidation == false &&
      // this.specialCharValidation == false 
    // this.isVerifyPanBtn = !((pannumber && panPattern.test(pannumber)) && (isValidDate && dob >= minDate && dob <= maxDate) || fullname_as_pancard);
  }
  startTimerMobile() {
    // this.clearTimer();
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
  completeVerifyPan(): void {
    const { pannumber, dob, fullname_as_pancard } = this.panDetailsManual;

    var name = fullname_as_pancard.trim();
    this.spinner.show();

    if (
      pannumber &&
      /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(pannumber)
    ) {
      const reqData = {
        pan:pannumber
      };
      // this.openPanVerificationLoadingModal();
      this._http
        .postRequest('api/v1/Yono/verifypan', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          this.guid = response.request_id;
          this.spinner.hide();
          // this.mobileOTPResponse = response;
          this.startTimerMobile();
          this.timeroff = true;

          if (response.status === true) {
          response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            $('#mobileotp').modal('show');
            console.log("WORKING, OTP SENT")
            console.log("response: ",response)
            window.sessionStorage.setItem('mobile', response[0].MobileNumber);
            window.sessionStorage.setItem('pan', response[0].pan);
            this.sendOtp.mobile = response.MobileNumber;
            this.sendOtp.pan = response.pan;

            // this.mobileReq = false;
            // this.mobileDigitReq = false;
          } else {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            setTimeout(() => {
              this.dismissModal();
              this.removeModal();
              this.spinner.hide();
            }, 500);


            this.toastr.error(response, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.spinner.hide();
          }
        });
    } else {
      setTimeout(() => {
        this.dismissModal();
        this.removeModal();
        this.spinner.hide();
      }, 500);

      this.MoengageService.trackEvent('PAN Verification Error', {
        product_id: window.sessionStorage.getItem('FormNumber') ?? '',
        //PAN: this.panDetailsManual.pannumber,
        NameasperPAN: this.panDetailsManual.fullname_as_pancard,
        DoBasperPAN: this.panDetailsManual.dob,
        product_name: 'Onboarding DIY',
        category: 'PAN Verification',
        ErrorMsg: 'Please fill in all required fields correctly',
      });

      this.toastr.error(
        'Please fill in all required fields correctly',
        'Error',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        }
      );
      this.spinner.hide();
    }
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
  clearTimer() {
    // this.mainContent = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.timeLeft = 30;
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
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
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

  openPanVerificationLoadingModal() {
    const panConfirmationDoneLoading =
      document.getElementById('completePanManual');
    if (panConfirmationDoneLoading) {
      const myModal = new bootstrap.Modal(panConfirmationDoneLoading);
      myModal.show();
    } else {
      this.dismissModal();
      this.removeModal();
    }
  }

  openPanVerificationSuccessModal() {
    const panConfirmationDone = document.getElementById(
      'completePanVerifyDone'
    );
    if (panConfirmationDone) {
      const myModal = new bootstrap.Modal(panConfirmationDone);
      myModal.show();
    } else {
      this.dismissModal();
    }
  }
  getMobileOtpVerify(isRetry: boolean) {
    this.spinner.show();
    let Fullname = sessionStorage.getItem('NameSubmitted');

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
      Flag: 'VerifyOTP',
      PAN:window.sessionStorage.getItem('pan'),
      OTP: otpFieldMobile,
    };
    this._http
      .postRequest('api/v1/Yono/verifyotp', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        //console.log('response', response);

        this.spinner.hide();

        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          console.log("responseverify: ", response)
          
          this.callyonoapi(response[0].code);



        } else {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          this.toastr.error(response, 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 2500,
          });
        }

      });
  }
  callyonoapi(refno: any) {
    this.spinner.show();

    var reqData = {
      flag: 'GetYonoDetailsBP',
      code: refno,
    };

    this._http
      .postRequest('api/v1/Yono/verifylead', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          this.spinner.hide();

          response.data = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          window.localStorage.clear();
          window.sessionStorage.clear();

          window.sessionStorage.setItem('token', response.data.Table[0].token ?? '');

          window.sessionStorage.setItem(
            'clientid',
            response.data.Table1[0].Formnumber ?? ''
          );

          this.clientid = window.sessionStorage.getItem('clientid') ?? '';

          if (response.data.Table1[0].MobileStatus === 'UNIQUE') {
            window.sessionStorage.setItem(
              'FormNumber',
              response.data.Table1[0].Formnumber
            );
            window.sessionStorage.setItem(
              'mobile',
              response.data.Table1[0].MobileNumber
            );
            window.sessionStorage.setItem(
              'yonobank',
              response.data.Table3[0].bankStatus
            );
            window.sessionStorage.setItem(
              'IsYono',
              response.data.Table1[0].UTMSOURCE
            );
            window.sessionStorage.setItem(
              'YonoClient',
              response.data.Table1[0].UTMSOURCE
            );
            window.sessionStorage.setItem(
              'yonoEmail',
              response.data.Table4[0].emailid
            );

            setTimeout(() => {
              this.spinner.hide();
              this.removeModal();
              this.dismissModal();

              this.router.navigate(['yono-email']);

            }, 200);
          } else if (response.data.Table1[0].MobileStatus === 'EXISTING') {
            window.sessionStorage.setItem(
              'FormNumber',
              response.data.Table1[0].Formnumber
            );
            window.sessionStorage.setItem(
              'yono_reference_number',
              response.data.Table1[0].yono_reference_number
            );
            window.sessionStorage.setItem(
              'ExistingMobile',
              response.data.Table1[0].MobileNumber
            );
            window.sessionStorage.setItem(
              'yonobank',
              response.data.Table3[0].bankStatus
            );
            window.sessionStorage.setItem(
              'IsYono',
              response.data.Table1[0].UTMSOURCE
            );
            window.sessionStorage.setItem(
              'YonoClient',
              response.data.Table1[0].UTMSOURCE
            );
            window.sessionStorage.setItem(
              'yonoEmail',
              response.data.Table4[0].emailid
            );

            setTimeout(() => {
              this.spinner.hide();
              this.removeModal();
              this.dismissModal();

              this.router.navigate(['yono-mobile']);

            }, 200);
          } else if (
            response.data.Table1[0].MobileStatus === 'EXISTING IN DIY'
          ) {
            if (response.data.Table1[0].dsw_StageUrl === '/email') {
              window.sessionStorage.setItem(
                'FormNumber',
                response.data.Table1[0].Formnumber
              );
              window.sessionStorage.setItem(
                'mobile',
                response.data.Table1[0].MobileNumber
              );
              window.sessionStorage.setItem(
                'yonobank',
                response.data.Table3[0].bankStatus
              );
              window.sessionStorage.setItem(
                'IsYono',
                response.data.Table1[0].UTMSOURCE
              );
              window.sessionStorage.setItem(
                'YonoClient',
                response.data.Table1[0].UTMSOURCE
              );
              window.sessionStorage.setItem(
                'yonoEmail',
                response.data.Table4[0].emailid
              );

              setTimeout(() => {
                this.spinner.hide();
                this.removeModal();
                this.dismissModal();

                this.router.navigate(['yono-email']);

              }, 200);
            } else {
              window.sessionStorage.setItem(
                'FormNumber',
                response.data.Table1[0].Formnumber
              );
              window.sessionStorage.setItem(
                'mobile',
                response.data.Table1[0].MobileNumber
              );
              window.sessionStorage.setItem(
                'yonobank',
                response.data.Table3[0].bankStatus
              );
              window.sessionStorage.setItem(
                'IsYono',
                response.data.Table1[0].UTMSOURCE
              );
              window.sessionStorage.setItem(
                'YonoClient',
                response.data.Table1[0].UTMSOURCE
              );
              window.sessionStorage.setItem(
                'yonoEmail',
                response.data.Table4[0].emailid
              );

              setTimeout(() => {
                this.spinner.hide();
                this.removeModal();
                this.dismissModal();

                this.router.navigate([response.data.Table1[0].dsw_StageUrl]);

              }, 200);
            }
          }
        } else {
          this.toastr.error(response.message, 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 2500,
          });

          this.spinner.hide();
        }
      });
  }


  checkPANDOBAge(): void {
    this.panDetailsManual.dob = this.datePipe.transform(
      this.panDetailsManual.dob,
      'dd/MM/yyyy'
    );
    if (this.panDetailsManual.dob) {
      let day: number, month: number, year: number;
      if (this.panDetailsManual.dob.includes('/')) {
        [day, month, year] = this.panDetailsManual.dob.split('/').map(Number);
      } else if (this.panDetailsManual.dob.includes('-')) {
        [year, month, day] = this.panDetailsManual.dob.split('-').map(Number);
      } else {
        console.error('Invalid date format');
        return;
      }
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        console.error('Invalid date format');
        return;
      }
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      this.ageBelow18warning = age < 18;
      if (this.ageBelow18warning == true) {
        // this.ageBelow18warning = true;

        this.MoengageService.trackEvent('PAN Verification Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          //PAN: this.panDetailsManual.pannumber,
          NameasperPAN: this.panDetailsManual.fullname_as_pancard,
          DoBasperPAN: this.panDetailsManual.dob,
          product_name: 'Onboarding DIY',
          category: 'PAN Verification',
          ErrorMsg: 'Age Is Below 18 years Old',
        });

        this.toastr.warning('Age Is Below 18 years Old', '', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
      } else {
        this.ageBelow18warning = false;
      }
    }
  }

  handleDateInput(event: any) {
    let value = event.target.value.replace(/\D/g, ''); // Remove non-digit characters
    let formattedValue = '';

    // Handle day input (DD)
    if (value.length >= 1) {
      if (+value[0] >= 4 && value.length === 1) {
        formattedValue += '0' + value[0];
        value = value.slice(1);
      } else {
        formattedValue += value.slice(0, 2);
        value = value.slice(2);
      }
      // Restrict day input to a maximum of 31
      if (parseInt(formattedValue, 10) > 31) {
        event.target.value = '';
        alert('Day cannot be greater than 31');
        return;
      }
    }
    if (formattedValue.length === 2 && value.length > 0) {
      formattedValue += '/'; // Add separator after DD
    }

    // Handle month input (MM)
    if (value.length >= 1) {
      if (parseInt(value[0], 10) >= 2 && value.length === 1) {
        value = '0' + value; // Prepend 0 if the month is >= 2
      }
      if (value.length >= 2) {
        formattedValue += value.slice(0, 2);
        value = value.slice(2);
        // Restrict month input to a maximum of 12
        if (parseInt(formattedValue.slice(3, 5), 10) > 12) {
          event.target.value = '';
          alert('Month cannot be greater than 12');
          return;
        }
        if (value.length >= 1) {
          formattedValue += '/'; // Add separator after MM
        }
      }
    }

    // Handle year input (YYYY)
    if (value.length > 0) {
      formattedValue += value.slice(0, 4); // Allow full year input
    }

    // Set the formatted value back into the input
    event.target.value = formattedValue;
  }

  handleKeyDown(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value;
    // Handle backspace key event
    if (event.key === 'Backspace') {
      // Check if last character is a slash, and remove it
      if (value.endsWith('/')) {
        input.value = value.slice(0, -1); // Remove last slash
        event.preventDefault(); // Prevent default backspace behavior
      }
    }
  }

  openPanVerificationErrorModal() {
    const panConfirmationError = document.getElementById(
      'completePanVerifyError'
    );
    if (panConfirmationError) {
      panConfirmationError.setAttribute(
        'data-bs-target',
        '#completePanVerifyError'
      );
      panConfirmationError.setAttribute('data-bs-toggle', 'modal');
      panConfirmationError.click();
    } else {
      this.dismissModal();
    }
  }

  dismissLoadingModal() {
    const successCheckLoadModal = document.getElementById('successCloseLoad');
    if (successCheckLoadModal) {
      successCheckLoadModal.setAttribute('data-bs-dismiss', 'modal');
      successCheckLoadModal.setAttribute('aria-label', 'Close');
      const bootstrapModalLoading = new bootstrap.Modal(successCheckLoadModal);
      bootstrapModalLoading.hide();
    }
  }

  dismissModal() {
    //console.log("DISMISS MODAL")

    const successCheckLoadingModal =
      document.getElementById('completePanManual');
    const successCheckModal = document.getElementById('successClose');
    const failureCheckModal = document.getElementById(
      'bankUploadStatementClose'
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
      'completePanVerifyDone'
    );
    if (completeVerifyPanDone) {
      completeVerifyPanDone.classList.remove('show');
    }
  }

  getInputMode(): string {
    const length = this.panDetailsManual.pannumber.length;
    if (length < 5 || length === 9) {
      return 'text';
    } else if (length >= 5 && length < 9) {
      return 'numeric';
    }
    return 'text';
  }

  onInput(event: any, showErrorMsg: boolean = false): void {
    let value = event.target.value.toUpperCase();
    //console.log("Original Value:", value);
    showErrorMsg = showErrorMsg || value.length === 10;
    //console.log("Show Error Message:", showErrorMsg);
    let part1 = value.substring(0, 5).replace(/[^A-Z]/g, '');
    let part2 = value.substring(5, 9).replace(/\D/g, '');
    let part3 = value.substring(9).replace(/[^A-Z]/g, '');
    //console.log("Parts:", part1, part2, part3);
    this.panDetailsManual.pannumber = part1 + part2 + part3;
    event.target.value = this.panDetailsManual.pannumber;
    //console.log("Formatted PAN Number:", this.panDetailsManual.pannumber);
    this.validateInput(this.panDetailsManual.pannumber, showErrorMsg);
  }

  validateInput(value: string, showErrorMsg: boolean): void {
    if (showErrorMsg) {
      const panPattern = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
      this.panValidation = !panPattern.test(value);

      this.fourthCharValidation = value.length >= 4 && value[3] !== 'P';
      this.specialCharValidation = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/.test(
        value
      );
    }
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        $('#mobileotp').modal('hide');
        backdrop.remove();
        // $('#emailotp').modal('hide');
        $('#email2faotp').modal('hide');
        $('#termsandcond').modal('hide');
        $('#tracktimeline2').modal('hide');
      }
    });
  }

  // clearDetails() {
  //   this.panDetailsManual.pannumber = '';
  //   this.panDetailsManual.dob = 'DD-MM-YYYY';
  //   this.panDetailsManual.fullname_as_pancard = '';
  // }

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName
    )}`;
  }
}
