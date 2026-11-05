import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { NavigationService } from '../navigation.service';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import ImageCompressor from 'image-compressor.js';
import { Observable, Observer } from 'rxjs';
import { interval, take } from 'rxjs';
import { MoengagesdkService } from '../moengagesdk.service';

declare var $: any;
@Component({
  selector: 'app-reverse-penny-drop',
  templateUrl: './reverse-penny-drop.component.html',
  styleUrls: ['./reverse-penny-drop.component.css'],
})
export class ReversePennyDropComponent implements OnInit {
  clientid: any;
  guid: any;
  PersonalResponse: any;
  PersonalFormNine: boolean = false;
  personalFormNumber: any;

  Apistart: any;

  filteredBanks: any[] = [];
  searchQuery: string = '';
  selectedUPI: any;
  requestID: any;
  verifyIndianUPIBanksList: any;
  upiURL: any;

  isPersonalForm: boolean = true;
  isBankAccountForm: boolean = true;

  selectedBank: any;
  fieldTextType: boolean = false;

  enteredIFSCCode: string = '';
  enteredIFSCNumber: string = '';

  indianBanks: any;
  indianUPIBanksList: any;
  selectedUPIBank: any;

  ReenterBankWarning: boolean = false;
  ifscBankValidation: boolean = false;
  IFSCResponse: any = [
    {
      BBM_LOCATION: '',
    },
  ];

  ACbankValidation: boolean = false;
  ACbankValiSpecial: boolean = false;
  ACbankValiSpace: boolean = false;

  openmodelMismatch: any;

  accountNumber: string = '';
  reenteredAccountNumber: string = '';

  selectedBankName: any;
  selectedBankLogo: any;
  selectedBankPrefix: any;

  ifscBankValidationSpecial: boolean = false;
  ifscBankValidationSpace: boolean = false;

  RevPennyDropFormOne: boolean = false;
  RevPennyDropFormTwo: boolean = false;
  RevPennyDropFormThree: boolean = false;

  ReenterACBankValidation: boolean = false;
  ReenterACBankValidationSpecial: boolean = false;
  ReenterACBankValidationSpace: boolean = false;

  // Image Cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  translateH = 0;
  translateV = 0;
  scale = 1;
  aspectRatio = 4 / 3;
  zoomFactor: number = 1.0;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {
    translateUnit: 'px',
  };
  imageURL?: string;
  loading = false;
  allowMoveImage = false;
  hidden = false;
  file: any;
  bankProofImg: any;

  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  rpdWebHookInterval: any;
  private countdownSubscription: any;
  rpdData: any;
  IsIos: any;

  hideCTAbtn: boolean = false;
  showLimitmsg: boolean = false;

  upiPayLink: any = '';
  // remainingTime: number = 60; // 5 minutes = 300 seconds
  remainingTime: number = 180; // 5 minutes = 300 seconds
  minutes: number = 0;
  seconds: number = 0;
  isMobile: boolean = false;
  ShowQR: boolean = false;

  timeOutStatus: boolean = false;
  apiExecstart: number = 1;
  // url: string = environment.url;

