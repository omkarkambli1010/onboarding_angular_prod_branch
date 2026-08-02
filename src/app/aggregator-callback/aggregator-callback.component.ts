import { Component,OnInit } from '@angular/core';
import { Meta, Title, DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';

import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { MoengagesdkService } from '../moengagesdk.service';
import * as bootstrap from 'bootstrap';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { ExtensionService } from '../extension.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import heic2any from 'heic2any';
import { Observable, Observer } from 'rxjs';
import { NavigationService } from '../navigation.service';


@Component({
  selector: 'app-aggregator-callback',
  templateUrl: './aggregator-callback.component.html',
  styleUrls: ['./aggregator-callback.component.css']
})
export class AggregatorCallbackComponent {
  public capture_event: any;
  
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  clientid: any;
  FFF: any;
  BankStatement: any;
  RiskDisclosure: any;
  trdSegmentsID: any;
  saveSchemeSegment: any;
  RejectStatus = window.sessionStorage.getItem('RejectStatus');
  aggWebHookInterval:any;
  personalFormNumber: any;
  PersonalFormOne: boolean = true;
  PersonalFormTwo: boolean = false;
  errorValue: any;
  IsFno: any;
  selectedDocument: string = '';
  BankPrefix: any;
  trdSegmentsName: any;
  Apistart: any;
  
  errorMsg: string = '';
  passwordProtectedMsg: string = '';
  pdfSrc: any;
  filename = '';
  pdfEncrypt: boolean = true;
  uploadPDFfile: any;
  fileSizeWarning: boolean = false;
  bankStatementImg: any;
  selectedDocumentLabel: any;
  planprocessButton: boolean = false;
  timeOutStatus: boolean = false;
  apiExecstart: number = 1;
  
  selectedDocumentID: any;
    file: any;
  
    // Image Cropper
    imageChangedEvent: any = '';
    croppedImage: any = '';
    canvasRotation = 0;
    rotation?: number;
    translateH = 0;
    translateV = 0;
    scale = 1;
    zoomFactor: number = 1.0;
    aspectRatio = 4 / 3;
    showCropper = false;
    containWithinAspectRatio = false;
    transform: ImageTransform = {
      translateUnit: 'px',
    };
    imageURL?: string;
    loading = false;
    allowMoveImage = false;
    hidden = false;

    documents = [
    { id: 'aa_bankStatemntSixMonths', label: 'Bank Statement (last 6 months)' },
    { id: 'aa_copyofITRAcknowledge', label: 'Copy of ITR Acknowledgement' },
    { id: 'aa_copyofFormSixteen', label: 'Copy of Form 16' },
    { id: 'aa_netWorthCertificate', label: 'Networth Certificate' },
    { id: 'aa_copyofAnnualAcc', label: 'Copy of Annual Accounts' },
    {
      id: 'aa_copyofDematHoldingAcc',
      label: 'Copy of Demat Account Holding Statement',
    },
  ];
  constructor(
    private _http: APIService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private aesService: AesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private MoengageService: MoengagesdkService,
    private fileExtension: ExtensionService,
    private sanitizer: DomSanitizer,
    private imageCompress: NgxImageCompressService,
    private navService: NavigationService
  ) 
{ 
  this.spinner.show();
}

  ngOnInit(): void {
    this.clientid = sessionStorage.getItem('clientid') ?? '';


    this.startInterval();
    // this.getAggWebhookStatus()

    this.title.setTitle('Thank You - Onboarding-DIY-PWA');
    
    this.personalFormNumber = window.sessionStorage.getItem('FormNumber');

    // this.getFnoData()
    this.PersonalFormOne = true;
    this.PersonalFormTwo = false;
    //this.MoengageService.logoutUser();
    // window.sessionStorage.clear(); 
  }

  redirectesign() {
    //this.spinner.show();
    setTimeout(() => {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
      this.router.navigate(['/esign']);
      this.spinner.hide();
    }, 200);
  }
  dismissSuccessModal() {
    const completeVerifyPanDone = document.getElementById(
      'completePanVerifyDone'
    );
    if (completeVerifyPanDone) {
      completeVerifyPanDone.classList.remove('show');
    }
  }
  redirectLogin() {
    //this.spinner.show();
    setTimeout(() => {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
      this.router.navigate(['/']);
      this.spinner.hide();
    }, 200);
  }

  redirectAggregator() {
    //this.dismissModal();
    var reqData = {
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    //this.spinner.show();
    this._http
      .postRequest('api/v1/AccountAggregator/fetchdetails', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          response = JSON.parse(response);
          let redirectUrl = response[0].data.redirection_url;
          if (redirectUrl) {
            window.location.href = redirectUrl;
            setTimeout(() => {
              this.removeModal();
              this.dismissSuccessModal();
              // this.clearDetails();
              this.spinner.hide();
            }, 2000);
          } else {
            this.toastr.warning(response.status, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.removeModal();
            this.dismissSuccessModal();
            // this.clearDetails();
            this.spinner.hide();
          }
        } else {
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

  openAggregatorModal() {
    const riskDisclosureModal = document.getElementById('AggregatorCall');
    // const riskDisclosureModal = document.getElementById('AggFail');

    if (riskDisclosureModal) {
      const myModal = new bootstrap.Modal(riskDisclosureModal);
      myModal.show();
    }
  }
  openBankStatementModal() {
      const riskDisclosureModal = document.getElementById('uploadBankStatement');
      if (riskDisclosureModal) {
        const myModal = new bootstrap.Modal(riskDisclosureModal);
        myModal.show();
      }
    }
  openAggregatorFailModal() {
    // const riskDisclosureModal = document.getElementById('AggregatorCall');
    const riskDisclosureModal = document.getElementById('AggFail');

    if (riskDisclosureModal) {
      const myModal = new bootstrap.Modal(riskDisclosureModal);
      myModal.show();
    }
  }

    AggregatorCall(){
    console.log("Aggregator called")
    console.log("if failure, bank statement upload pop up is shown")
    this.openAggregatorFailModal();
  }


    dismissModal() {
      const successCheckModal = document.getElementById('riskDisclosureClose');
      const failureCheckModal = document.getElementById('failureClose');
      if (successCheckModal) {
        successCheckModal.setAttribute('data-bs-dismiss', 'modal');
        successCheckModal.setAttribute('aria-label', 'Close');
        const bootstrapModal = new bootstrap.Modal(successCheckModal);
        bootstrapModal.hide();
      } else if (failureCheckModal) {
        failureCheckModal.setAttribute('data-bs-dismiss', 'modal');
        failureCheckModal.setAttribute('aria-label', 'Close');
        const bootstrapModalError = new bootstrap.Modal(failureCheckModal);
        bootstrapModalError.hide();
      } else {
      }
    }
  
    removeModal() {
      this.resetExistingImage();
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
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
  async fileChangeEvent(event: any): Promise<void> {
    var isAllowed: boolean = await this.fileExtension.onFileChange(event);
    if ((await isAllowed) != true) {
      this.toastr.warning('Please upload a valid file having .JPEG, .JPG, .PNG of .PDF format', '', {
        positionClass: 'toast-bottom-center',
        timeOut: 3000,
      });
      this.spinner.hide();
      return;
    }
    if (!!this.file) {
      this.file = null;
    }
    this.errorMsg = '';
    this.passwordProtectedMsg = '';
    const inputElement = event.target as HTMLInputElement;
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
          'Please upload a valid image file having .JPEG, .JPG, or .PNG format';
        return;
      }
    } else {
      console.error('No file selected');
    }
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
              this.bankStatementImg = compressedBase64;
              //console.log('imagecropped size', this.bankStatementImg.size);
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

  openId() {
    setTimeout(() => {
      const click = document.getElementById('pdfView');
      if (click) {
        //console.log('Click');
        click.click();
      }
    }, 200);
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
  uploadStatementImg() {
    if (this.FFF) {
      this.submitPDF();
    } else {
      const panConfirmation = document.getElementById('confirmedPan');
      if (panConfirmation) {
        panConfirmation.setAttribute('data-bs-target', '#completePan');
        panConfirmation.setAttribute('data-bs-toggle', 'modal');

        var reqData = {
          documentType: this.selectedDocumentID,
          formNumber: window.sessionStorage.getItem('FormNumber'),
          flag: 'docBase64String',
          imgBase64String: this.bankStatementImg,
        };
        // //console.log('after upload?', 3);
        // //console.log('api/v1/uploadDocument/upload', reqData);

        this.spinner.show();
        this._http
          .postRequest('api/v1/uploadDocument/upload', reqData)
          .subscribe((resp) => {
            let response: any = resp.body;

            this.spinner.hide();
            if (response.status === true) {
              this.BankStatement = 'Yes';

              this.saveSegment();
            } else {
              sessionStorage.setItem('BankStatement', 'NO');
              this.toastr.warning(response.message, 'Warning', {
                positionClass: 'toast-bottom-center',
                timeOut: 5000,
              });
              //this.saveSegment();
            }
          });
      }
    }
  }

  saveSegment() {
    this.spinner.show();

    this.BankPrefix = sessionStorage.getItem('selectedBankPrefix');
    this.trdSegmentsName = "Equity & Mutual Fund, Derivative";
    this.trdSegmentsID="1,2";
    console.log("SEGMENT: ", this.trdSegmentsName)
    if (this.trdSegmentsName == 'Equity & Mutual Fund') {
      this.RiskDisclosure = 'No';
    }
    const reqData = {
      flag: 'segmentselection',
      SegmentID: this.trdSegmentsID,
      TradingSegment: this.trdSegmentsName,
      RiskDisclosure: this.RiskDisclosure,
      BankStatment: this.BankStatement,
      FormNumber: window.sessionStorage.getItem('FormNumber'),
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };
    this._http
      .postRequest('api/v1/schemeSegmentDetail/save', reqData)
      .subscribe((resp) => {
        let response = resp.body;

        // this.spinner.hide();

        if (response.status == true) {
          const response = JSON.parse(
            this.aesService.decrypt(
              resp.body.data,
              this.clientid,
              this.clientid
            )
          );
          this.saveSchemeSegment = response;
          if (this.saveSchemeSegment[0].status == 'Success') {
            const modalBackdrops = document.querySelectorAll('.modal-backdrop');
            modalBackdrops.forEach((backdrop) => {
              if (backdrop instanceof HTMLElement) {
                backdrop.remove();
              }
            });

            if (this.RejectStatus != 'R') {
              setTimeout(() => {
                const modalBackdrops =
                  document.querySelectorAll('.modal-backdrop');
                modalBackdrops.forEach((backdrop) => {
                  if (backdrop instanceof HTMLElement) {
                    backdrop.remove();
                  }
                });

                this.spinner.hide();
                this.router.navigate(['/fnoesign']);
              }, 200);
            } else {
              setTimeout(() => {
                const modalBackdrops =
                  document.querySelectorAll('.modal-backdrop');
                modalBackdrops.forEach((backdrop) => {
                  if (backdrop instanceof HTMLElement) {
                    backdrop.remove();
                  }
                });

                this.spinner.hide();
                this.router.navigate(['/fnoesign']);
                // this.navService.navigateToNextStep();
              }, 200);
            }
          } else {
            this.spinner.hide();

            this.toastr.error(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });
          }
        } else {
          this.spinner.hide();

          this.toastr.warning(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          });
        }
      });
  }

  submitPDF() {
    this.spinner.show();
    //console.log('inside submitpdf');

    let fileToUpload = this.uploadPDFfile;
    const formData = new FormData();
    this.bankStatementImg = fileToUpload.name;
    //console.log('this.filename', this.bankStatementImg);
    var reqData = {
      documentType: this.selectedDocumentID,
      formNumber: window.sessionStorage.getItem('FormNumber'),
      flag: 'docBase64String',
    };
    let client_id = sessionStorage.getItem('clientid') ?? '';
    var request = this.aesService.encrypt(
      JSON.stringify(reqData),
      client_id,
      client_id
    );
    formData.append('file', fileToUpload, fileToUpload.name);
    formData.append('request', request);
    this._http
      .postFilerequest('/api/v1/uploadDocument/upload-multipart', formData)
      .subscribe((response: any) => {
        //console.log('resp', response);
        //console.log('resp.body', response.body);
        this.spinner.hide();
        if (response.body.status === true) {
          // setTimeout(() => {
          //   this.router.navigate(['/CaptureSelfie', 1]);
          //   this.spinner.hide();
          // }, 200);
          this.BankStatement = 'Yes';

          this.saveSegment();
        } else {
          this.toastr.warning(
            'Failed to Upload PDF, Please Try Again... ',
            'Warning',
            {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            }
          );
          this.spinner.hide();
        }
      });
  }
  imageLoaded() {
    this.showCropper = true;
    //console.log('Image loaded');
  }

    setCaptureEvent(eventType: string): void {
    this.capture_event = eventType;
    //console.log('this.capture_event', this.capture_event);
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
                this.bankStatementImg = compressedBase64;
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
    }

    if (this.uploadPDFfile && this.uploadPDFfile.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        //console.log('pdfSrc', this.FFF);
        this.checkIfPasswordProtected(this.pdfSrc);
      };
      reader.readAsArrayBuffer(this.uploadPDFfile);
    } else {
      alert('Please upload a valid PDF file.');
      this.spinner.hide();
    }
  }
  convertToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      this.readFile(file, observer);
    });
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
  readFile(file: File, observer: Observer<string>): void {
    const filereader = new FileReader();
    //console.log('this.capture_event', this.capture_event);

    if (file.size > 4194304 && this.capture_event == 'upload') {
      this.imageChangedEvent = null;
      this.errorMsg = 'Maximum file size should be less than 4 MB';
      this.spinner.hide();
      return;
    } else {
      filereader.readAsDataURL(file);
      filereader.onload = () => {
        let result = filereader.result as string;
        const base64 = result;
        this.bankStatementImg = base64;
        observer.next(base64);
        observer.complete();
      };
      filereader.onerror = (error) => {
        observer.error(error);
        observer.complete();
      };
    }
  }
    updateSelectedDocumentLabel(label: string, id: string) {
    this.selectedDocumentLabel = label;
    this.selectedDocumentID = id;
    this.planprocessButton = true;
  }

    saveSelection() {
      if (this.selectedDocument) {
        sessionStorage.setItem('selectedDocument', this.selectedDocument);
  
        const myModal = new bootstrap.Modal(
          document.getElementById('uploadBankStatement')!
        );
        myModal.show();
      } else {
        //alert('Please select a document.');
        this.toastr.warning('Please select a document', '', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
  
        const myModal = new bootstrap.Modal(
          document.getElementById('uploadBankStatementLabel')!
        );
        myModal.hide();
  
        const uploadBankStatementModel = document.getElementById(
          'uploadBankStatement'
        );
        if (uploadBankStatementModel) {
          const myModal1 = new bootstrap.Modal(uploadBankStatementModel);
          myModal1.hide();
  
          uploadBankStatementModel.classList.remove('show');
          this.removeModal();
        }
        return;
      }
    }
  getFnoData() {
    this.spinner.show();
    var reqData = {
      flag: 'fno',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (resp.body.message === 'Data found') {

            this.IsFno = response[0].TradingSegment === "Equity & Mutual Fund, Derivative";
            console.log("response : ",response)
            console.log("IsFno", this.IsFno)

            if (this.IsFno!=true){
              window.sessionStorage.clear();
            }
          }
        }
      });
  }
  getApiStarttime() {
    this.Apistart = Date.now();

    //console.log('Apistart', this.Apistart);

    return;
  }
  startInterval(){
    this.getApiStarttime();
    this.spinner.show();
    
    this.aggWebHookInterval = setInterval(() => {
    this.getAggWebhookStatus();
    }, 5000);
    this.spinner.hide();

  }

  getAggWebhookStatus() {
    if ((this.apiExecstart = 1)) {
      this.apiExecstart = 0;
      var reqData = {
        TrackingId: window.sessionStorage.getItem('FormNumber')
      };
      // var reqData = {
      //   TrackingId: "dc14427c-bd6c-4f39-a7c1-2b61204e566y"
      // };
      //console.log(reqData);
        this.spinner.show();


      this._http
        .postRequest('api/v1/AccountAggregator/getwehbookAADetails', reqData)
        .subscribe((resp) => {
          console.log("API RESPONSE: ",)
          // let ApitimeOut = 3000 * 60;
          let ApitimeOut = 30000;



          //console.log('ApitimeOut', ApitimeOut);

          let response: any = resp.body;

          //console.log('Response: ', response);

          if (response.status == true) {
            response.data = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            console.log("API RESPONSE: ",response.data)
            if (response.data[0].status=="COMPLETED"){
            clearInterval(this.aggWebHookInterval);
            this.spinner.hide();
            this.router.navigate(['/fno-thankyou']);
            }
            else{
              clearInterval(this.aggWebHookInterval);
              this.toastr.error(
                'Oops! We could not fetch your Bank Statement.',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3000,
                }
              );
              this.openAggregatorFailModal();
              this.spinner.hide();
   
            }

          } else if  (response.status == false && response.message =="No Data found"){
            const timeElapsed = Date.now() - this.Apistart;

            //console.log('timeElapsed', timeElapsed);

            if (timeElapsed > ApitimeOut) {
              clearInterval(this.aggWebHookInterval);



              this.toastr.error(
                'Oops! We could not fetch your Bank Statement.',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3000,
                }
              );

              // this.getUPIMasterDetails();
              this.openAggregatorFailModal();
              this.spinner.hide();
            }
          }
          else{
              clearInterval(this.aggWebHookInterval);
              this.toastr.error(
                'Oops! We could not fetch your Bank Statement.',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3000,
                }
              );
                            this.openAggregatorFailModal();
              this.spinner.hide();


          }
          this.apiExecstart = 1;
        });
    }
  }

}
