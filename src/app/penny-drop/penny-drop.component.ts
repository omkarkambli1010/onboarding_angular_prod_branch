import { Component, OnInit } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import * as bootstrap from 'bootstrap';
import { Observable, Observer } from 'rxjs';
import { NavigationService } from '../navigation.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import heic2any from 'heic2any';
import { ExtensionService } from '../extension.service';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
  selector: 'app-penny-drop',
  templateUrl: './penny-drop.component.html',
  styleUrls: ['./penny-drop.component.css'],
})
export class PennyDropComponent implements OnInit {
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  clientid: any;
  guid: any;
  PersonalResponse: any;
  PersonalFormNine: boolean = false;
  personalFormNumber: any;
  capture_event: any;
  filteredBanks: any[] = [];
  searchQuery: string = '';
  selectedUPI: any;
  requestID: any;
  verifyIndianUPIBanksList: any;
  upiURL: any;

  //Variables for Global IFSC
  GlobalIfsc: string = '';
  isIfsc: boolean = false;
  filteredIfsc: string[] = [];
  GlobalBanks: any[] = [];

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
  ifscCodeValidation: boolean = false;

  PennyDropFormOne: boolean = false;
  PennyDropFormTwo: boolean = false;

  ReenterACBankValidation: boolean = false;
  ReenterACBankValidationSpecial: boolean = false;
  ReenterACBankValidationSpace: boolean = false;
  SBILengthWarning: boolean = false;

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

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  fileSizeWarning: boolean = false;

  errorMsg: string = '';
  passwordProtectedMsg: string = '';
  pdfSrc: any;
  filename = '';
  FFF: any;
  pdfEncrypt: boolean = true;
  uploadPDFfile: any;
  bankverified: string = '';
  isIfscDisabled: boolean = false;

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
    private imageCompress: NgxImageCompressService,
    private fileExtension: ExtensionService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Personal Details - Onboarding-DIY-PWA');
    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Personal Details of the customer.',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';

    this.utm_source = window.sessionStorage.getItem('UTMSOURCE') ?? 'NA';
    // this.utm_source =
    //   this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.getBankCodeDetails();

