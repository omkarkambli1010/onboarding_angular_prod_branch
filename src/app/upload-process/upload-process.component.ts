import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { MoengagesdkService } from '../moengagesdk.service';
import Splide from '@splidejs/splide';

@Component({
  selector: 'app-upload-process',
  templateUrl: './upload-process.component.html',
  styleUrls: ['./upload-process.component.css'],
})
export class UploadProcessComponent {
  @ViewChild('splideEl', { static: false }) splideEl!: ElementRef;
  splide!: Splide;
  isSampleOpen: boolean = false;

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
  rmcodenull: boolean = false;
  id: any;

  panDetailsManual: any = {
    pannumber: '',
    dob: '',
    fullname_as_pancard: '',
    rmcode: '',
  };
  guid: any;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
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
  isGeneralIncRmDisabled: boolean = false;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  banners_list = [
    {
      id: 1,
      bgImage: 'assets/images/diy/Pan_slide_1.png',
    },
    {
      id: 2,
      bgImage: 'assets/images/diy/Pan_slide_2.png',
    },
    {
      id: 3,
      bgImage: 'assets/images/diy/Pan_slide_3.png',
    },
  ];

  constructor(
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private _http: APIService,
    private aesService: AesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private router: Router,
    private MoengageService: MoengagesdkService,
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

    this.utm_source = window.sessionStorage.getItem('UTMSOURCE') ?? '';

    if (this.utm_source === 'ISMART_GI') {
      this.utm_medium = window.sessionStorage.getItem('UTMMEDIUM') ?? '';
      this.setGeneralIncRmCode();
    } else {
      this.utm_medium =
        this.route.snapshot.queryParams['utm_medium'] || 'organic';
    }

    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    console.log('this.utm_source', this.utm_source);
    console.log('this.utm_medium', this.utm_medium);
    this.getExistingPanData();
    this.validateForm();
    const today = new Date();
    this.minDate = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate(),
    );
    this.maxDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate(),
    );
  }

  ngAfterViewInit() {
    new Splide('.splide', {
      type: 'loop',
      perPage: 1,
      arrows: false,
      pagination: true,
      autoplay: true,
      interval: 1000,
      pauseOnHover: true,
    }).mount();
  }
  
  setGeneralIncRmCode(): void {
    if (this.utm_source === 'ISMART_GI') {
      const sessionRmCode = window.sessionStorage.getItem('UTMMEDIUM') ?? '';

      this.utm_medium = sessionRmCode;
      this.panDetailsManual.rmcode = sessionRmCode;

      this.isGeneralIncRmDisabled = sessionRmCode.trim() !== '';
    }
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
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
          let IsPANFetch = response[0].IspanFetch;
          if (resp.body.message === 'Data found') {
            if (IsYonoClient === 'YONO' || IsYonoClient === 'Branch Portal') {
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

              this.panDetailsManual.rmcode = response[0].rmcode;

              const rmcode = document.getElementById('rmcode');

              if (
                this.panDetailsManual.rmcode == '' ||
                this.panDetailsManual.rmcode == null
              ) {
                rmcode?.removeAttribute('disabled');
                console.log('rmcode', false);
              } else {
                rmcode?.setAttribute('disabled', 'true');
                console.log('rmcode', true);
              }

              this.isVerifyPanBtn = false;
            } else {
              this.panDetailsManual.pannumber = response[0].pan;
              this.panDetailsManual.dob = response[0].dob;
              this.panDetailsManual.fullname_as_pancard =
                response[0].nameasperpan;

              this.panDetailsManual.rmcode = response[0].rmcode;

              const pannumber = document.getElementById('EnterPanNo');
              const dob = document.getElementById('PanBirthDate');
              const fullname_as_pancard =
                document.getElementById('EnterFullNameCard');

              const rmcode = document.getElementById('rmcode');

              if (fullname_as_pancard && dob && pannumber) {
                fullname_as_pancard?.setAttribute('disabled', 'true');

                dob?.setAttribute('disabled', 'true');

                pannumber?.setAttribute('disabled', 'true');

                if (
                  this.panDetailsManual.rmcode == '' ||
                  this.panDetailsManual.rmcode == null
                ) {
                  rmcode?.removeAttribute('disabled');
                  console.log('rmcode', false);
                } else {
                  rmcode?.setAttribute('disabled', 'true');
                  console.log('rmcode', true);
                }
              }

              this.isVerifyPanBtn = false;
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
        this.setGeneralIncRmCode();

        this.MoengageService.MoeInit();

        setTimeout(() => {
          this.MoengageService.setUserAttributes(
            window.sessionStorage.getItem('FormNumber') ?? '',
            '',
            '',
            '',
            '',
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
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
          if (resp.body.message === 'Data found') {
            if (
              response[0].IsDigilocker == 1 &&
              response[0].isKraBenefit.toUpperCase() === 'N'
            ) {
              // this.openPanVerificationSuccessModal();
              setTimeout(() => {
                // this.dismissModal();
                // this.removeModal();
                this.router.navigate(['/digilocker-screen']);
                this.spinner.hide();
              }, 500);
            } else if (response[0].isKraBenefit.toUpperCase() === 'Y') {
              setTimeout(() => {
                this.router.navigate(['/aadhar']);
                this.spinner.hide();
              }, 200);
            } else {
              setTimeout(() => {
                this.router.navigate(['/personalDetailsForm/1']);
                this.spinner.hide();
              }, 200);
            }
          } else {
            // this.openPanVerificationSuccessModal();
            setTimeout(() => {
              // this.dismissModal();
              // this.removeModal();
              this.router.navigate(['/digilocker-screen']);
              this.spinner.hide();
            }, 500);
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
    value = value.toUpperCase();
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

  onKeyPress(event: KeyboardEvent): void {
    const char = event.key;
    const regExp = /^[a-zA-Z\s]*$/;

    if (!regExp.test(char)) {
      event.preventDefault();
    }
  }

  onKeyPressRMCode(event: KeyboardEvent): void {
    const char = event.key;
    const regExp = /^[a-zA-Z0-9\s]*$/;

    if (!regExp.test(char)) {
      event.preventDefault();
    }
  }

  rmcodecheck(event: any) {
    let value = event.target.value;

    if (
      this.utm_source != 'Retailsales' &&
      this.utm_source != 'PAISALO' &&
      this.utm_source != 'ISMART_GI' &&
      (value == '' || value == null)
    ) {
      this.rmcodenull = true;
      this.isVerifyPanBtn = true;
    } else {
      this.rmcodenull = false;
      this.validateForm();
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
        'completePanVerifyError',
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
      today.getDate(),
    );
    const maxDate = today;

    var name = fullname_as_pancard.trim();

    if (
      panPattern.test(pannumber) &&
      this.fourthCharValidation == false &&
      this.specialCharValidation == false &&
      this.panDetailsManual.dob != '' &&
      this.panFullNameReqSpecial == false &&
      this.panFullNameReqDigit == false &&
      this.panFullNameReqSpace == false &&
      name.replace(/\s/g, '').length >= 3
    ) {
      this.isVerifyPanBtn = false;
    } else {
      this.isVerifyPanBtn = true;
    }

    // this.isVerifyPanBtn = !((pannumber && panPattern.test(pannumber)) && (isValidDate && dob >= minDate && dob <= maxDate) || fullname_as_pancard);
  }

  completeVerifyPan(): void {
    const { pannumber, dob, fullname_as_pancard } = this.panDetailsManual;

    var name = fullname_as_pancard.trim();

    if (
      pannumber &&
      /^[A-Za-z]{5}[0-9]{4}[A-Za-z]{1}$/.test(pannumber) &&
      dob &&
      dob !== 'DD/MM/YYYY' &&
      name.replace(/\s/g, '').length >= 3
    ) {
      const reqData = {
        pannumber,
        dob: this.panDetailsManual.dob,
        fullname_as_pancard,
        FormNumber: window.sessionStorage.getItem('FormNumber'),
        rmcode: this.panDetailsManual.rmcode,
        utm_source: this.utm_source,
        utm_medium: this.utm_medium,
        utm_campaign: this.utm_campaign,
      };
      this.openPanVerificationLoadingModal();
      this._http
        .postRequest('api/v1/verifypan/PanManualEntry', reqData)
        .subscribe((resp) => {
          window.sessionStorage.setItem(
            'NameAsPerPan',
            fullname_as_pancard ?? '',
          );
          let response: any = resp.body;
          this.guid = response.request_id;
          if (response.status === true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid,
              ),
            );
            //window.sessionStorage.setItem('pannumber', pannumber);
            //window.sessionStorage.setItem('dob', this.formattedDOB);
            // window.sessionStorage.setItem(
            //   'fullname_as_pancard',
            //   fullname_as_pancard
            // );
            // if (response.KraResponse === 'false') {
            //   setTimeout(() => {
            //     this.dismissModal();
            //     this.toastr.warning(response.Msg, '', {
            //       positionClass: 'toast-bottom-center',
            //       timeOut: 2000,
            //     });
            //     this.spinner.hide();
            //   }, 500);
            // }
            // else if (response.ckycRespnse.CKYCStatus === 'CKYCSuccess') {
            //   setTimeout(() => {
            //     this.openPanVerificationSuccessModal();
            //     this.spinner.hide();
            //   }, 500);
            //   this.dismissModal();
            // }
            // else {
            // setTimeout(() => {
            //   this.openPanVerificationErrorModal();
            //   this.spinner.hide();
            // }, 3000);
            //this.dismissModal();

            let fullname = this.panDetailsManual.fullname_as_pancard.split(' ');
            let lastName = fullname[fullname.length - 1];

            this.MoengageService.trackEvent('PAN Verified', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              //PAN: this.panDetailsManual.pannumber,
              NameasperPAN: this.panDetailsManual.fullname_as_pancard,
              DoBasperPAN: this.panDetailsManual.dob,
              product_name: 'Onboarding DIY',
              category: 'PAN Verification',
            });

            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              '',
              '',
              this.panDetailsManual.fullname_as_pancard,
              lastName,
            );

            console.log('PAN VERIFICATION Response', response);
            const pannumber = document.getElementById('EnterPanNo');
            const dob = document.getElementById('PanBirthDate');
            const fullname_as_pancard =
              document.getElementById('EnterFullNameCard');

            if (fullname_as_pancard && dob && pannumber) {
              fullname_as_pancard?.setAttribute('disabled', 'true');

              dob?.setAttribute('disabled', 'true');

              pannumber?.setAttribute('disabled', 'true');
            }
            if (response.skipDigilocker == 'Y') {
              setTimeout(() => {
                this.dismissModal();
                this.removeModal();
                // this.openPanVerificationSuccessModal()
                this.router.navigate(['aadhar']);

                this.spinner.hide();
              }, 500);
            } else {
              setTimeout(() => {
                this.dismissModal();
                this.removeModal();
                // this.openPanVerificationSuccessModal()
                this.getDigilockerStatus();
                this.spinner.hide();
              }, 500);
            }
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
              ErrorMsg: response.message,
            });

            this.toastr.error(response.message, 'Error', {
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
        },
      );
      this.spinner.hide();
    }
  }

  redirectDigi() {
    this.spinner.show();
    setTimeout(() => {
      this.dismissModal();
      this.removeModal();
      this.router.navigate(['/digilocker-screen']);
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
      'completePanVerifyDone',
    );
    if (panConfirmationDone) {
      const myModal = new bootstrap.Modal(panConfirmationDone);
      myModal.show();
    } else {
      this.dismissModal();
    }
  }

  checkPANDOBAge(): void {
    this.panDetailsManual.dob = this.datePipe.transform(
      this.panDetailsManual.dob,
      'dd/MM/yyyy',
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
      'completePanVerifyError',
    );
    if (panConfirmationError) {
      panConfirmationError.setAttribute(
        'data-bs-target',
        '#completePanVerifyError',
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
        value,
      );
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

  // clearDetails() {
  //   this.panDetailsManual.pannumber = '';
  //   this.panDetailsManual.dob = 'DD-MM-YYYY';
  //   this.panDetailsManual.fullname_as_pancard = '';
  // }

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName,
    )}`;
  }
}
