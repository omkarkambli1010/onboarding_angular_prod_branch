import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  OnInit,
} from '@angular/core';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import SignaturePad from 'signature_pad';
import { Subject, Observable, Observer } from 'rxjs';
import { WebcamImage, WebcamInitError, WebcamUtil } from 'ngx-webcam';
import { GeolocationService } from '@ng-web-apis/geolocation';
import { ToastrService } from 'ngx-toastr';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { NavigationService } from '../navigation.service';
import heic2any from 'heic2any';
import { NgxImageCompressService } from 'ngx-image-compress';
import { ExtensionService } from '../extension.service';

@Component({
  selector: 'app-upload-pan',
  templateUrl: './upload-pan.component.html',
  styleUrls: ['./upload-pan.component.css'],
})
export class UploadPanComponent {
  PersonalFormTwo: boolean = false;
  PersonalFormThree: boolean = false;
  public capture_event: any;
  clientid: any;
  personalFormNumber: any;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  newFile: any;
  signatureData: any;

  // Image Cropper
  imageChangedEvent: any = '';

  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  translateH = 0;
  translateV = 0;
  scale = 1;
  aspectRatio = 4 / 3;
  zoomFactor: number = 0;
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
  panFinalImage: any;
  errorMsg: string = '';
  newCroppedFile: any;
  RejectStatus = window.sessionStorage.getItem('RejectStatus');
  panUrl: string = '';
  constructor(
    private _http: APIService,
    private aesService: AesService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private geolocation: GeolocationService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private navService: NavigationService,
    private imageCompress: NgxImageCompressService,
    private fileExtension: ExtensionService
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Upload Pan - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Uploading the Pan of the customer.',
    });

    this.route.params.subscribe((params) => {
      var formNumber = params['formNumber'];
      this.setFormVisibility(formNumber);
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.checkPanExisting();
  }

  setFormVisibility(formNumber: string) {
    switch (formNumber) {
      case '1':
        this.PersonalFormThree = false;
        this.PersonalFormTwo = true;
        break;
      case '2':
        this.PersonalFormTwo = false;
        this.PersonalFormThree = true;
        // this.getPersonalDataTwo();
        break;
      default:
        break;
    }
  }

  removeModal() {
    this.resetExistingImage();
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
        // this.imageChangedEvent = null;
      }
    });
  }

  resetExistingImage(): void {
    this.file = null;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.loading = false;
    this.errorMsg = '';
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

  changePanImage() {
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
  }

  // uploadPanUploadImg() {
  //   var reqData = {
  //     documentType: 'DIYIDENTITYPROOF',
  //     formNumber: window.sessionStorage.getItem('FormNumber'),
  //     flag: 'docBase64String',
  //     imgBase64String: this.file,
  //   };
  //   this.spinner.show();
  //   this._http
  //     .postRequest('api/v1/pannamechange/upload-multipart', reqData)
  //     .subscribe((resp) => {
  //       let response = resp.body;
  //       this.spinner.hide();
  //       if (response.status == true || response.status == 200) {
  //         response = JSON.parse(
  //           this.aesService.decrypt(response.data, this.clientid, this.clientid)
  //         );
  //         if (this.RejectStatus != 'R') {
  //           // this.signatureImage = response;
  //           // this.isSignaturePicture = false;
  //           // this.removeModal();
  //           // this.router.navigate(['/addNominee', 1]);
  //         } else {
  //           setTimeout(() => {
  //             // this.signatureImage = response;
  //             // this.isSignaturePicture = false;
  //             this.removeModal();
  //             this.navService.navigateToNextStep();
  //             this.spinner.hide();
  //           }, 200);
  //         }
  //       } else {
  //         //this.isSignaturePicture = true;
  //         this.toastr.warning(response.message, '', {
  //           positionClass: 'toast-bottom-center',
  //           timeOut: 2000,
  //         });
  //         this.PersonalFormTwo = false;
  //         this.PersonalFormThree = false;
  //       //  this.PersonalFormFive = true;
  //         return;
  //       }
  //     });
  // }
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

  uploadPanUploadImg() {
    this.spinner.show();
    //console.log('inside uploadPanUploadImg');

    try {
      const formData = new FormData();
      var final_file = this.convertBase64ToFile(this.panFinalImage, 'MyFile');
      //console.log('this.filename', this.file);
      var reqData = {
        documentType: 'DIYIDENTITYPROOF',
        formNumber: window.sessionStorage.getItem('FormNumber'),
        flag: 'docBase64String',
        imgBase64String: this.newCroppedFile,
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
          if (response.body.status == true) {
            if (this.RejectStatus != 'R') {
              const modalBackdrops = document.querySelectorAll('.modal-backdrop');
              modalBackdrops.forEach((backdrop) => {
                if (backdrop instanceof HTMLElement) {
                  backdrop.remove();
                }
              });

              setTimeout(() => {
                this.checkPanNameChange();
                // this.router.navigate(['/uploadSignature']);
                this.spinner.hide();
              }, 200);
            } else {
              const modalBackdrops = document.querySelectorAll('.modal-backdrop');
              modalBackdrops.forEach((backdrop) => {
                if (backdrop instanceof HTMLElement) {
                  backdrop.remove();
                }
              });

              setTimeout(() => {
                this.navService.navigateToNextStep();

                this.spinner.hide();
              }, 200);
            }
          } else {
            this.toastr.warning(
              'Please check the PAN image uploaded by you. Few details are not matching with the PAN data entered in the beginning',
              '',
              {
                positionClass: 'toast-bottom-center',
                timeOut: 5000,
              }
            );
            this.spinner.hide();
            this.panUrl = '';
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
            if (response[0].Namechangedoc_req.toUpperCase() == 'YES') {
              //  && response[0].tdw_namechangedoc != "Y"
              this.router.navigate(['/nameChange']);
            } else if (response[0].Additionaldoc_req.toUpperCase() == 'YES') {
              //  && response[0].tdw_namechangedoc != "Y"
              this.router.navigate(['/additional-document']);
            } else if (response[0].SupportDoc_req.toUpperCase() == 'YES') {
              this.router.navigate(['/support-document']);
            } else {
              this.router.navigate(['/addNominee', 1]);
            }
          }
        }
      });
  }

  checkPanExisting() {
    //console.log('calling status api');
    var reqData = {
      flag: 'PANUPLOAD',
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

          //console.log('Pan Response', response);
          if (resp.body.message === 'Data found') {
            // this.selectedIncome = response[0].AnnualIncome;
            //console.log('sdasdasd');
            this.panUrl = response[0].Document;
          } else {
            //console.log('Existing Pan Data not found');
          }
        }
      });
  }
  // fileChangeEvent(event: any){
  //   this.newFile=event.target.files[0]
  //   //console.log("fileChangeEvent",this.newFile);
  //   this.imageChangedEvent = event;

  // }

  async fileChangeEvent(event: any): Promise<void> {

    try {
      var isAllowed: boolean = await this.fileExtension.onFileChange(event)
      if (await isAllowed != true) {
        this.toastr.warning('Failed to Upload Pan', 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        });
        this.spinner.hide();
        return;
      }
      this.file = null;
      this.errorMsg = '';
      const inputElement = event.target as HTMLInputElement;
      this.imageChangedEvent = null;
      this.croppedImage = '';

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
        } else {
          this.errorMsg =
            'Please upload a valid image file having .JPEG, .JPG, or .PNG format';
        }
      } else {
        console.error('No file selected');
      }
    }
    catch (Error) {
      console.error(Error);
      this.spinner.hide();
    }
  }

  handleImageType(file: any) {
    this.spinner.show();
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
                //console.log('Crop', this.croppedImage);

                this.signatureData = compressedBase64;
                this.spinner.hide();
              } else {
                console.error('Invalid base64 string after compression');
              }
              this.loading = false;
              this.spinner.hide();
            },
            (error: any) => {
              console.error('Compression error:', error);
              this.loading = false;
              this.spinner.hide();
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

  imageCropped(event: ImageCroppedEvent): void {
    this.loading = true;
    const blob = event.blob;
    //console.log('blobImage', blob);
    if (blob) {
      const str = this.file.name;
      const lastDotIndex = str.lastIndexOf('.');
      const result = lastDotIndex !== -1 ? str.substring(0, lastDotIndex) : str;
      //console.log('result', result);
      const fileName = result + '_cropped.jpg';

      const file = new File([blob], fileName, { type: blob.type });
      //console.log('File', file);
      this.newCroppedFile = file.name;

      //console.log('this.newCroppedFile', this.newCroppedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        //console.log('base64', base64);
        this.imageCompress.compressFile(base64, -1, 90, 70, 600, 600).then(
          (compressedBase64: string) => {
            if (compressedBase64.startsWith('data:image')) {
              this.croppedImage =
                this.sanitizer.bypassSecurityTrustUrl(compressedBase64);
              //console.log('this.croppedImage', this.croppedImage);
              this.panFinalImage = compressedBase64;
              //console.log('this.panFinalImage', this.panFinalImage);
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
        this.panFinalImage = base64;
        observer.next(base64);
        observer.complete();
      };
      filereader.onerror = (error) => {
        observer.error(error);
        observer.complete();
      };
    }
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
            if (response[0].IsDigilocker == 0) {
              //  && response[0].tdw_Uploadpan == 'Y'
              this.router.navigate(['/aadhaar-back']);


            } else {
              this.router.navigate(['/uploadSignature']);

            }
          }
        }
      });
  }
  setCaptureEvent(eventType: string): void {
    this.capture_event = eventType;
    //console.log('this.capture_event', this.capture_event);
  }
}
