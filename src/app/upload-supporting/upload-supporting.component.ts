import {
  Component,
  OnInit,
} from '@angular/core';
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
import { ExtensionService } from '../extension.service';

import { NavigationService } from '../navigation.service';
import { NgxImageCompressService } from 'ngx-image-compress';
import heic2any from 'heic2any';

@Component({
  selector: 'app-upload-supporting',
  templateUrl: './upload-supporting.component.html',
  styleUrls: ['./upload-supporting.component.css']
})
export class UploadSupportingComponent {
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
  nameFinalImage: any;

  errorMsg: string = '';
  passwordProtectedMsg: string = '';
  pdfSrc: any;
  filename = '';
  FFF: any;
  pdfEncrypt: boolean = true;
  uploadPDFfile: any;
  newCroppedFile: any;
  supportDocUrl: string = '';
  isPDF: boolean = false;
  selectedDocument: string = '';

  documents = [
      { id: 'AADHAAR', label: 'Aadhaar Card' },
      { id: 'PAN', label: 'PAN Card' },
      { id: 'DRIVINGLICENSE', label: 'Driving License' },
      { id: 'PASSPORT', label: 'Passport' },

  ];
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
    private fileExtension: ExtensionService

  ) { }

  ngOnInit(): void {
    this.title.setTitle('Support Documents - Onboarding-DIY-PWA');
    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Support Documents of the customer.',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';


    this.checkDocExisting()
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
    var isAllowed: boolean = await this.fileExtension.onFileChange(event)
    if (await isAllowed != true) {
      this.toastr.warning('Please upload a valid file having .JPEG, .JPG or .PNG format', '', {
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
          'Please upload a valid file having .JPEG, .JPG, or .PNG format';
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
                this.nameFinalImage = compressedBase64;
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
    } else {
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
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.loading = true;
    const blob = event.blob;

    if (blob) {
      const str = this.file.name;
      const lastDotIndex = str.lastIndexOf('.');
      const result = lastDotIndex !== -1 ? str.substring(0, lastDotIndex) : str;
      //console.log("result", result);
      const fileName = result + '_cropped.jpg';

      const file = new File([blob], fileName, { type: blob.type });
      //console.log('File', file);
      this.newCroppedFile = file.name;

      //console.log("this.newCroppedFile", this.newCroppedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        this.imageCompress.compressFile(base64, -1, 90, 70, 600, 600).then(
          (compressedBase64: string) => {
            if (compressedBase64.startsWith('data:image')) {
              this.croppedImage =
                this.sanitizer.bypassSecurityTrustUrl(compressedBase64);
                this.bankProofImg = compressedBase64;
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

  UploadSelectedFile(event: any) {
    this.spinner.show();

    try {
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
    catch (Error) {
      console.error(Error);
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

  submitPDF() {
    this.spinner.show();
    //console.log('inside uploadPanUploadImg');

    try {
      const formData = new FormData();

      //console.log('this.filename', this.file);
      var reqData = {
        documentType: 'NameChange',
        formNumber: window.sessionStorage.getItem('FormNumber'),
        flag: 'docBase64String',
        imgBase64String: "",
      };
      let client_id = sessionStorage.getItem('clientid') ?? '';
      var request = this.aesService.encrypt(
        JSON.stringify(reqData),
        client_id,
        client_id
      );
      let fileToUpload = this.uploadPDFfile;
      this.bankProofImg = fileToUpload.name;
      formData.append('file', fileToUpload, fileToUpload.name);
      formData.append('request', request);

      this._http
        .postFilerequest('api/v1/pannamechange/upload-multipart', formData)
        .subscribe((response: any) => {
          //console.log('resp', response);
          //console.log('resp.body', response.body);
          // this.spinner.hide();

          if (response.body.status == true) {

            if (this.RejectStatus != 'R') {

              setTimeout(() => {
                // this.router.navigate(['/addNominee', 1]);
                this.checkPanNameChange();
                this.spinner.hide();
              }, 200);

            }
            else {
              setTimeout(() => {

                this.navService.navigateToNextStep();

                this.spinner.hide();
              }, 200);
            }

          } else {
            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });
            this.spinner.hide();
          }
        });
    }
    catch (Error) {
      console.error(Error);
      this.spinner.hide();
    }
  }

  checkPanNameChange() {
    //console.log('calling status api');
    var reqData = {
      flag: 'NAMECHANGE',
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

          //console.log('dsss', response);
          if (resp.body.message === 'Data found') {
            // this.selectedIncome = response[0].AnnualIncome;
            //console.log('sdasdasd');
            this.router.navigate(['/addNominee', 1]);

          }
        }
      });
  }

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
    });
  }

  convertBase64ToFile(base64String: string, fileName: string): File {
    const arr = base64String.split(',');
    const mime = arr[0].match(/:(.*?);/)?.[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], fileName, { type: mime });
  }

  uploadStatementImg() {
    this.spinner.show();

    try {

      if (this.FFF) {
        this.submitPDF();
      } else {
        // this.spinner.show();
        //console.log('inside uploadPanUploadImg');
        const formData = new FormData();
        this.spinner.show();
        //console.log('inside uploadPanUploadImg');
        var final_file = this.convertBase64ToFile(this.bankProofImg, "MyFile")
        //console.log('this.filename', this.file);
        var reqData = {
          documentType: 'SUPPORTDOCUMENT',
          formNumber: window.sessionStorage.getItem('FormNumber'),
          sd_doctype: this.selectedDocument,
          imgBase64String: "",
          flag: "docBase64String"
        };
        let client_id = sessionStorage.getItem('clientid') ?? '';
        var request = this.aesService.encrypt(
          JSON.stringify(reqData),
          client_id,
          client_id
        );
        formData.append('file', final_file, this.newCroppedFile);
        formData.append('request', request);
        this._http
          .postFilerequest('api/v1/pannamechange/upload-multipart', formData)
          .subscribe((response: any) => {
            //console.log('resp', response);
            //console.log('resp.body', response.body);
            // this.spinner.hide();
            if (response.body.status == true) {

              if (this.RejectStatus != 'R') {

                setTimeout(() => {
                  //this.router.navigate(['/addNominee', 1]);
                  this.checkPanNameChange();
                  this.spinner.hide();
                }, 200);

              }
              else {

                setTimeout(() => {

                  this.navService.navigateToNextStep();

                  this.spinner.hide();
                }, 200);

              }

            } else {
              this.toastr.warning('Please upload a valid file having .JPEG, .JPG or .PNG', '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3000,
              });
              this.spinner.hide();
            }
          });
      }
    }
    catch (Error) {
      console.error(Error);
      this.spinner.hide();
    }
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


  checkPanNameChangeReverse() {
    //console.log("calling status api")
    var reqData = {
      flag: 'NAMECHANGE',
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
            // this.selectedIncome = response[0].AnnualIncome;
            //console.log("sdasdasd")
            //console.log(response)

            if (response[0].UploadPandoc_req.toUpperCase() == "YES") {
              //  && response[0].tdw_Uploadpan == 'Y'
              this.router.navigate(['/uploadPan']);

            } else if (response[0].IsDigilocker == 0) {
              //  && response[0].tdw_Uploadpan == 'Y'
              this.router.navigate(['/aadhaar-back']);

            } else {
              this.router.navigate(['/uploadSignature']);

            }
          }
        }
      });
  }

  redirectSignature() {
    this.spinner.show();
    setTimeout(() => {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });


      // this.router.navigate(['/uploadSignature']);
      this.checkPanNameChangeReverse()
      this.spinner.hide();
    }, 200);
  }


  checkDocExisting() {
    //console.log("calling status api")
    var reqData = {
      flag: 'SUPPORTINGDOC',
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

          //console.log("Name Response", response)
          if (resp.body.message === 'Data found') {
            // this.selectedIncome = response[0].AnnualIncome;
            //console.log("sdasdasd")

            this.selectedDocument = response[0].SD_DocType
            if (response[0].Document.includes("pdf")) {
              //
              this.isPDF = true
              this.supportDocUrl = response[0].Document

            } else {

              this.supportDocUrl = response[0].Document
            }
            //console.log("this.supportDocUrl", this.supportDocUrl)
          } else {
            //console.log("Existing Pan Data not found")
          }
        }
      });
  }

  redirectToNominee() {
    this.checkPanNameChange();

    // this.router.navigate(['/addNominee', 1]);

  }

getSelectedDocumentLabel(): string {
  const doc = this.documents.find(d => d.id === this.selectedDocument);
  return doc ? doc.label : 'Document';
}

  ViewPDF() {
    const newTab = window.open(this.supportDocUrl, '_blank');
    if (newTab) {
      try {
        newTab.opener = null;
      } catch (e) {
        console.error('Some issue occured ', e)
      }
    }
  }

  setCaptureEvent(eventType: string): void {
    this.capture_event = eventType;
    //console.log('this.capture_event', this.capture_event);
  }

}
