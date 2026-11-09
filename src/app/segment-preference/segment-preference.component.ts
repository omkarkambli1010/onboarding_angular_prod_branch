import { Component, OnInit } from '@angular/core';
import { ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import * as bootstrap from 'bootstrap';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { Observable, Observer } from 'rxjs';
import { jsbn } from 'node-forge';
import { JsonPipe } from '@angular/common';
import { NavigationService } from '../navigation.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import heic2any from 'heic2any';
import { ExtensionService } from '../extension.service';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
    selector: 'app-segment-preference',
    templateUrl: './segment-preference.component.html',
    styleUrls: ['./segment-preference.component.css'],
    standalone: false
})
export class SegmentPreferenceComponent implements OnInit {
  public capture_event: any;

  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  clientid: any;
  segmentPreferenceResponse: any;
  trdSegmentsID: any;
  trdSegmentsName: any;
  RiskDisclosure: any;
  selectedDocument: string = '';
  BankStatement: any;
  PersonalResponse: any;
  planSelectionResponse: any;

  riskDisclosureModalData: any;
  riskDisclosureData: any;
  planPreferenceDeclaration: any;

  trdSegments: any;
  selectedPlan: any;

  BankPrefix: any;
  saveSchemeSegment: any;

  PaymentResponse: any;
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
    { id: 'bankStatemntSixMonths', label: 'Bank Statement (last 6 months)' },
    { id: 'copyofITRAcknowledge', label: 'Copy of ITR Acknowledgement' },
    { id: 'copyofFormSixteen', label: 'Copy of Form 16' },
    { id: 'netWorthCertificate', label: 'Networth Certificate' },
    { id: 'copyofAnnualAcc', label: 'Copy of Annual Accounts' },
    {
      id: 'copyofDematHoldingAcc',
      label: 'Copy of Demat Account Holding Statement',
    },
  ];

  selectedDocumentLabel: any;
  selectedDocumentID: any;
  atomGetResponse: any;
  PaymentStatus: any = '';
  bankStatementImg: any;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  fileSizeWarning: boolean = false;

  planprocessButton: boolean = false;

  errorMsg: string = '';
  passwordProtectedMsg: string = '';
  pdfSrc: any;
  filename = '';
  FFF: any;
  pdfEncrypt: boolean = true;
  uploadPDFfile: any;

  fetchedPlanName: any;
  fetchedPlanImg: any;

  fnoselected: boolean = false;

  constructor(
    private router: Router,
    private _http: APIService,
    private aesService: AesService,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private navService: NavigationService,
    private imageCompress: NgxImageCompressService,
    private fileExtension: ExtensionService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Plan Preference of the customer.',
    });
    this.title.setTitle('Plan Preference - Onboarding-DIY-PWA');

    this.route.params.subscribe((params) => {
      const gotoValue = params['goto'];
      if (gotoValue) {
        this.router.navigateByUrl(gotoValue);
      }
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';

    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.getSegmentData();

    this.getPlanProcess();

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('response')) {
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

      this.fetchAtomPaymentResponse();
    }
  }

  getSegmentData() {
    this.spinner.show();
    var reqData = {
      flag: 'segmentpreference',
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
          console.log('PLAN ID', response[0]);
          console.log('PLAN ID', response[0].PlanID);

          this.fetchedPlanName = response[0].schemeType;
          this.fetchedPlanImg = response[0].schemeTypeLogo;

          try {
            if (response[0].SegmentID.includes('2')) {
              this.fnoselected = true;
            } else {
              this.fnoselected = false;
            }
          } catch {}
          
          if (resp?.body?.message === 'Data found') {
            const dataArray = resp.body?.data ?? [];
            if (dataArray.length === 0) {
              console.warn('Data found but array is empty.');
              return;
            }
          }
        }
      });
  }

  riskDisclosure() {
    this.selectedDocument = '';
    this.RiskDisclosure = 'Yes';
    this.saveSegment();
    // this.spinner.show();
    // setTimeout(() => {
    //   this.spinner.hide();
    // }, 200);
  }

  getPlanProcess() {
    this.spinner.show();
    setTimeout(() => {
      var reqData = {
        flag: 'all',
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
                this.clientid
              )
            );
            //console.log('RESPO', response);
          }
          this.PersonalResponse = response;
          console.log('this.PersonalResponse', this.PersonalResponse);

          this.segmentPreferenceResponse = this.PersonalResponse.data6;

          if (this.fnoselected == true) {
            this.segmentPreferenceResponse[1].selected = true;
          } else {
            this.segmentPreferenceResponse[1].selected = false;
          }
          this.riskDisclosureModalData = this.PersonalResponse.data17;

          this.segmentPreferenceResponse.forEach((plan: { selected: any }) => {
            if (plan.selected === 'Equity & Mutual Fund') {
              plan.selected = true;
            }
          });
          for (var i = 0; i < this.riskDisclosureModalData.length; i++) {
            if (this.riskDisclosureModalData[i].Category == 'Risk disclosure') {
              this.riskDisclosureData =
                this.riskDisclosureModalData[i].Discription;
            }
          }
          const trdSegmentsString = sessionStorage.getItem('trdSegments');
          if (trdSegmentsString) {
            this.trdSegments = JSON.parse(trdSegmentsString);
          }
          this.planPreferenceDeclaration = this.selectedPlan =
            this.planPreferenceDeclaration;

          this.spinner.hide();
        });
    }, 200);
  }

  planPreferenceForm() {
    let selectedSegments = this.segmentPreferenceResponse.filter((t: any) =>
      t.selected == null ? '' : t.selected.toString() == 'true'
    );
    let trdSegments = selectedSegments.map((t: any) => t.id);
    //  sessionStorage.setItem( 'trdSegmentsID', JSON.stringify(trdSegments).slice(1, -1));
    this.trdSegmentsID = JSON.stringify(trdSegments).slice(1, -1);
    let trdID = trdSegments.filter((id: string) => id == '2');

    this.trdSegmentsName = selectedSegments
      .map((t: any) => t.trdSegment)
      .join(', ');
    //sessionStorage.setItem('trdSegmentsName', trdSegmentsName);
    let trdName = selectedSegments.filter(
      (trdSegment: string) =>
        trdSegment == 'Equity & Mutual Fund' || trdSegment == 'Derivative'
    );
    if (trdID.length > 0) {
      this.openRiskDisclosureModal();
    } else {
      this.saveSegment();
    }
  }

  saveSegment() {
    this.spinner.show();

    this.BankPrefix = sessionStorage.getItem('selectedBankPrefix');
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

            this.MoengageService.trackEvent('Segment Preference', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              SegmentsSelected: this.trdSegmentsName,
              RiskDisclosure: this.RiskDisclosure,
              DocumentType: this.selectedDocument ?? 'NA',
              product_name: 'Onboarding DIY',
              category: 'Segment Preference',
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
                this.router.navigate(['/CaptureSelfie', 1]);
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

            this.MoengageService.trackEvent('Segment Preference Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              SegmentsSelected: this.trdSegmentsName,
              RiskDisclosure: this.RiskDisclosure,
              DocumentType: this.selectedDocument ?? 'NA',
              ErrorMsg: resp.body.message,
              product_name: 'Onboarding DIY',
              category: 'Segment Preference',
            });

            this.toastr.error(resp.body.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });
          }
        } else {
          this.MoengageService.trackEvent('Segment Preference Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            SegmentsSelected: this.trdSegmentsName,
            RiskDisclosure: this.RiskDisclosure,
            DocumentType: this.selectedDocument ?? 'NA',
            ErrorMsg: resp.body.message,
            product_name: 'Onboarding DIY',
            category: 'Segment Preference',
          });

          this.spinner.hide();

          this.toastr.warning(resp.body.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          });
        }
      });
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

  // Image Cropper

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

          this.MoengageService.trackEvent('Segment Proof Submission Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            SegmentsSelected: this.trdSegmentsName,
            RiskDisclosure: this.RiskDisclosure,
            DocumentType: this.selectedDocument,
            ErrorMsg:
              'This file is password protected. Please remove the password and try uploading again or upload another financial proof.',
            product_name: 'Onboarding DIY',
            category: 'Segment Preference',
          });

          this.passwordProtectedMsg =
            'This file is password protected. Please remove the password and try uploading again or upload another financial proof.';
        } else {
          console.error('Error loading PDF:', error);
        }
        this.spinner.hide();
      }
    );
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

          this.MoengageService.trackEvent('Segment Proof Submission', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            SegmentsSelected: this.trdSegmentsName,
            RiskDisclosure: this.RiskDisclosure,
            DocumentType: this.selectedDocument,
            product_name: 'Onboarding DIY',
            category: 'Segment Preference',
          });

          this.saveSegment();
        } else {
          this.MoengageService.trackEvent('Segment Proof Submission Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            SegmentsSelected: this.trdSegmentsName,
            RiskDisclosure: this.RiskDisclosure,
            DocumentType: this.selectedDocument,
            Response: response.message,
            ErrorMsg: 'Failed to Upload PDF, Please Try Again... ',
            product_name: 'Onboarding DIY',
            category: 'Segment Preference',
          });

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

              this.MoengageService.trackEvent('Segment Proof Submission', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                SegmentsSelected: this.trdSegmentsName,
                RiskDisclosure: this.RiskDisclosure,
                DocumentType: this.selectedDocument,
                product_name: 'Onboarding DIY',
                category: 'Segment Preference',
              });

              this.saveSegment();
            } else {
              sessionStorage.setItem('BankStatement', 'NO');

              this.MoengageService.trackEvent(
                'Segment Proof Submission Error',
                {
                  product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                  SegmentsSelected: this.trdSegmentsName,
                  RiskDisclosure: this.RiskDisclosure,
                  DocumentType: this.selectedDocument,
                  ErrorMsg: response.message,
                  product_name: 'Onboarding DIY',
                  category: 'Segment Preference',
                }
              );

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

  openRiskDisclosureModal() {
    const riskDisclosureModal = document.getElementById('riskdisclosure');
    if (riskDisclosureModal) {
      const myModal = new bootstrap.Modal(riskDisclosureModal);
      myModal.show();
    }
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

  BackToPlanPreference() {
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate(['/planprocess', 2]);

      this.spinner.hide();
    }, 200);
  }

  redirectUploadSelfiePage() {
    this.spinner.show();

    if (this.RejectStatus != 'R') {
      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.router.navigate(['/CaptureSelfie', 1]);
        this.spinner.hide();
      }, 200);
    } else {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });

      this.spinner.hide();
      this.navService.navigateToNextStep();
    }
  }

  fetchAtomPaymentResponse() {
    const urlParams = new URLSearchParams(window.location.search);
    const response = urlParams.get('response');
    var reqData = {
      formNumber: window.sessionStorage.getItem('FormNumber'),
      encryptedData: response,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/payment/savepaymentResponse', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          const response = JSON.parse(
            this.aesService.decrypt(
              resp.body.data,
              this.clientid,
              this.clientid
            )
          );
          if (response[0].status == 'Success') {
            // this.toastr.success('Payment Successful!!', '', {
            //   positionClass: 'toast-bottom-center',
            //   timeOut: 2000,
            // });

            this.MoengageService.trackEvent('Plan Payment', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              PaymentStatus: response[0].status,
              Response: response[0],
              product_name: 'Onboarding DIY',
              category: 'Plan Process',
            });

            this.spinner.hide();
            this.router.navigate([], {
              queryParams: {},
            });
          } else {
            this.MoengageService.trackEvent('Plan Payment Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              PaymentStatus: response[0].status,
              Response: response[0],
              ErrorMsg: 'Payment failed',
              product_name: 'Onboarding DIY',
              category: 'Plan Process',
            });

            this.spinner.show();
            setTimeout(() => {
              this.toastr.error('Payment failed...!', '', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });

              this.router.navigate(['/planprocess', 2]);
              this.spinner.hide();
            }, 200);
          }
        } else {
          this.spinner.show();

          this.MoengageService.trackEvent('Plan Payment Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            PaymentStatus: 'Failed',
            Response: response,
            ErrorMsg: 'Payment failed',
            product_name: 'Onboarding DIY',
            category: 'Plan Process',
          });

          setTimeout(() => {
            this.toastr.error(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.router.navigate(['/planprocess', 2]);
            this.spinner.hide();
          }, 200);
        }
      });
  }

  setCaptureEvent(eventType: string): void {
    this.capture_event = eventType;
    //console.log('this.capture_event', this.capture_event);
  }
}