    this.route.params.subscribe((params) => {
      const formNumber = params['formNumber'];
      this.setFormVisibility(formNumber);
    });
  }

  setFormVisibility(formNumber: string) {
    this.PennyDropFormOne = false;
    this.PennyDropFormTwo = false;

    switch (formNumber) {
      case '1':
        this.PennyDropFormOne = true;
        break;
      case '2':
        this.PennyDropFormTwo = true;
        this.getGlobalIfscBanks();
        this.getPennyDropFormTwo();
        break;
      default:
        break;
    }

    this.selectedBankName = window.sessionStorage.getItem('selectedBankName');
    this.selectedBankLogo = window.sessionStorage.getItem('selectedBankLogo');
    this.selectedBankPrefix =
      window.sessionStorage.getItem('selectedBankPrefix');

    if (this.selectedBankName) {
      this.filteredBanks.forEach((bank) => {
        bank.selected = bank.BankName === this.selectedBankName;
      });
    }
  }

  getPennyDropFormTwo() {
    this.spinner.show();
    this.clearIFSCFields();
    this.isBankAccountForm = true;

    var reqData = {
      flag: 'Bank',
      formnumber: window.sessionStorage.getItem('FormNumber'),
      Mode: 'Penny Drop',
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (resp.body.message === 'Data found') {
            //console.log(response);

            if (this.RejectStatus != 'R') {
              this.enteredIFSCNumber = response[0].acc_holder_ifsc;
              this.enteredIFSCCode = response[0].acc_holder_ifsc;
              //console.log(this.enteredIFSCNumber);
              this.bankverified = response[0].bankverified ?? '';
              this.reenteredAccountNumber = response[0].acc_number;
              this.accountNumber = response[0].acc_number;
              this.ifscBankValidation = false;
              this.selectedBankName = response[0].bankfullname;
              this.selectedBankLogo = response[0].banklogo;

              this.selectedBankPrefix = response[0].ifsc_prefix;

              this.getBankIFSCDetails(this.enteredIFSCNumber);
              this.isBankAccountForm = false;

              const accntno = document.getElementById('accountNo');
              const Reaccntno = document.getElementById('renteraccountNo');
              const IFSC = document.getElementById('ifsccode');

              if (accntno && Reaccntno && IFSC) {
                accntno?.setAttribute('disabled', 'true');

                Reaccntno?.setAttribute('disabled', 'true');

                IFSC?.setAttribute('disabled', 'true');

                this.isIfscDisabled = true;
              }

              window.sessionStorage.setItem('mode', 'Penny Drop');

              this.spinner.hide();
            } else {
              this.enteredIFSCNumber = response[0].acc_holder_ifsc;
              this.enteredIFSCCode = response[0].acc_holder_ifsc;
              //console.log(this.enteredIFSCNumber);

              this.reenteredAccountNumber = response[0].acc_number;
              this.accountNumber = response[0].acc_number;
              this.ifscBankValidation = false;
              this.selectedBankName = response[0].bankfullname;
              this.selectedBankLogo = response[0].banklogo;

              this.selectedBankPrefix = response[0].ifsc_prefix;

              this.getBankIFSCDetails(this.enteredIFSCNumber);
              this.isBankAccountForm = true;

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

  getGlobalIfscBanks() {
    this.spinner.show();
    var reqData = {
      flag: 'GetBankMasterdetlsGlobal',
    };
    this._http
      .postRequest('api/v1/BankDetails/list', reqData)
      .subscribe((resp) => {
        //console.log('ifsc', this.enteredIFSCCode);
        let response: any = resp.body;
        this.spinner.hide();
        //console.log(response);
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          // console.log('GLOBAL BANK LIST!', response);X
          // this.indianBanks = response;
          this.GlobalBanks = response;

          for (const record of response) {
            if (record.BankName === this.selectedBankName) {
              this.isIfsc = true;
              //setting Global IFSC
              this.GlobalIfsc = record.GlobalIfsc;
              break;
            } else {
              this.isIfsc = false;
              this.GlobalIfsc = '';
            }
          }
        } else {
          // this.MoengageService.trackEvent('Bank Verification Method Error', {
          //   product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          //   Method_used: 'Penny Drop',
          //   ErrorOccurred: 'In IFSC Search',
          //   ErrorMsg: response.message,
          //   product_name: 'Onboarding DIY',
          //   category: 'Bank Verification',
          // });
        }
      });
  }

  searchIfsc(event: any) {
    let input = event.target.value;
    if (this.enteredIFSCNumber.length > 4) {
      var BankCode = this.selectedBankPrefix;
      if (this.enteredIFSCNumber.slice(0, 4) == BankCode) {
        if (input.length > 11) {
          input = input.slice(0, 11);
        }
        event.target.value = input;
        this.enteredIFSCNumber = input;
        this.accountIfsc2(event);
      }
      this.spinner.show();
      var reqData = {
        flag: 'GetIfscSearch',
        ifsc: this.enteredIFSCNumber,
        bank: this.selectedBankName,
      };
      console.log('Req data', reqData);
      this._http
        .postRequest('api/v1/BankDetails/list', reqData)
        .subscribe((resp) => {
          //console.log('ifsc', this.enteredIFSCCode);
          let response: any = resp.body;
          this.spinner.hide();
          //console.log(response);
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
          }
          //console.log('DECRPT', response);
          console.log('FILTERED BANKSRES:', response);

          this.filteredIfsc = response.IfscCode;

          let ifscCodeArray: string[] = [];

          response.forEach((obj: { IfscCode: any }) => {
            console.log(obj.IfscCode);
            ifscCodeArray.push(obj.IfscCode);
          });

          this.filteredIfsc = ifscCodeArray;
          console.log('FILTERED BANKS:', this.filteredIfsc);
        });
    } else {
      console.log('ifsc entered is less than 6');
    }
  }

  getBankCodeDetails() {
    this.spinner.show();
    var reqData = {
      flag: 'GetBankMasterdetls',
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/BankDetails/list', reqData)
      .subscribe((resp) => {
        //console.log('ifsc', this.enteredIFSCCode);
        let response: any = resp.body;
        this.spinner.hide();
        //console.log(response);
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        }
        //console.log('DECRPT', response);
        this.indianBanks = response;
        this.filteredBanks = response;
      });
  }

  filterBanks() {
    let query = this.searchQuery.trim().toLowerCase();

    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    query = query.replace(emojiRegex, '');

    if (query === '') {
      this.filteredBanks = this.indianBanks;
    } else {
      this.filteredBanks = this.indianBanks.filter(
        (bank: { BankName: string; BankCode: string }) =>
          bank.BankName.toLowerCase().includes(query) ||
          bank.BankCode.toLowerCase().includes(query) ||
          bank.BankName.toLowerCase().startsWith(query)
      );
    }
  }

  getBankIFSCDetails(fullIFSCCode: string) {
    var reqData = {
      flag: 'getIFSCDetails',
      ifsc: fullIFSCCode,
      bankprefix:
        this.selectedBankPrefix ??
        window.sessionStorage.getItem('selectedBankPrefix'),
    };
    this._http.postRequest('api/v1/BankDetails/list', reqData).subscribe(
      (resp: any) => {
        let response = resp.body;
        if (response.status === true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        }
        if (response && response.length > 0) {
          this.IFSCResponse = response;
          this.ifscBankValidation = false;
        } else {
          this.ifscBankValidation = true;
          this.IFSCResponse = [{ BBM_LOCATION: '' }];
          this.isBankAccountForm = true;
        }
        console.log('Data', this.IFSCResponse);
      },
      (error) => {
        console.error('Error fetching IFSC details:', error);
        this.IFSCResponse = [{ BBM_LOCATION: 'Error fetching IFSC details' }];
      }
    );
  }

  verifyBankModal() {
    if (this.enteredIFSCNumber == '') {
      this.ifscBankValidation = true;

      return;
    }
    if (this.accountNumber == '') {
      this.ACbankValidation = true;

      return;
    }
    if (this.reenteredAccountNumber == '') {
      this.ReenterBankWarning = true;
      return;
    }

    if (this.accountNumber != this.reenteredAccountNumber) {
      this.ReenterBankWarning = true;
      return;
    }

    if (this.isIfsc == true) {
      //Setting Main IFSC as Global IFSC

      this.enteredIFSCCode = this.GlobalIfsc;

      //console.log('this.enteredIFSCCode set as ,', this.GlobalIfsc);
    }
    const reqData = {
      c_ifsc: this.enteredIFSCCode,
      formNumber: window.sessionStorage.getItem('FormNumber'),
      c_accntid: this.accountNumber,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      Stage: 8,
    };

    if (
      this.utm_source === 'PROPRIETOR' &&
      (this.bankverified == 'true' || this.bankverified == '')
    ) {
      //this.openInvalidModal();

      if (this.bankverified == 'true') {
        const accntno = document.getElementById('accountNo');
        const Reaccntno = document.getElementById('renteraccountNo');
        const IFSC = document.getElementById('ifsccode');

        if (accntno && Reaccntno && IFSC) {
          accntno?.setAttribute('disabled', 'true');

          Reaccntno?.setAttribute('disabled', 'true');

          IFSC?.setAttribute('disabled', 'true');

          this.isIfscDisabled = true;
        }

        window.sessionStorage.setItem('mode', 'OCR');

        this.openSuccessModal();
        return;
      } else {
        this.openProprietorModal();
        return;
      }
    }

    this.spinner.show();

    this._http
      .postRequest('api/v1/BankDetails/PenyDropService', reqData)
      .subscribe((resp) => {
        //console.log('API response received:', resp);
        let response = resp.body;
        //console.log('IFSCSTATUS', response);
        //this.spinner.hide();

        if (response.status == true) {
          const decryptedData = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          var ifscResp: any = decryptedData;
          if (decryptedData != 'Manually Handled') {
            ifscResp = JSON.parse(decryptedData);
          }

          //console.log('this.IFSCResponse', this.IFSCResponse);
          if (
            ifscResp.status === '00' &&
            ifscResp.data.response === 'Success' &&
            response.message === 'Data found'
          ) {
            this.MoengageService.trackEvent('Bank Verification PennyDrop', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Bank_Name: this.selectedBankName,
              IFSC_Code: this.enteredIFSCCode,
              Account_Number: this.accountNumber,
              product_name: 'Onboarding DIY',
              Response: 'Bank Account Verified Successfully',
              category: 'Bank Verification',
            });

            const accntno = document.getElementById('accountNo');
            const Reaccntno = document.getElementById('renteraccountNo');
            const IFSC = document.getElementById('ifsccode');

            if (accntno && Reaccntno && IFSC) {
              accntno?.setAttribute('disabled', 'true');

              Reaccntno?.setAttribute('disabled', 'true');

              IFSC?.setAttribute('disabled', 'true');

              this.isIfscDisabled = true;
            }

            window.sessionStorage.setItem('mode', 'Penny Drop');

            this.openSuccessModal();
          } else if (response.message === 'Bank Account Already Verified') {
            this.MoengageService.trackEvent('Bank Verification PennyDrop', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Bank_Name: this.selectedBankName,
              IFSC_Code: this.enteredIFSCCode,
              Account_Number: this.accountNumber,
              Response: response.message,
              product_name: 'Onboarding DIY',
              category: 'Bank Verification',
            });

            const accntno = document.getElementById('accountNo');
            const Reaccntno = document.getElementById('renteraccountNo');
            const IFSC = document.getElementById('ifsccode');

            if (accntno && Reaccntno && IFSC) {
              accntno?.setAttribute('disabled', 'true');

              Reaccntno?.setAttribute('disabled', 'true');

              IFSC?.setAttribute('disabled', 'true');

              this.isIfscDisabled = true;
            }

            window.sessionStorage.setItem('mode', 'Penny Drop');

            this.openSuccessModal();
          } else if (response.message === 'Name Mismatch-MiddleRange') {
            this.MoengageService.trackEvent('Bank Verification PennyDrop', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Bank_Name: this.selectedBankName,
              IFSC_Code: this.enteredIFSCCode,
              Account_Number: this.accountNumber,
              product_name: 'Onboarding DIY',
              Response: 'Bank Account Verified Successfully',
              category: 'Bank Verification',
            });

            const accntno = document.getElementById('accountNo');
            const Reaccntno = document.getElementById('renteraccountNo');
            const IFSC = document.getElementById('ifsccode');

            if (accntno && Reaccntno && IFSC) {
              accntno?.setAttribute('disabled', 'true');

              Reaccntno?.setAttribute('disabled', 'true');

              IFSC?.setAttribute('disabled', 'true');

              this.isIfscDisabled = true;
            }

            window.sessionStorage.setItem('mode', 'Penny Drop');

            this.openSameNamePopupModal();
          } else if (response.message === 'Penny Drop Limit Exceeded') {
            this.MoengageService.trackEvent('Bank Verification PennyDrop', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Bank_Name: this.selectedBankName,
              IFSC_Code: this.enteredIFSCCode,
              Account_Number: this.accountNumber,
              Response: response.message,
              product_name: 'Onboarding DIY',
              category: 'Bank Verification',
            });

            this.toastr.error(
              'Penny Drop Limit Exceeded. Please Try different Bank Account Number',
              '',
              {
                positionClass: 'toast-bottom-center',
                timeOut: 3000,
              }
            );
          }
        } else if (response.message === 'Name Mismatch') {
          this.MoengageService.trackEvent('Bank Verification PennyDrop Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Bank_Name: this.selectedBankName,
            IFSC_Code: this.enteredIFSCCode,
            Account_Number: this.accountNumber,
            ErrorMsg:
              'Oops! This bank account seems to belonging to someone else as per bank record. Please change the bank details to continue.',
            product_name: 'Onboarding DIY',
            category: 'Bank Verification',
          });

          this.toastr.error(
            'Oops! This bank account seems to belonging to someone else as per bank record. Please change the bank details to continue.',
            '',
            {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            }
          );
        } else if (response.message === 'Transaction Failed') {
          // this.toastr.error(
          //   'Invalid Bank Account. Please change the bank details to continue.',
          //   '',
          //   {
          //     positionClass: 'toast-bottom-center',
          //     timeOut: 3000,
          //   }
          // );

          this.MoengageService.trackEvent('Bank Verification PennyDrop Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Bank_Name: this.selectedBankName,
            IFSC_Code: this.enteredIFSCCode,
            Account_Number: this.accountNumber,
            ErrorMsg: response.message,
            product_name: 'Onboarding DIY',
            category: 'Bank Verification',
          });

          //this.openInvalidModal();
          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        } else if (
          response.message.includes(
            'Oops! This bank account is already linked with another client.'
          )
        ) {
          this.MoengageService.trackEvent('Bank Verification PennyDrop Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Bank_Name: this.selectedBankName,
            IFSC_Code: this.enteredIFSCCode,
            Account_Number: this.accountNumber,
            ErrorMsg: response.message,
            product_name: 'Onboarding DIY',
            category: 'Bank Verification',
          });

          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        } else {
          this.MoengageService.trackEvent('Bank Verification PennyDrop Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Bank_Name: this.selectedBankName,
            IFSC_Code: this.enteredIFSCCode,
            Account_Number: this.accountNumber,
            ErrorMsg: response.message,
            product_name: 'Onboarding DIY',
            category: 'Bank Verification',
          });

          //this.openInvalidModal();
          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        }
        this.spinner.hide();
      });
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

  openSameNamePopupDismissModal() {
    this.spinner.hide();
    this.removeModal();
  }

  openSuccessModal() {
    this.spinner.hide();
    const verifysuccessModel = document.getElementById('verifysuccess');
    if (verifysuccessModel) {
      const myModal = new bootstrap.Modal(verifysuccessModel);
      myModal.show();
    } else {
      this.removeModal();
    }
  }
  onKeyPress(event: KeyboardEvent) {
    const char = event.key;
    const regExp = /^[\u0041-\u005A\u0061-\u007A\s]*$/;
    const emojiRegExp =
      /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{2B06}-\u{2B07}\u{2934}-\u{2935}\u{2B05}-\u{2B07}\u{3297}\u{3299}\u{303D}\u{00A9}\u{00AE}\u{2122}\u{23F3}\u{24C2}\u{23E9}-\u{23EF}\u{25B6}\u{23F8}-\u{23FA}]/u;

    if (!regExp.test(char) || emojiRegExp.test(char)) {
      event.preventDefault();
    }
  }

  openInvalidModal() {
    const invalidbankdetailsModel =
      document.getElementById('invalidbankdetails');
    if (invalidbankdetailsModel) {
      const myModal = new bootstrap.Modal(invalidbankdetailsModel);
      myModal.show();
    } else {
      this.removeModal();
    }
  }

  openProprietorModal() {
    const uploadBankStatement = document.getElementById('uploadBankStatement');
    if (uploadBankStatement) {
      const myModal = new bootstrap.Modal(uploadBankStatement);
      myModal.show();
    } else {
      this.removeModal();
    }
  }

  openSuccessModal1() {
    this.spinner.hide();
    const successModal = document.getElementById('verifysuccess');
    const uploadCheckModal = document.getElementById('verify');

    if (successModal && uploadCheckModal) {
      uploadCheckModal.setAttribute('data-bs-target', '#verifysuccess');
      uploadCheckModal.setAttribute('data-bs-toggle', 'modal');

      const successBootstrapModal = new bootstrap.Modal(successModal);
      successBootstrapModal.show();
    } else if (uploadCheckModal) {
      uploadCheckModal.setAttribute('data-bs-target', '');
    }
  }

  openInvalidModal1() {
    this.spinner.hide();
    const failureModal = document.getElementById('invalidbankdetails');
    const uploadCheckModal = document.getElementById('verify');
    if (failureModal && uploadCheckModal) {
      uploadCheckModal.setAttribute('data-bs-target', '#invalidbankdetails');
      uploadCheckModal.setAttribute('data-bs-toggle', 'modal');
      const failureBootstrapModal = new bootstrap.Modal(failureModal);
      failureBootstrapModal.show();
    } else if (uploadCheckModal) {
      uploadCheckModal.setAttribute('data-bs-target', '');
    }
  }

  removeModal() {
    this.resetExistingImage();
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

  redirectToFillDetails(bank: any) {
    this.filteredBanks.forEach((bankItem) => (bankItem.selected = false));
    bank.selected = true;
    sessionStorage.setItem('selectedBankName', bank.BankName);
    sessionStorage.setItem('selectedBankLogo', bank.BankLogo);
    sessionStorage.setItem('selectedBankPrefix', bank.BankCode);

    this.spinner.show();
    setTimeout(() => {
      this.selectedBankName = bank.BankName;
      this.selectedBankPrefix = bank.BankCode;
      this.selectedBankLogo = bank.BankLogo;
      this.router.navigate(['/PennyDrop', 2]);
      this.clearIFSCFields();
      this.spinner.hide();
    }, 200);
  }

  clearIFSCFields() {
    this.enteredIFSCNumber = '';
    this.accountNumber = '';
    this.reenteredAccountNumber = '';
    this.IFSCResponse[0].BBM_LOCATION = '';
  }

  validateAccountForm() {
    var isIFSCValid =
      !this.ifscBankValidation &&
      !this.ifscBankValidationSpecial &&
      !this.ifscBankValidationSpace &&
      this.enteredIFSCNumber !== '';

    const isAccountValid =
      !this.ACbankValidation &&
      !this.ACbankValiSpecial &&
      !this.ACbankValiSpace &&
      this.accountNumber !== '';

    const isReenterAccountValid =
      !this.ReenterACBankValidation &&
      !this.ReenterBankWarning &&
      !this.ReenterACBankValidationSpecial &&
      !this.ReenterACBankValidationSpace &&
      this.reenteredAccountNumber !== '';
    const isAccountMatch = this.accountNumber === this.reenteredAccountNumber;
    if (this.isIfsc) {
      //bypassing IFSC Validation in the case of Global Ifsc

      isIFSCValid = true;

      this.enteredIFSCNumber = this.GlobalIfsc;

      // this.isBankAccountForm = false
    }

    if (
      this.selectedBankName === 'State Bank of India' ||
      this.selectedBankPrefix === 'SBIN'
    ) {
      if (this.accountNumber.length === 11) {
        this.SBILengthWarning = false;
        if (
          isIFSCValid &&
          isAccountValid &&
          isReenterAccountValid &&
          //this.ifscCodeValidation &&
          isAccountMatch &&
          this.enteredIFSCNumber.length === 11
        ) {
          //console.log('form is valid');
          this.isBankAccountForm = false;
        } else {
          this.isBankAccountForm = true;
        }
      } else {
        if (this.accountNumber != '' && this.accountNumber.length != 11) {
          this.SBILengthWarning = true;
        } else {
          this.SBILengthWarning = false;
        }
        this.isBankAccountForm = true;
      }
    } else {
      if (
        isIFSCValid &&
        isAccountValid &&
        isReenterAccountValid &&
        //this.ifscCodeValidation &&
        isAccountMatch &&
        this.enteredIFSCNumber.length === 11
      ) {
        //console.log('form is valid');
        this.isBankAccountForm = false;
      } else {
        this.isBankAccountForm = true;
      }
    }
  }

  accountIfsc2(event: any) {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    this.enteredIFSCNumber = this.enteredIFSCNumber.replace(emojiRegex, '');

    let fullIFSCCode = this.enteredIFSCNumber;
    const isValidIfsc = /^[A-Z]{4}0[A-Z0-9]{6}$/;
    const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    this.ifscBankValidationSpecial = regex.test(this.enteredIFSCNumber);

    this.ifscBankValidationSpace = !(
      this.enteredIFSCNumber?.trim()?.length > 0
    );
    this.ifscBankValidation = !isValidIfsc.test(this.enteredIFSCNumber);

    if (!this.ifscBankValidation) {
      this.enteredIFSCCode = fullIFSCCode;
      this.getBankIFSCDetails(fullIFSCCode);
      //this.isBankAccountForm = false;
      this.validateAccountForm();
    } else {
      this.enteredIFSCCode = '';
      this.isBankAccountForm = true;
    }
  }

  accountIfsc(event: any) {
    this.enteredIFSCNumber = event.target.value.toUpperCase();
    this.ifscBankValidationSpecial = false;
    this.ifscBankValidationSpace = false;
    this.ifscBankValidation = false;
    event.target.value = this.enteredIFSCNumber;
    if (event.target.value.length >= 11 && this.IFSCResponse[0] != null) {
      //console.log('ifcs');
      if (this.isIfsc == true) {
        this.ifscCodeValidation = true;
      } else {
        this.checkBankValidIfsc();
      }
      this.accountIfsc2(event);
    } else {
      this.isBankAccountForm = true;
    }
  }

  checkBankValidIfsc() {
    ////added by Priyanka 26.09.24  // Corrected by Pratik 18.10.2024
    //console.log(this.enteredIFSCNumber.replace(/[^A-Za-z]/g, ''));
    //console.log(this.selectedBankPrefix.substring(0, 4));
    if (
      this.selectedBankPrefix.substring(0, 4) !=
      this.enteredIFSCNumber.replace(/[^A-Za-z]/g, '')
    ) {
      this.ifscCodeValidation = true;
      this.validateAccountForm();
      //this.isBankAccountForm = false;
    } else {
      this.ifscCodeValidation = false;
      this.isBankAccountForm = true;
    }
  }

  accountNumberValidation2(event: any) {
    //let inputValue = event.target.value.trim();
    let inputValue = this.accountNumber.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    inputValue = inputValue.replace(emojiRegex, '');

    // //console.log('yaha aaya issue1 ', inputValue.length);

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    const isValidAccountNumber = /^\d+$/;

    this.ACbankValiSpecial = specialCharRegex.test(inputValue);
    this.ACbankValiSpace = inputValue.length === 0;
    this.ACbankValidation = !isValidAccountNumber.test(inputValue);
    //console.log('this.ACbankValiSpecial', this.ACbankValiSpecial);
    //console.log('this.ACbankValiSpace', this.ACbankValiSpace);

    if (
      this.selectedBankName === 'State Bank of India' ||
      this.selectedBankPrefix === 'SBIN'
    ) {
      if (this.accountNumber.length != 11 && this.accountNumber != '') {
        // event.target.value = inputValue.slice(0, 11);
        this.accountNumber = this.accountNumber.slice(0, 11);

        // this.SBILengthWarning = true;
        this.isBankAccountForm = true;
      } else {
        this.SBILengthWarning = false;

        this.validateAccountForm();
      }
      if (
        this.reenteredAccountNumber.length != 11 &&
        this.reenteredAccountNumber != ''
      ) {
        // event.target.value = inputValue.slice(0, 11);
        this.reenteredAccountNumber = this.reenteredAccountNumber.slice(0, 11);

        // this.SBILengthWarning = true;
        this.isBankAccountForm = true;
      } else {
        this.SBILengthWarning = false;

        this.validateAccountForm();
      }
      //this.validateAccountForm();
    } else {
      this.validateAccountForm();
    }

    //console.log('ACbankValidation', this.ACbankValidation);
    // if (isValidAccountNumber.test(inputValue)) {
    //   this.accountNumber = event.target.value;
    // }
  }

  accountNumberValidation(event: any) {
    //let inputValue = event.target.value.trim();
    let inputValue = this.accountNumber.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    inputValue = inputValue.replace(emojiRegex, '');

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    const isValidAccountNumber = /^\d+$/;

    const verify = document.getElementById('verify');
    this.ACbankValiSpecial = false;
    this.ACbankValiSpace = false;
    this.SBILengthWarning = false;

    this.ACbankValidation = !isValidAccountNumber.test(inputValue);

    // if (isValidAccountNumber.test(inputValue)) {
    //   this.accountNumber = event.target.value;
    // }
  }

  accountNumberReValidation2(event: any, flag: string) {
    //let inputValue = event.target.value.trim();
    let inputValue = this.reenteredAccountNumber.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    inputValue = inputValue.replace(emojiRegex, '');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    const isValidAccountNumber = /^\d+$/;

    if (flag === 'reenter') {
      this.ReenterACBankValidationSpecial = specialCharRegex.test(inputValue);
      this.ReenterACBankValidationSpace = inputValue.length === 0;
      this.ReenterACBankValidation = !isValidAccountNumber.test(inputValue);
    }

    // if (isValidAccountNumber.test(inputValue)) {
    //   this.reenteredAccountNumber = inputValue;
    // }

    if (
      this.accountNumber !== this.reenteredAccountNumber &&
      this.reenteredAccountNumber != ''
    ) {
      this.ReenterBankWarning = true;
      this.isBankAccountForm = true;
    } else {
      this.ReenterBankWarning = false;
      //this.isBankAccountForm = false;

      this.validateAccountForm();
    }
  }

  accountNumberReValidation(event: any) {
    //let inputValue = event.target.value.trim();
    let inputValue = this.reenteredAccountNumber.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    inputValue = inputValue.replace(emojiRegex, '');

    const isValidAccountNumber = /^\d+$/;
    this.ReenterACBankValidationSpecial = false;
    this.ReenterACBankValidationSpace = false;
    this.ReenterACBankValidation = false;

    this.ReenterBankWarning = false;

    // if (isValidAccountNumber.test(inputValue)) {
    //   this.reenteredAccountNumber = inputValue;
    // }
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  // Image Cropper
  // fileChangeEvent(event: any): void {
  //   if (!!this.file) {
  //     this.file = null;
  //   }
  //   const inputElement = event.target as HTMLInputElement;
  //   this.capture_event = inputElement.getAttribute('capture')
  //   const isCaptureUser = inputElement.getAttribute('capture') !== 'user';
  //   this.imageChangedEvent = null;
  //   this.croppedImage = '';
  //   this.fileSizeWarning = false;

  //   if (inputElement.files && inputElement.files.length > 0) {
  //     this.file = inputElement.files[0];

  //     if (isCaptureUser && this.file.size > 4 * 1024 * 1024) {
  //       this.fileSizeWarning = true;
  //       return;
  //     } else {
  //       this.fileSizeWarning = false;
  //     }

  //     this.loading = true;
  //     this.imageChangedEvent = event;

  //     this.convertToBase64(this.file).subscribe(
  //       (base64: string) => {
  //         if (this.file.size < 24 * 1024) {
  //           this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(base64);
  //           this.loading = false;
  //         } else {
  //           this.imageCompress.compressFile(base64, -1, 90, 90, 600, 600).then(
  //             (compressedBase64: string) => {
  //               if (compressedBase64.startsWith('data:image')) {
  //                 this.croppedImage =
  //                   this.sanitizer.bypassSecurityTrustUrl(compressedBase64);
  //                 this.bankProofImg = compressedBase64;
  //               } else {
  //                 console.error('Invalid base64 string after compression');
  //               }
  //               this.loading = false;
  //             },
  //             (error: any) => {
  //               console.error('Compression error:', error);
  //               this.loading = false;
  //             }
  //           );
  //         }
  //       },
  //       (error: any) => {
  //         console.error('Error converting file to base64:', error);
  //         this.loading = false;
  //       }
  //     );
  //   } else {
  //     console.error('No file selected');
  //   }
  // }

  async fileChangeEvent(event: any): Promise<void> {
    var isAllowed: boolean = await this.fileExtension.onFileChange(event);
    if ((await isAllowed) != true) {
      this.toastr.warning(
        'Please upload a valid file having .JPEG, .JPG, .PNG or .PDF format',
        '',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        }
      );
      this.spinner.hide();
      return;
    }
    if (!!this.file) {
      this.file = null;
    }
    this.errorMsg = '';
    this.passwordProtectedMsg = '';
    const inputElement = event.target as HTMLInputElement;
    // //console.log('----->', inputElement.getAttribute('capture'));
    // this.capture_event = inputElement.getAttribute('capture');
    // //console.log('CAPTURE EVENT:', this.capture_event);
    // const isCaptureUser = inputElement.getAttribute('capture') !== 'user';
    // //console.log('isCaptureUser', isCaptureUser);
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.FFF = null;

    if (inputElement.files && inputElement.files.length > 0) {
      this.file = inputElement.files[0];
      const fileName = this.file.name.toLowerCase();

      if (
        fileName.endsWith('.jpg') ||
        fileName.endsWith('.jpeg') ||
        fileName.endsWith('.png')
      ) {
        this.errorMsg = '';
        this.loading = true;
        this.imageChangedEvent = event;
        this.handleImageType(this.file);
      } else if (fileName.endsWith('.heic') || fileName.endsWith('.heif')) {
        this.errorMsg = '';
        this.loading = true;
        this.convertHeicToJpeg(this.file, event);
      } else if (fileName.endsWith('.pdf')) {
        this.passwordProtectedMsg = '';
        this.UploadSelectedFile(event);
      } else {
        this.errorMsg =
          'Please upload a valid file having .JPEG, .JPG, .PNG or .PDF format';
        return;
      }
    } else {
      console.error('No file selected');
    }
  }

  convertHeicToJpeg(file: File, event: Event): void {
    this.spinner.show();
    heic2any({ blob: file, toType: 'image/jpeg' })
      .then((convertedBlob: Blob | any) => {
        //console.log('convertedBlob', convertedBlob);
        const convertedFile = new File(
          [convertedBlob],
          file.name.replace(/\.[^/.]+$/, '.jpg'),
          { type: 'image/jpeg' }
        );
        //console.log('convertedFile', convertedFile);
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(convertedFile);
        const newEvent = new Event('change', { bubbles: true });
        Object.defineProperty(newEvent, 'target', {
          value: { files: dataTransfer.files },
        });
        this.imageChangedEvent = newEvent;
        //console.log('Updated imageChangedEvent:', this.imageChangedEvent);
        this.handleImageType(convertedFile);
        this.spinner.hide();
      })
      .catch((error: any) => {
        console.error('Error converting HEIC to JPEG:', error);
        this.spinner.hide();
      });
  }

  async getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    const response = await fetch(imageUrl);
    const blob = await response.blob();
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }

  handleImageType(file: any) {
    this.spinner.show();
    this.FFF = null;
    this.convertToBase64(file).subscribe(
      (base64: string) => {
        if (this.file.size < 24 * 1024 && this.capture_event == 'upload') {
          this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(base64);
          this.loading = false;
          this.spinner.hide();
        } else {
          this.imageCompress.compressFile(base64, -1, 90, 70, 600, 600).then(
            (compressedBase64: string) => {
              if (compressedBase64.startsWith('data:image')) {
                this.croppedImage =
                  this.sanitizer.bypassSecurityTrustUrl(compressedBase64);
                this.bankProofImg = compressedBase64;
                this.spinner.hide();
              } else {
                console.error('Invalid base64 string after compression');
              }
              this.loading = false;
            },
            (error: any) => {
              console.error('Compression error:', error);
              this.loading = false;
            }
          );
        }
      },
      (error: any) => {
        console.error('Error converting file to base64:', error);
        this.loading = false;
      }
    );
  }

  resetExistingImage(): void {
    this.file = null;
    this.imageChangedEvent = null;
    this.FFF = '';
    this.croppedImage = '';
    this.loading = false;
    this.errorMsg = '';
    this.passwordProtectedMsg = '';
  }

  convertToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      this.readFile(file, observer);
    });
  }

  readFile(file: File, observer: Observer<string>): void {
    const filereader = new FileReader();
    if (file.size > 4194304 && this.capture_event == 'upload') {
      this.imageChangedEvent = null;
      this.errorMsg = 'Maximum file size should be less than 4 MB';
      this.spinner.hide();
      return;
    }
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      let result = filereader.result as string;
      const base64 = result;
      this.bankProofImg = base64;
      //console.log('64', base64);
      observer.next(base64);
      observer.complete();
    };
    filereader.onerror = (error) => {
      observer.error(error);
      observer.complete();
    };
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.loading = true;
    const blob = event.blob;
    if (blob) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        this.imageCompress.compressFile(base64, -1, 90, 70, 600, 600).then(
          (compressedBase64: string) => {
            if (compressedBase64.startsWith('data:image')) {
              this.croppedImage =
                this.sanitizer.bypassSecurityTrustUrl(compressedBase64);
            } else {
              console.error('Invalid base64 string after compression');
            }
            this.loading = false;
          },
          (error: any) => {
            console.error('Compression error:', error);
            this.loading = false;
          }
        );
      };
      reader.onerror = (error) => {
        console.error('Error converting Blob to Base64:', error);
        this.loading = false;
      };
      reader.readAsDataURL(blob);
    } else {
      console.error('No blob data available for cropping');
      this.loading = false;
    }
  }

  imageLoaded() {
    this.showCropper = true;
    //console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    //console.log('Cropper ready', sourceImageDimensions);
    this.loading = false;
  }

  loadImageFailed() {
    console.error('Load image failed');
  }

  rotateRight() {
    this.loading = true;
    this.canvasRotation = (this.canvasRotation + 90) % 360;
    if (this.canvasRotation === 90 || this.canvasRotation === 270) {
      this.aspectRatio = 3 / 4;
    } else {
      this.aspectRatio = 4 / 3;
    }
    this.applyRotation();
  }

  applyRotation() {
    const isVertical =
      this.canvasRotation === 90 || this.canvasRotation === 270;
    const scale = isVertical ? 0.75 : 1;
    this.transform = {
      ...this.transform,
      rotate: this.canvasRotation,
      scale: scale,
    };
    this.showCropper = false;
    setTimeout(() => (this.showCropper = true), 0);
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio = !this.containWithinAspectRatio;
  }

  updateRotation() {
    this.transform = {
      ...this.transform,
      rotate: this.rotation,
    };
  }

  toggleAspectRatio() {
    this.aspectRatio = this.aspectRatio === 4 / 3 ? 16 / 5 : 4 / 3;
  }

  changeBankSignatureImage() {
    this.scale = 1;
    this.rotation = 0;
    this.canvasRotation = 0;
    this.transform = {
      translateUnit: 'px',
      scale: 1,
      rotate: 0,
      flipH: false,
      flipV: false,
    };
    this.croppedImage = null;
    this.FFF = '';
  }

  openId() {
    setTimeout(() => {
      const click = document.getElementById('pdfView');
      if (click) {
        //console.log('Click');
        click.click();
      }
    }, 200);
  }

  UploadSelectedFile(event: any) {
    this.spinner.show();
    //console.log('event.target.files[0].name', event.target.files[0].name);
    this.uploadPDFfile = event.target.files[0];

    this.FFF = URL.createObjectURL(this.uploadPDFfile);

    if (this.FFF && this.uploadPDFfile.size > 4 * 1024 * 1024) {
      this.FFF = '';
      this.fileSizeWarning = true;
      this.errorMsg = 'Maximum file size should be less than 4 MB';
      this.spinner.hide();
      return;
    } else {
      this.fileSizeWarning = false;
      this.spinner.hide();
    }

    if (this.uploadPDFfile && this.uploadPDFfile.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        //console.log('pdfserc', this.FFF);
        this.checkIfPasswordProtected(this.pdfSrc);
      };
      reader.readAsArrayBuffer(this.uploadPDFfile);

      this.spinner.hide();
    } else {
      alert('Please upload a valid PDF file.');
      this.spinner.hide();
    }
  }

  checkIfPasswordProtected(pdfData: ArrayBuffer) {
    const loadingTask = (window as any).pdfjsLib.getDocument({ data: pdfData });
    loadingTask.promise.then(
      (pdf: any) => {
        // //console.log('PDF loaded successfully');
        this.spinner.hide();
      },
      (error: any) => {
        if (error.name === 'PasswordException') {
          this.FFF = '';
          this.passwordProtectedMsg =
            'This file is password protected. Please remove the password and try uploading again or upload another financial proof.';
        } else {
          console.error('Error loading PDF:', error);
        }
        this.spinner.hide();
      }
    );
  }

  // UploadSelectedFile(event: any) {
  //   this.spinner.show;
  //   //console.log('event.target.files[0].name', event.target.files[0].name);
  //   this.uploadPDFfile = event.target.files[0];

  //   this.FFF = URL.createObjectURL(this.uploadPDFfile);

  //   if (this.FFF && this.uploadPDFfile.size > 4 * 1024 * 1024) {
  //     this.FFF = '';
  //     this.fileSizeWarning = true;
  //     this.errorMsg = 'Maximum file size should be less than 4 MB';
  //     this.spinner.hide;
  //     return;
  //   } else {
  //     this.fileSizeWarning = false;
  //   }

  //   if (this.uploadPDFfile && this.uploadPDFfile.type === 'application/pdf') {
  //     const reader = new FileReader();
  //     reader.onload = (e: any) => {
  //       this.pdfSrc = e.target.result;
  //       //console.log('pdfserc', this.FFF);
  //     };
  //     reader.readAsArrayBuffer(this.uploadPDFfile);
  //   } else {
  //     alert('Please upload a valid PDF file.');
  //   }
  // }

  // submitPDF() {
  //   this.spinner.show();
  //   //console.log('inside submitpdf');

  //   let fileToUpload = this.uploadPDFfile;
  //   const formData = new FormData();
  //   this.bankProofImg = fileToUpload.name;
  //   //console.log('this.filename', this.bankProofImg);
  //   var reqData = {
  //     documentType: 'PDF',
  //     formNumber: window.sessionStorage.getItem('FormNumber'),
  //     flag: 'docBase64String',
  //   };
  //   let client_id = sessionStorage.getItem('clientid') ?? '';
  //   var request = this.aesService.encrypt(
  //     JSON.stringify(reqData),
  //     client_id,
  //     client_id
  //   );
  //   formData.append('file', fileToUpload, fileToUpload.name);
  //   formData.append('request', request);
  //   this._http
  //     .postFilerequest('/api/v1/uploadDocument/upload-multipart', formData)
  //     .subscribe((response: any) => {
  //       //console.log('resp', response);
  //       //console.log('resp.body', response.body);
  //       this.spinner.hide();
  //       if (response.body.status === true) {

  //         setTimeout(() => {
  //           this.router.navigate(['/planprocess', 1]);
  //           this.spinner.hide();
  //         }, 200);

  //         window.sessionStorage.setItem('mode', 'Penny Drop');

  //       } else {
  //         this.toastr.warning('Failed to Upload PDF', '', {
  //           positionClass: 'toast-bottom-center',
  //           timeOut: 3000,
  //         });
  //         this.spinner.hide();
  //       }
  //     });
  // }

  declarationForm() {
    const declareCheckModal = document.getElementById('uploadBankStateBg');
    if (declareCheckModal) {
      const bootstrapModal = bootstrap.Modal.getInstance(declareCheckModal);
      bootstrapModal?.hide();
    }
    this.spinner.show();
    setTimeout(() => {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
      this.PennyDropFormOne = false;
      this.PennyDropFormTwo = true;
      this.spinner.hide();
    }, 200);
  }

  uploadStatementImg() {
    this.spinner.show();
    // if (this.FFF) {
    //   this.submitPDF();
    // } else {
    const panConfirmation = document.getElementById('confirmedPan');
    if (panConfirmation) {
      panConfirmation.setAttribute('data-bs-target', '#completePan');
      panConfirmation.setAttribute('data-bs-toggle', 'modal');

      var reqData = {
        documentType: 'BankProof',
        Accountno: this.accountNumber,
        ifsccode: this.enteredIFSCNumber,
        formNumber: window.sessionStorage.getItem('FormNumber'),
        flag: 'docBase64String',
        imgBase64String: this.bankProofImg,
      };
      this._http
        .postRequest('api/v1/uploadDocument/upload', reqData)
        .subscribe((resp) => {
          //console.log('reqData', reqData);
          let response: any = resp.body;
          //console.log('DATAIMG', response);

          this.bankverified = 'true';

          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );

            if (response.message != 'Name Mismatch-MiddleRange') {
              this.MoengageService.trackEvent('Bank Verification Doc Upload', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                Bank_Name: this.selectedBankName,
                Bank_Name_Match: 'Y',
                IFSC_Code: this.enteredIFSCCode,
                Account_Number: this.accountNumber,
                IFSC_Code_Match: 'Y',
                Account_Number_Match: 'Y',
                Response: 'Bank Account Verified Successfully',
                product_name: 'Onboarding DIY',
                category: 'Bank Verification',
              });

              this.removeModal();

              window.sessionStorage.setItem('mode', 'OCR');

              this.openSuccessModal();

              //console.log('resp', response);
            } else if (response.message === 'Name Mismatch-MiddleRange') {
              this.MoengageService.trackEvent('Bank Verification Doc Upload', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                Bank_Name: this.selectedBankName,
                Bank_Name_Match: 'Y',
                IFSC_Code: this.enteredIFSCCode,
                IFSC_Code_Match: 'Y',
                Account_Number: this.accountNumber,
                Account_Number_Match: 'Y',
                Response: 'Bank Account Verified Successfully',
                product_name: 'Onboarding DIY',
                category: 'Bank Verification',
              });

              this.removeModal();

              window.sessionStorage.setItem('mode', 'OCR');

              this.openSameNamePopupModal();
            }
          } else if (response.message === 'Name Mismatch') {
            this.MoengageService.trackEvent(
              'Bank Verification Doc Upload Error',
              {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                Bank_Name: this.selectedBankName,
                Bank_Name_Match: 'N',
                IFSC_Code: this.enteredIFSCCode,
                IFSC_Code_Match: 'Y',
                Account_Number: this.accountNumber,
                Account_Number_Match: 'Y',
                ErrorMsg:
                  'Oops! This bank account seems to belonging to someone else as per bank record. Please change the bank details to continue.',
                product_name: 'Onboarding DIY',
                category: 'Bank Verification',
              }
            );

            this.toastr.error(
              'Oops! This bank account seems to belonging to someone else as per bank record. Please change the bank details to continue.',
              '',
              {
                positionClass: 'toast-bottom-center',
                timeOut: 4000,
              }
            );
          } else if (response.message.includes('Oops!')) {
            this.MoengageService.trackEvent(
              'Bank Verification Doc Upload Error',
              {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                Bank_Name: this.selectedBankName,
                Bank_Name_Match: 'N',
                IFSC_Code: this.enteredIFSCCode,
                IFSC_Code_Match: 'N',
                Account_Number: this.accountNumber,
                Account_Number_Match: 'N',
                ErrorMsg: response.message,
                product_name: 'Onboarding DIY',
                category: 'Bank Verification',
              }
            );

            this.toastr.error(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            this.spinner.hide();

            this.removeModal();
          } else {
            this.MoengageService.trackEvent(
              'Bank Verification Doc Upload Error',
              {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                Bank_Name: this.selectedBankName,
                Bank_Name_Match: 'N',
                IFSC_Code: this.enteredIFSCCode,
                IFSC_Code_Match: 'N',
                Account_Number: this.accountNumber,
                Account_Number_Match: 'N',
                ErrorMsg: response.message,
                product_name: 'Onboarding DIY',
                category: 'Bank Verification',
              }
            );

            //this.removeModal();

            this.toastr.warning(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
          }

          this.spinner.hide();

          this.removeModal();
        });
    }
    // }
  }

  redirectPlanSelection() {
    this.spinner.show();

    if (this.RejectStatus != 'R') {
      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.router.navigate(['/planprocess', 1]);
        this.spinner.hide();
      }, 200);
    } else {
      this.spinner.hide();

      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.navService.navigateToNextStep();
        this.spinner.hide();
      }, 200);
    }
  }

  BackToSix() {
    this.spinner.show();

    this.ifscBankValidation = false;
    this.ifscBankValidationSpecial = false;
    this.ifscBankValidationSpace = false;
    this.ACbankValidation = false;
    this.ACbankValiSpecial = false;
    this.ACbankValiSpace = false;
    this.SBILengthWarning = false;
    this.ReenterACBankValidation = false;
    this.ReenterBankWarning = false;
    this.ReenterACBankValidationSpecial = false;
    this.ReenterACBankValidationSpace = false;
    this.ifscCodeValidation = false;
    this.clearIFSCFields();

    setTimeout(() => {
      this.router.navigate(['/personalDetailsForm', 6]);

      this.spinner.hide();
    }, 200);
  }

  BackToPennyDropOne() {
    this.spinner.show();

    var mode = window.sessionStorage.getItem('mode');
    if (mode === 'Penny Drop') {
      setTimeout(() => {
        this.ifscBankValidation = false;
        this.ifscBankValidationSpecial = false;
        this.ifscBankValidationSpace = false;
        this.ACbankValidation = false;
        this.ACbankValiSpecial = false;
        this.ACbankValiSpace = false;
        this.SBILengthWarning = false;
        this.ReenterACBankValidation = false;
        this.ReenterBankWarning = false;
        this.ReenterACBankValidationSpecial = false;
        this.ReenterACBankValidationSpace = false;
        this.ifscCodeValidation = false;
        this.clearIFSCFields();
        this.router.navigate(['/personalDetailsForm', 5]);
        this.spinner.hide();
      }, 200);
    } else {
      setTimeout(() => {
        this.ifscBankValidation = false;
        this.ifscBankValidationSpecial = false;
        this.ifscBankValidationSpace = false;
        this.ACbankValidation = false;
        this.ACbankValiSpecial = false;
        this.ACbankValiSpace = false;
        this.SBILengthWarning = false;
        this.ReenterACBankValidation = false;
        this.ReenterBankWarning = false;
        this.ReenterACBankValidationSpecial = false;
        this.ReenterACBankValidationSpace = false;
        this.ifscCodeValidation = false;
        this.clearIFSCFields();
        this.router.navigate(['/PennyDrop', 1]);
        this.spinner.hide();
      }, 200);
    }
  }

  setCaptureEvent(eventType: string): void {
    this.capture_event = eventType;
    //console.log('this.capture_event', this.capture_event);
  }

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName
    )}`;
  }
}