  RPDActiveStatus: boolean = true;
  PDActiveStatus: boolean = true;

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
    private navService: NavigationService,
    private MoengageService: MoengagesdkService,
  ) { }

  ngOnInit(): void {
    this.isIOS();

    // this.IsIos = window.sessionStorage.getItem('isIos');

    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Personal Details of the customer.',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.detectDevice();
    this.getBankConfiguration();
    this.route.params.subscribe((params) => {
      const formNumber = params['formNumber'];
      this.setFormVisibility(formNumber);
    });
    // const bankFailModal = document.getElementById('BankFail');

    // if (bankFailModal) {
    //   const myModal = new bootstrap.Modal(bankFailModal);
    //   myModal.show();
    // }
  }

  setFormVisibility(formNumber: string) {
    this.RevPennyDropFormOne = false;
    this.RevPennyDropFormTwo = false;
    this.RevPennyDropFormThree = false;

    switch (formNumber) {
      case '1':
        this.RevPennyDropFormOne = true;
        console.log("isMobile", this.isMobile)
        if (this.isMobile) {
          this.getUPIMasterDetails();
        }
        break;
      case '2':
        this.RevPennyDropFormTwo = true;
        this.getPennyDropFormTwo();
        break;
      case '3':
        this.RevPennyDropFormThree = true;
        break;
      default:
        break;
    }
  }
  enterManually() {
    this.spinner.show();
    console.log('PID');
    clearInterval(this.rpdWebHookInterval);
    this.MoengageService.trackEvent('Bank Verification Method', {
      product_id: window.sessionStorage.getItem('FormNumber') ?? '',
      Method_used: 'Penny Drop',
      product_name: 'Onboarding DIY',
      category: 'Bank Verification',
    });

    setTimeout(() => {
      // this.router.navigate(['/PennyDrop', 1]);
      this.router.navigate(['/PennyDrop', 2]);
      this.spinner.hide();
    }, 200);
  }
  enterPaymentGateway() {
    this.ShowQR = true;
    this.getUPIMasterDetails();
  }

  getPennyDropFormTwo() {
    this.spinner.show();
    var reqData = {
      flag: 'Bank',
      formnumber: window.sessionStorage.getItem('FormNumber'),
      Mode: 'RPD',
    };

    clearInterval(this.rpdWebHookInterval);

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response.data = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );

          if (resp.body.message === 'Data found') {
            //console.log(response);

            if (this.RejectStatus != 'R') {
              this.enteredIFSCNumber = response.data[0].acc_holder_ifsc;

              this.accountNumber = response.data[0].acc_number;

              this.rpdData = response.data[0].bankname_address;

              if (window.sessionStorage.getItem('TriggerEvent') != 'N') {
                this.MoengageService.trackEvent('Bank Verification UPI', {
                  product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                  Bank_Name: this.rpdData,
                  IFSC_Code: this.enteredIFSCNumber,
                  Account_Number: this.accountNumber,
                  product_name: 'Onboarding DIY',
                  Response: 'Bank Account Already Verified Successfully',
                  category: 'Bank Verification',
                });
              }

              window.sessionStorage.removeItem('TriggerEvent');

              this.spinner.hide();

              window.sessionStorage.setItem('mode', 'RPD');
            } else {
              this.enteredIFSCNumber = response.data[0].acc_holder_ifsc;

              this.accountNumber = response.data[0].acc_number;

              this.rpdData = response.data[0].bankname_address;

              this.spinner.hide();
            }
          } else {
            this.spinner.hide();
          }
        } else {
          this.spinner.hide();
        }
      });
  }

  // getUPIMasterDetails() {

  //   this.spinner.show()
  //   this.personalFormNumber = window.sessionStorage.getItem('FormNumber');
  //   var reqData = {
  //     flag: 'GetUPIMasterdetls',
  //     formNumber: window.sessionStorage.getItem('FormNumber'),
  //   };
  //   this._http
  //     .postRequest('api/v1/BankDetails/CreateRPDService', reqData)
  //     .subscribe((resp: any) => {
  //       //console.log('Response', resp);
  //       let response: any = resp.body;
  //       if (response.status == true && response.message != 'Bank Account Already Verified') {
  //         response = JSON.parse(
  //           this.aesService.decrypt(response.data, this.clientid, this.clientid)
  //         );
  //         //console.log("DECRYPTED RESP", response)

  //         this.indianUPIBanksList = this.filterUPIOptions(response);
  //         if (this.indianUPIBanksList.length > 0) {
  //           this.requestID = this.indianUPIBanksList[0].requestId;
  //         }

  //         setTimeout(() => {
  //           this.spinner.hide();
  //         }, 300);
  //       }
  //       else {
  //         this.router.navigate(['/reversePennyDrop', 2]);

  //         this.spinner.hide();

  //         this.toastr.success(response.message, '', {
  //           positionClass: 'toast-bottom-center',
  //           timeOut: 2000,
  //         });
  //       }
  //     });
  // }

  getUPIMasterDetails() {
    this.spinner.show();
    this.personalFormNumber = window.sessionStorage.getItem('FormNumber');
    var reqData = {
      flag: 'GetUPIMasterdetls',
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/BankDetails/CreateRPDService', reqData)
      .subscribe((resp: any) => {
        //console.log('Response', resp);
        let response: any = resp.body;
        if (
          response.status == true &&
          response.message != 'Bank Account Already Verified' &&
          response.message != 'Reverse Penny Drop Limit Exceeded'
        ) {
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
          console.log('DECRYPTED RESP', response);

          this.indianUPIBanksList = this.filterUPIOptions(response);
          // this.indianUPIBanksList = this.filterUPIOptions(response);

          if (this.indianUPIBanksList.length > 0) {
            this.requestID = this.indianUPIBanksList[0].requestId;
          }

          this.showLimitmsg = false;
          this.hideCTAbtn = false;

          setTimeout(() => {
            this.spinner.hide();
          }, 500);

          if (!this.isMobile) {
            if (response[3].UpiName == 'Others') {
              //console.log('Response', response[3].UpiName);

              this.upiPayLink = response[3].upiLink;
              //console.log('upiLink- ', this.upiPayLink);

              this.getApiStarttime();
              clearInterval(this.rpdWebHookInterval)
              this.rpdWebHookInterval = setInterval(() => {
                this.getVerifyBankDetailsStatus('desktop');
              }, 5000);
              this.startCountdown();
            }
          }
        } else if (response.message === 'Reverse Penny Drop Limit Exceeded') {
          this.MoengageService.trackEvent('Bank Verification Method Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Method_used: 'UPI',
            ErrorMsg: response.message,
            product_name: 'Onboarding DIY',
            category: 'Bank Verification',
          });

          this.showLimitmsg = true;
          this.hideCTAbtn = true;
          this.upiPayLink = '';

          setTimeout(() => {
            this.spinner.hide();
          }, 500);
        } else if (response.message === 'Bank Account Already Verified') {
          this.showLimitmsg = false;
          this.hideCTAbtn = false;

          setTimeout(() => {
            this.router.navigate(['/reversePennyDrop', 2]);
            this.spinner.hide();
          }, 200);

          this.toastr.success(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2500,
          });
        } else {
          this.MoengageService.trackEvent('Bank Verification Method Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Method_used: 'UPI',
            ErrorMsg: response.message,
            product_name: 'Onboarding DIY',
            category: 'Bank Verification',
          });

          this.showLimitmsg = false;
          this.hideCTAbtn = false;

          this.spinner.hide();

          this.toastr.success(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 4000,
          });
        }
      });
  }

  redirecttoPennyDrop() {
    this.spinner.show();

    setTimeout(() => {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
      this.router.navigate(['/PennyDrop', 1]);
      this.spinner.hide();
    }, 200);
  }

  selectUPIBank(data: any) {
    if (!data || !data.UpiName || !data.upiLink) {
      alert('Please select a valid UPI bank option.');

      this.MoengageService.trackEvent('Bank Verification UPI Error', {
        product_id: window.sessionStorage.getItem('FormNumber') ?? '',
        VerificationID: this.requestID,
        ErrorMsg: 'Please select a valid UPI bank option.',
        product_name: 'Onboarding DIY',
        category: 'Bank Verification',
      });

      return;
    }
    this.selectedUPIBank = data;
    const selectedUPIBank = data.UpiName.replace(/"/g, '');

    this.upiURL = data.upiLink;

    this.MoengageService.trackEvent('Bank Verification UPI', {
      product_id: window.sessionStorage.getItem('FormNumber') ?? '',
      App_Selected: selectedUPIBank,
      VerificationID: this.requestID,
      UPI_URL: this.upiURL,
      product_name: 'Onboarding DIY',
      category: 'Bank Verification',
    });

    sessionStorage.setItem('selectedUPIBank', selectedUPIBank);
    this.sendVerifyBank();

    //console.log('Updated upiURL', this.upiURL);
  }

  filterUPIOptions(upiList: any[]): any[] {
    if (this.IsIos == 'true') {
      return upiList.filter((bank) => bank.UpiName !== 'Others');
    }
    return upiList;
  }

  async sendVerifyBank() {
    this.spinner.show();

    if (
      !this.selectedUPIBank ||
      !this.selectedUPIBank.UpiName ||
      !this.selectedUPIBank.upiLink
    ) {
      this.MoengageService.trackEvent('Bank Verification UPI Error', {
        product_id: window.sessionStorage.getItem('FormNumber') ?? '',
        VerificationID: this.requestID,
        ErrorMsg: 'Please select a valid UPI bank option.',
        product_name: 'Onboarding DIY',
        category: 'Bank Verification',
      });

      this.toastr.warning('Please select a valid UPI bank option.', '', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });

      this.spinner.hide();
      return;
    }

    // if (this.upiURL) {

    //   const Appopened = this.launchUPILink(this.upiURL);

    //   if (Appopened) {

    //     this.getApiStarttime();

    //     this.rpdWebHookInterval = setInterval(() => {
    //       this.getVerifyBankDetailsStatus();
    //     }, 5000);
    //   }
    //   else {
    //     this.showSpinnerWithFallback();
    //   }

    // }

    // if (this.upiURL) {

    //   setTimeout(async () => {

    //     const Appopened = await this.launchUPILink(this.upiURL);

    //     //console.log('UPI App: ', Appopened)

    //     if (Appopened) {

    //       this.getApiStarttime();

    //       this.rpdWebHookInterval = setInterval(() => {
    //         this.getVerifyBankDetailsStatus();
    //       }, 5000);
    //     }

    //   }, 400);

    // } else {

    //   this.showSpinnerWithFallback();
    // }

    if (this.upiURL) {
      try {
        const appOpened = await this.launchUPILink(this.upiURL);
        //console.log('UPI App: ', appOpened);

        if (appOpened) {
          this.getApiStarttime();
          this.rpdWebHookInterval = setInterval(() => {
            this.getVerifyBankDetailsStatus('mobile');
          }, 5000);
        } else {
          this.showSpinnerWithFallback();
        }
      } catch (error) {
        console.error('Error launching UPI link:', error);
        this.showSpinnerWithFallback();
      }
    } else {
      this.showSpinnerWithFallback();
    }
  }

  getApiStarttime() {
    this.Apistart = Date.now();

    //console.log('Apistart', this.Apistart);

    return;
  }

  getVerifyBankDetailsStatus(flag: string) {
    if ((this.apiExecstart = 1)) {
      this.apiExecstart = 0;
      var reqData = {
        flag: 'getrpdewebhookdetls',
        formNumber: window.sessionStorage.getItem('FormNumber'),
        request_id: this.requestID,
      };
      //console.log(reqData);

      if (flag != 'desktop') {
        this.spinner.show();
      }

      console.log('Flag', flag);
      this._http
        .postRequest('api/v1/BankDetails/getwehbookrpdDetails', reqData)
        .subscribe((resp) => {
          let ApitimeOut = 0;

          if (flag != 'desktop') {
            ApitimeOut = 1000 * 60;
          } else if (flag === 'desktop') {
            ApitimeOut = 3000 * 60;
          }

          //console.log('ApitimeOut', ApitimeOut);

          let response: any = resp.body;

          //console.log('Response: ', response);

          if (response.status == true) {
            response.data = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid,
              ),
            );

            //console.log('Response Decrypted: ', response);

            //console.log('RPD: ', response.data);

            //clearInterval(this.rpdWebHookInterval);

            if (response.message != 'Name Mismatch-MiddleRange') {
              clearInterval(this.rpdWebHookInterval);

              window.sessionStorage.setItem('mode', 'RPD');

              this.enteredIFSCNumber = response.data[0].acc_holder_ifsc;

              this.accountNumber = response.data[0].acc_number;

              this.rpdData = response.data[0].bankname_address;

              this.MoengageService.trackEvent(
                'Bank Verification UPI Response',
                {
                  product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                  UPI_App_Selected: sessionStorage.getItem('selectedUPIBank'),
                  Bank_Name: this.rpdData,
                  IFSC_Code: this.enteredIFSCNumber,
                  Account_Number: this.accountNumber,
                  VerificationID: this.requestID,
                  product_name: 'Onboarding DIY',
                  Response: 'Bank Account Verified Successfully',
                  category: 'Bank Verification',
                },
              );

              window.sessionStorage.setItem('TriggerEvent', 'N');

              setTimeout(() => {
                this.router.navigate(['/reversePennyDrop', 2]);

                this.spinner.hide();
              }, 200);
            } else if (response.message === 'Name Mismatch-MiddleRange') {
              clearInterval(this.rpdWebHookInterval);

              window.sessionStorage.setItem('mode', 'RPD');

              this.enteredIFSCNumber = response.data[0].acc_holder_ifsc;

              this.accountNumber = response.data[0].acc_number;

              this.rpdData = response.data[0].bankname_address;

              this.MoengageService.trackEvent(
                'Bank Verification UPI Response',
                {
                  product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                  UPI_App_Selected: sessionStorage.getItem('selectedUPIBank'),
                  Bank_Name: this.rpdData,
                  IFSC_Code: this.enteredIFSCNumber,
                  Account_Number: this.accountNumber,
                  VerificationID: this.requestID,
                  product_name: 'Onboarding DIY',
                  Response: 'Bank Account Verified Successfully',
                  category: 'Bank Verification',
                },
              );

              window.sessionStorage.setItem('TriggerEvent', 'N');

              this.spinner.hide();

              this.openSameNamePopupModal();
            } else {
              this.toastr.error('Please Try Again...', '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3000,
              });

              this.MoengageService.trackEvent(
                'Bank Verification UPI Response Error',
                {
                  product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                  UPI_App_Selected: sessionStorage.getItem('selectedUPIBank'),
                  Bank_Name: this.rpdData,
                  IFSC_Code: this.enteredIFSCNumber,
                  Account_Number: this.accountNumber,
                  VerificationID: this.requestID,
                  ErrorMsg: 'Please Try Again',
                  product_name: 'Onboarding DIY',
                  category: 'Bank Verification',
                },
              );

              this.getUPIMasterDetails();

              this.spinner.hide();
            }
          } else if (response.message === 'Name Mismatch') {
            clearInterval(this.rpdWebHookInterval);

            this.MoengageService.trackEvent(
              'Bank Verification UPI Response Error',
              {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                UPI_App_Selected: sessionStorage.getItem('selectedUPIBank'),
                Bank_Name: this.rpdData,
                IFSC_Code: this.enteredIFSCNumber,
                Account_Number: this.accountNumber,
                VerificationID: this.requestID,
                ErrorMsg:
                  'Your PAN name and bank details don’t match. Please try adding another bank account.',
                product_name: 'Onboarding DIY',
                category: 'Bank Verification',
              },
            );
            const bankFailModal = document.getElementById('BankFail');

            if (bankFailModal) {
              const myModal = new bootstrap.Modal(bankFailModal);
              myModal.show();
            }
            // this.toastr.error(
            //   'Your PAN name and bank details don’t match. Please try adding another bank account.',
            //   '',
            //   {
            //     positionClass: 'toast-bottom-center',
            //     timeOut: 5000,
            //   }
            // );

            this.getUPIMasterDetails();

            this.spinner.hide();
          } else if (
            response.message ===
            'This bank account is already exist. kindly use different Bank account'
          ) {
            clearInterval(this.rpdWebHookInterval);

            this.toastr.error("This bank account is already linked in our system. Please try linking a different bank account.", '', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });

            this.MoengageService.trackEvent(
              'Bank Verification UPI Response Error',
              {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                UPI_App_Selected: sessionStorage.getItem('selectedUPIBank'),
                Bank_Name: this.rpdData,
                IFSC_Code: this.enteredIFSCNumber,
                Account_Number: this.accountNumber,
                VerificationID: this.requestID,
                ErrorMsg: response.message,
                product_name: 'Onboarding DIY',
                category: 'Bank Verification',
              },
            );

            this.getUPIMasterDetails();

            this.spinner.hide();
          } else {
            const timeElapsed = Date.now() - this.Apistart;

            //console.log('timeElapsed', timeElapsed);

            if (timeElapsed > ApitimeOut) {
              clearInterval(this.rpdWebHookInterval);

              this.MoengageService.trackEvent(
                'Bank Verification UPI Response Error',
                {
                  product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                  UPI_App_Selected: sessionStorage.getItem('selectedUPIBank'),
                  Bank_Name: this.rpdData,
                  IFSC_Code: this.enteredIFSCNumber,
                  Account_Number: this.accountNumber,
                  VerificationID: this.requestID,
                  ErrorMsg:
                    'Oops! We could not verify the bank account linked with your UPI ID. Please retry again or enter details manually to verify your bank account',
                  product_name: 'Onboarding DIY',
                  category: 'Bank Verification',
                },
              );

              this.toastr.error(
                'Verification timed out. Please retry.',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3000,
                },
              );

              this.getUPIMasterDetails();

              this.spinner.hide();
            }
          }
          this.apiExecstart = 1;
        });
    }
  }

  // launchUPILink(upiURL: string): boolean {

  //   this.spinner.show();

  //   const a = document.createElement('a');
  //   a.href = upiURL;
  //   a.style.display = 'none';

  //   document.body.appendChild(a);

  //   a.click();

  //   document.body.removeChild(a);

  //   return true;

  // }
  isIOS() {
    // let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

    let isIos = this.detectIOS();

    //console.log('IOS Value', isIos);

    window.sessionStorage.setItem('isIos', isIos.toString());
    this.IsIos = isIos.toString();
  }
  detectIOS(): boolean {
    const userAgent = navigator.userAgent;

    // Detect iOS/iPadOS by checking for Apple devices in the userAgent or a touch device
    const isIOS = /iPad|iPhone|iPod/.test(userAgent);
    //  || (navigator.maxTouchPoints > 1);
    // Detect if it's a touch device

    // Specific check for iPadOS devices that report as Macintosh
    // Exclude devices that do not report as iPad, iPhone, or iPod
    const isMac =
      /Macintosh/.test(userAgent) &&
      /AppleWebKit/.test(userAgent) &&
      !/iPad|iPhone|iPod/.test(userAgent);

    // Return true only if the device is running iOS or iPadOS, excluding MacBooks
    const isDeviceIOS = isIOS || isMac;

    //console.log('User Agent:', userAgent);
    //console.log('isIOS:', isIOS);
    //console.log('isMac:', isMac);

    //console.log('detectIOS result:', isDeviceIOS);

    return isDeviceIOS;
  }

  launchUPILink(upiURL: string): Promise<boolean> {
    const start = Date.now();

    let upibank = sessionStorage.getItem('selectedUPIBank');

    return new Promise((resolve) => {
      this.spinner.show();

      const isIOS = window.sessionStorage.getItem('isIos');
      const a = document.createElement('a');
      a.href = upiURL;
      a.style.display = 'none';

      document.body.appendChild(a);

      // let isAppOpened = false;

      // if (isIOS === "true" || isIOS === "false") {

      //   const onBlur = () => {

      //     isAppOpened = true;

      //     resolve(true);

      //     window.removeEventListener('blur', onBlur);

      //     //console.log('IsIOS :', 'Remove Listener Clause')

      //   };

      //   window.addEventListener('blur', onBlur);

      //   //console.log('IsIOS :', 'Add Listener Clause')
      // }

      const timeOut = 3000;

      a.click();

      document.body.removeChild(a);

      setTimeout(() => {
        const timeElapsed = Date.now() - start;

        //console.log('timeElapsed', timeElapsed);
        //console.log('timeOut', timeOut);

        if (upibank === 'Others') {
          //console.log('UPI app Present');

          resolve(true);
        }
        // !isAppOpened && --Commented By Pratik in case of UPI App not Present
        else if (timeElapsed < timeOut) {
          // alert(
          //   'UPI app not detected. Please ensure you have a UPI app installed and try again.'
          // );

          // clearInterval(this.rpdWebHookInterval);

          //console.log('UPI app Absent');

          // this.spinner.hide()

          resolve(true);
        } else if (isIOS === 'true') {
          //console.log('UPI app IOS');

          resolve(true);
        } else if (isIOS != 'true' || upibank === 'Others') {
          //console.log('UPI app Present');

          resolve(true);
        } else {
          //console.log('UPI app ELSE');

          resolve(true);
        }
      }, timeOut);
    });
  }

  // redirectPlanSelection() {
  //   this.spinner.show();

  //   if (this.RejectStatus != 'R') {
  //     setTimeout(() => {
  //       const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  //       modalBackdrops.forEach((backdrop) => {
  //         if (backdrop instanceof HTMLElement) {
  //           backdrop.remove();
  //         }
  //       });
  //       this.router.navigate(['/planprocess', 1]);
  //       this.spinner.hide();
  //     }, 200);
  //   } else {
  //     setTimeout(() => {
  //       const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  //       modalBackdrops.forEach((backdrop) => {
  //         if (backdrop instanceof HTMLElement) {
  //           backdrop.remove();
  //         }
  //       });
  //       this.navService.navigateToNextStep();
  //     }, 200);
  //   }
  // }
  
  redirectPlanSelection() {
    if ((this.enteredIFSCNumber).toUpperCase().includes('SBIN')) {
      this.spinner.show();
      const reqData = {
        FORMNUMBER: window.sessionStorage.getItem('FormNumber'),
        CUSTOMER_NUMBER: this.accountNumber,
        SOURCE_ID: 'SA',
      };
      this._http
        .postRequest('api/v1/BankDetails/GetCustomerEnquiry', reqData)
        .subscribe((resp) => {
          const response: any = resp.body;
          if (response.status == false) {
            this.spinner.hide();
            this.toastr.error(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 8000,
            });
            setTimeout(() => {
              window.location.href = 'reversePennyDrop/1';
            }, 1000);
            // this.router.navigate(['/reversePennyDrop', 1]);
            return;
          }
          this.spinner.hide();
          if (this.RejectStatus !== 'R') {
            setTimeout(() => {
              document
                .querySelectorAll('.modal-backdrop')
                .forEach((backdrop) => backdrop.remove());

              this.router.navigate(['/planprocess', 1]);
            }, 200);
          } else {
            setTimeout(() => {
              document
                .querySelectorAll('.modal-backdrop')
                .forEach((backdrop) => backdrop.remove());
              this.navService.navigateToNextStep();
            }, 200);
          }
        });
    } else {
      if (this.RejectStatus !== 'R') {
        setTimeout(() => {
          document
            .querySelectorAll('.modal-backdrop')
            .forEach((backdrop) => backdrop.remove());
          this.router.navigate(['/planprocess', 1]);
          this.spinner.hide();
        }, 200);
      } else {
        setTimeout(() => {
          document
            .querySelectorAll('.modal-backdrop')
            .forEach((backdrop) => backdrop.remove());

          this.navService.navigateToNextStep();
          this.spinner.hide();
        }, 200);
      }
    }
  }

  showSpinnerWithFallback() {
    this.spinner.show();
    setTimeout(() => {
      this.RevPennyDropFormOne = true;
      this.spinner.hide();
    }, 1000);
  }

  openSameNamePopupModal() {
    const bankSameNamepopupModel = document.getElementById('myModal');
    if (bankSameNamepopupModel) {
      const myModall = new bootstrap.Modal(bankSameNamepopupModel);
      myModall.show();
    } else {
      this.removeModal();
    }
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    if (modalBackdrops) {
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.classList.remove('show');
          backdrop.remove();
        }
      });
    }
  }

  removeModalBank() {
    // $('#BankFailClose').modal('hide');
    const removebankSameNamepopupModel =
      document.getElementById('BankFailClose');
    if (removebankSameNamepopupModel) {
      const myModall = new bootstrap.Modal(removebankSameNamepopupModel);
      myModall.hide();
    } else {
      this.removeModal();
    }
  }

  openSameNamePopupDismissModal() {
    this.spinner.hide();
    this.removeModal();
  }

  BackToOne() {
    this.spinner.show();

    var reqData = {
      flag: 'changebankflag',
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    //console.log(reqData);

    this.spinner.show();

    this._http
      .postRequest('api/v1/BankDetails/Chosebankaccount', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        //console.log('Response: ', response);

        if (response.status == true) {
          clearInterval(this.rpdWebHookInterval);

          // setTimeout(() => {

          //this.router.navigate(['/reversePennyDrop', 1]);

          setTimeout(() => {
            window.location.href =
              'https://diy.sbisecurities.in/open-demat-account/reversePennyDrop/1';

            // window.location.href = this.url + 'reversePennyDrop/1';
            // this.router.navigate(['/reversePennyDrop', 1]);

            //this.spinner.hide();
          }, 200);

          //this.spinner.hide();

          //}, 200);

          window.sessionStorage.removeItem('mode');
        } else {
          clearInterval(this.rpdWebHookInterval);

          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 4000,
          });

          this.spinner.hide();

          return;
        }
      });
  }

  BackToPersonalSix() {
    clearInterval(this.rpdWebHookInterval);
    console.log("TEST1")
    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/personalDetailsForm', 5]);
      this.spinner.hide();
    }, 200);
    // this.getBankConfiguration();
  }

  getBankConfiguration() {
    this.spinner.show();
    setTimeout(() => {
      var reqData = {
        flag: 'GETBANKCONFIG',
      };
      this._http
        .postRequest('api/v1/masters/get', reqData)
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
            //console.log('RESPO', response);
            // console.log('BankConfig',response)

            if (response?.data?.[0]) {
              var temp_rpd_status = response?.data?.[0]?.IsRPDActiveStatus === 'YES';
              var temp_pd_status = response?.data?.[0]?.IsPDActiveStatus === 'YES'

              if (temp_rpd_status == true && temp_pd_status == true) {
                this.spinner.hide();

                return;
              }
              else if (temp_rpd_status == true && temp_pd_status == false) {
                this.PDActiveStatus = false;
              }
              else if (temp_rpd_status == false && temp_pd_status == true) {
                setTimeout(() => {
                  this.router.navigate(['/PennyDrop', 1]);
                  this.spinner.hide();
                }, 200);
              }
              else if (temp_rpd_status == false && temp_pd_status == false) {
                setTimeout(() => {
                  this.router.navigate(['/personalDetailsForm', 5]);
                  this.spinner.hide();
                }, 200);
              }
              else {
                // this.RPDActiveStatus = true;
                // this.PDActiveStatus = true;
                setTimeout(() => {
                  this.router.navigate(['/personalDetailsForm', 5]);
                  this.spinner.hide();
                }, 200);
              }



            }

            // console.log("this.RPDActiveStatus: ",this.RPDActiveStatus);
            // console.log("this.PDActiveStatus: ",this.PDActiveStatus);
          }

          this.spinner.hide();
        });
    }, 200);
  }

  BackToPersonalFive() {
    clearInterval(this.rpdWebHookInterval);

    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/personalDetailsForm', 5]);
      this.spinner.hide();
    }, 200);
  }

  redirect() {
    // //console.log("redirect")
    // var reqData = {
    //   flag: 'Bank',
    //   formnumber: window.sessionStorage.getItem('FormNumber'),
    //   Mode: 'RPD'
    // };

    var reqData = {
      flag: 'GetRPDdetls',
      formnumber: window.sessionStorage.getItem('FormNumber'),
      requestId: this.requestID,
    };
    //console.log('this.requestID', this.requestID);
    this._http
      .postRequest('api/v1/BankDetails/CheckRPDDetails', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        //console.log('RESPONSE------>: ', response);
        if (response.status == true) {
          response.data = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
          if (response.message == 'Data found') {
            this.router.navigate(['/reversePennyDrop', 2]);

            this.spinner.hide();

            this.toastr.success(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
          }
        } else if (
          response.status == false &&
          response.message.includes('Reverse PENNY DROP NOT SUCCESSFULL')
        ) {
          alert('Reverse PENNY DROP VERIFICATION NOT SUCCESSFULL');
        } else {
          this.spinner.hide();
        }
      });
  }

  startCountdown(): void {
    if (this.countdownSubscription) {
      this.countdownSubscription.unsubscribe();
    }

    this.remainingTime = 180;
    this.timeOutStatus = false;
    this.updateDisplay();
    const countdown$ = interval(1000).pipe(take(this.remainingTime));
    this.countdownSubscription = countdown$.subscribe({
      next: () => {
        this.remainingTime--;
        this.updateDisplay();
      },
      complete: () => {
        this.timeOutStatus = true;
        var btn = document.getElementsByClassName('hidden');
        $('#btn').removeClass('hidden');
        // this.router.navigate(['/personalDetailsForm/',6])
      },
    });
  }

  updateDisplay(): void {
    this.minutes = Math.floor(this.remainingTime / 60);
    this.seconds = this.remainingTime % 60;
  }

  detectDevice() {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (this.isMobile == true) {
      this.isMobile = true;
      //console.log('mobile');
    } else {
      //console.log('desktop');
      this.isMobile = false;
    }
  }

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      this.aesService.encrypt(encodedStageName, '', ''),
    )}`;
  }
}
