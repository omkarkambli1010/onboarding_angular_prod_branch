import { Component, OnInit } from '@angular/core';
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
  selector: 'app-thankyou',
  templateUrl: './thankyou.component.html',
  styleUrls: ['./thankyou.component.css'],
})
export class ThankyouComponent implements OnInit {
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

  personalFormNumber: any;
  PersonalFormOne: boolean = false;
  PersonalFormTwo: boolean = false;
  errorValue: any;
  IsFno: any;
  selectedDocument: string = '';
  BankPrefix: any;
  trdSegmentsName: any;

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

  selectedDocumentID: any;
  file: any;

  // Image Croppers
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
  paidPlanText: any;
  paidPlanTextCheck: any;

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
  ) {
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
  }

  ngOnInit(): void {
    this.spinner.show();

    this.title.setTitle('Thank You - Onboarding-DIY-PWA');
    this.personalFormNumber = window.sessionStorage.getItem('FormNumber');

    this.meta.updateTag({
      name: 'description',
      content: 'Thank You on the onboarding process journey',
    });
    this.clientid = sessionStorage.getItem('clientid') ?? '';

    this.utm_source = window.sessionStorage.getItem('UTMSOURCE') ?? '';

    // this.utm_source =
    //   this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.route.queryParams.subscribe(async (params) => {
      if ((await params['esign']) === 'n') {
        this.PersonalFormOne = false;
        this.PersonalFormTwo = true;

        this.route.queryParams.subscribe((params) => {
          this.errorValue = params['error'];
          if (!this.errorValue.includes('is not matched')) {
            this.MoengageService.trackEvent('Esign Completion Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              EsignGateway: 'NSDL',
              Valid_Esign_Flag: params['esign'] ?? 'N',
              EsignResponse: this.errorValue,
              ErrorMsg:
                'Looks like the e-sign couldn’t be completed. Please try again. Contact us on 022 6854 5555/ 022 4001 4155',
              product_name: 'Onboarding DIY',
              category: 'Esign',
            });

            setTimeout(() => {
              //this.toastr.error('Oops! We are facing trouble to e-sign your digital application form. Please retry to continue. For more support, please contact us', 'Error', {
              this.toastr.error(
                'Looks like the e-sign couldn’t be completed. Please try again. Contact us on 022 6854 5555/ 022 4001 4155',
                'Error',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 5000,
                }
              );
              this.spinner.hide();
            }, 1000);
          } else if (this.errorValue.includes('is not matched')) {
            this.MoengageService.trackEvent('Esign Completion Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              EsignGateway: 'NSDL',
              Valid_Esign_Flag: params['esign'] ?? 'N',
              EsignResponse: this.errorValue,
              ErrorMsg:
                'Please e-Sign this application using your own Aadhaar details',
              product_name: 'Onboarding DIY',
              category: 'Esign',
            });

            setTimeout(() => {
              //this.toastr.error('Oops! We are facing trouble to e-sign your digital application form. Please retry to continue. For more support, please contact us', 'Error', {
              this.toastr.error(
                'Please e-Sign this application using your own Aadhaar details',
                'Error',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 5000,
                }
              );
              this.spinner.hide();
            }, 1000);
          }
        });
      } else {
        this.MoengageService.trackEvent('Esign Completion', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          EsignGateway: 'NSDL',
          Valid_Esign_Flag: params['esign'] ?? 'Y',
          product_name: 'Onboarding DIY',
          category: 'Esign',
        });

        await this.getFnoData();

        this.getPaidPlanText();
        // this.openAggregatorFailModal()

        // setTimeout(() => {
        //   this.MoengageService.logoutUser();
        //   this.spinner.hide();
        // }, 500);
        // window.sessionStorage.clear();
      }
    });
    // this.getPaidPlanText();
  }

  redirectesign() {
    this.spinner.show();
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
    this.spinner.show();
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
    this.dismissModal();
    var reqData = {
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/AccountAggregator/fetchdetails', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          // response = JSON.parse(response);
          console.log('response: ', response);
          let redirectUrl = response.redirectionUrl;
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
            this.openAggregatorFailModal();
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
          // this.openAggregatorFailModal();

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

  AggregatorCall() {
    console.log('Aggregator called');
    console.log('if failure, bank statement upload pop up is shown');
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
      this.toastr.warning(
        'Please upload a valid file having .JPEG, .JPG, .PNG of .PDF format',
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
    this.trdSegmentsName = 'Equity & Mutual Fund, Derivative';
    this.trdSegmentsID = '1,2';
    console.log('SEGMENT: ', this.trdSegmentsName);
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

                //this.spinner.hide();
                this.navService.navigateToNextStep();
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

  async getFnoData() {
    this.spinner.show();
    var reqData = {
      flag: 'fno',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe(async (resp) => {
        let response: any = await resp.body;

        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          // console.log("responseThankyou", response);
          if (resp.body.message === 'Data found') {
            this.IsFno =
              response[0].TradingSegment === 'Equity & Mutual Fund, Derivative';

            this.PersonalFormOne = true;
            this.PersonalFormTwo = false;

            if (response[0].flag == false) {
              this.paidPlanText = response[0].ATOM;
            } else {
              this.paidPlanText = response[0].ATOM;
            }

            // console.log('paidPlanText : ', this.paidPlanText);
            // console.log('response : ', response);
            // console.log('IsFno', this.IsFno);
            // this.openAggregatorFailModal()

            if (this.IsFno != true) {
              setTimeout(() => {
                window.sessionStorage.clear();
                window.localStorage.clear();

                this.MoengageService.logoutUser();
                this.spinner.hide();
              }, 500);
            }
          }
        }
        this.spinner.hide();
      });
  }

  getPaidPlanText() {
    this.spinner.show();
    const reqData = {
      flag: 'atom_textshow',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        this.spinner.hide();
        let response: any = resp.body;
        console.log('RESP', response);

        this.spinner.hide();

        if (response.status === true) {
          this.PersonalFormOne = true;
          this.PersonalFormTwo = false;

          const decrypted = this.aesService.decrypt(
            response.data,
            this.clientid,
            this.clientid
          );
          const parsed = JSON.parse(decrypted);
          this.paidPlanTextCheck = parsed;
          console.log('this.paidPlanText', this.paidPlanTextCheck);
          if (this.paidPlanTextCheck[0].flag == 'true') {
            this.paidPlanTextCheck[0].Paidplantextshow;
          } else {
            this.paidPlanTextCheck[0].Paidplantextshow = '';
          }
        }
        // if (this.IsFno != true) {
        //   setTimeout(() => {
        //     window.sessionStorage.clear();
        //     window.localStorage.clear();

        //     this.MoengageService.logoutUser();
        //     this.spinner.hide();
        //   }, 500);
        // }
        this.spinner.hide();
      });
  }
}
