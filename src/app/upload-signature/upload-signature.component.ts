import {
  Component,
  OnDestroy,
  ViewChild,
  ElementRef,
  EventEmitter,
  Output,
  AfterViewChecked,
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
import { ExtensionService } from '../extension.service';
import { AesService } from '../aes.service';
import { AnyCatcher } from 'rxjs/internal/AnyCatcher';
import {
  Dimensions,
  ImageCroppedEvent,
  ImageTransform,
} from 'ngx-image-cropper';
import { NavigationService } from '../navigation.service';
import {
  DataUrl,
  NgxImageCompressService,
  UploadResponse,
} from 'ngx-image-compress';
import heic2any from 'heic2any';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
  selector: 'app-upload-signature',
  templateUrl: './upload-signature.component.html',
  styleUrls: ['./upload-signature.component.css'],
})
export class UploadSignatureComponent implements AfterViewChecked, OnDestroy {
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  // @ViewChild('fileInput') fileInput!: ElementRef;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: any;
  public capture_event: any;
  public videoOptions: MediaTrackConstraints = {
    // width: {ideal: 1024},
    // height: {ideal: 576}
  };
  public errors: WebcamInitError[] = [];

  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  // switch to next / previous / specific webcam; true/false: forward/backwards, string: deviceId
  private nextWebcam: Subject<boolean | string> = new Subject<
    boolean | string
  >();

  @ViewChild('signaturePad', { static: false })
  signaturePadElement!: ElementRef<HTMLCanvasElement>;
  signaturePad!: SignaturePad;
  resizeObserver!: ResizeObserver;

  // @ViewChild('previewContainer', { static: false })
  // previewContainer!: ElementRef;

  PersonalFormTwo: boolean = true;
  PersonalFormThree: boolean = false;
  // PersonalFormFour: boolean = false;
  PersonalFormFive: boolean = false;

  triggerObservable: Subject<void> = new Subject<void>();
  // public videoOptions: MediaTrackConstraints = {
  //   facingMode: 'user',
  // };
  isPreviewing: boolean = false;

  timeoutId: any;
  location: GeolocationPosition | null = null;
  latitude: any;
  longitude: any;
  errorMessage: string | null = null;
  clientid: any;
  isGeolocationSubscribed: boolean = false;
  personalFormNumber: any;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  capturedSelfie: any;
  selfieImage: any;
  signatureImage: any;
  imageDataUrl: any;
  signatureData: any;
  signDataUrl: any;
  isSelfiePicture: boolean = true;
  isSignaturePicture: boolean = true;
  isDisableSignaturePicture: boolean = false;

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
  bankProofImg: any;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  fileSizeWarning: boolean = false;
  errorMsg: string = '';
  // imagePreviewUrl: any;

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
    private fileExtension: ExtensionService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );

    this.title.setTitle('Upload Signature - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Uploading the signature of the customer.',
    });

    this.getPersonalDataThree();

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';
  }

  getPersonalDataThree() {
    this.spinner.show();
    var reqData = {
      flag: 'signature',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe(async (resp: any) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (resp.body.message === 'Data found') {
            var base64Image = await this.getBase64ImageFromUrl(
              response[0].Document
            );

            this.signatureData = base64Image;

            var img = new Image();
            img.onload = () => {
              const canvas = this.signaturePadElement?.nativeElement;
              const context = canvas?.getContext('2d');
              canvas.width = canvas.offsetWidth;
              canvas.height = canvas.offsetHeight;
              const scaleFactor = Math.min(
                canvas.width / img.width,
                canvas.height / img.height
              );
              const scaledWidth = img.width * scaleFactor;
              const scaledHeight = img.height * scaleFactor;
              context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
              context?.drawImage(img, 0, 0, scaledWidth, scaledHeight);
            };
            img.setAttribute('crossorigin', 'anonymous');

            img.src = base64Image;
            this.isDisableSignaturePicture = false;
            this.isSignaturePicture = false;
            this.signaturePad.off();
          }
        }
        // this.signaturePad.on();
      });
  }

  async getBase64ImageFromUrl(imageUrl: string): Promise<string> {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    } catch (Exception) {
      console.log(Exception);
      this.spinner.hide();
      return '';
    }
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    this.errors.push(error);
  }

  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    // true => move forward through devices
    // false => move backwards through devices
    // string => move to device with given deviceId
    this.nextWebcam.next(directionOrDeviceId);
  }

  public cameraWasSwitched(deviceId: string): void {
    this.deviceId = deviceId;
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  ngAfterViewChecked() {
    if (this.signaturePadElement && !this.signaturePad) {
      this.initSignaturePad();
      this.resizeObserver = new ResizeObserver(() => this.resizeCanvas());
      this.resizeObserver.observe(this.signaturePadElement.nativeElement);
    }
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  initSignaturePad() {
    if (this.signaturePadElement) {
      this.signaturePad = new SignaturePad(
        this.signaturePadElement.nativeElement,
        {
          backgroundColor: 'rgba(255, 255, 255, 0)',
          penColor: 'rgba(0, 0, 0, 1)',
        }
      );
      this.signaturePad.addEventListener('beginStroke', () => {
        this.isSignaturePicture = false;
      });
      this.signaturePad.on();
    } else {
      console.error('signaturePadElement is not available');
    }
  }

  resizeCanvas() {
    const canvas = this.signaturePadElement?.nativeElement;
    if (canvas) {
      const ratio = Math.max(window.devicePixelRatio || 1, 1);
      //const oldData = this.signaturePad?.toData();
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d')?.scale(ratio, ratio);
      // if (oldData) {
      //   this.signaturePad?.fromData(oldData);
      // }
    } else {
      console.error('Canvas element is not available');
    }
  }

  clearSignature() {
    this.signaturePad.on();
    this.initSignaturePad(); //added
    this.isDisableSignaturePicture = false;
    if (this.signaturePad) {
      this.isSignaturePicture = true;
      sessionStorage.removeItem('CaptureSignature');
      this.signaturePad.clear();
    } else {
      this.isSignaturePicture = false;
    }
  }

  getSignatureData() {
    if (this.signaturePad) {
      const dataURL = this.signaturePad.toDataURL();
      return dataURL;
    } else {
      return '';
    }
  }

  saveSignature() {
    this.spinner.show();
    this.signatureData = this.getSignatureData();
    var reqData = {
      documentType: 'DIYSignature',
      formNumber: window.sessionStorage.getItem('FormNumber'),
      flag: 'docBase64String',
      imgUploadType: 'canvas',
      imgBase64String: this.signatureData,
    };
    this._http
      .postRequest('api/v1/uploadDocument/upload', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.MoengageService.trackEvent('Signature Submission', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Signature_Method: 'Onscreen CANVAS',
            product_name: 'Onboarding DIY',
            category: 'IPV Documents',
          });

          if (this.RejectStatus != 'R') {
            setTimeout(() => {
              this.signatureImage = response;

              this.isSignaturePicture = false;
              this.checkPanNameChange();
              // this.router.navigate(['/addNominee', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            setTimeout(() => {
              this.signatureImage = response;

              this.isSignaturePicture = false;

              this.navService.navigateToNextStep();

              this.spinner.hide();
            }, 200);
          }
        } else {

          this.MoengageService.trackEvent('Signature Submission Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Signature_Method: 'Onscreen CANVAS',
            product_name: 'Onboarding DIY',
            ErrorMsg: response.message,
            category: 'IPV Documents',
          });

          this.isSignaturePicture = true;
          this.PersonalFormTwo = false;
          this.PersonalFormThree = false;
          this.PersonalFormFive = true;
          this.spinner.hide();
          this.toastr.warning(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });
          return;
        }
      });
  }

  loadSignature() {
    const signatureData = sessionStorage.getItem('signature');
    if (signatureData && this.signaturePad) {
      const image = new Image();
      image.onload = () => {
        const canvas = this.signaturePadElement?.nativeElement;
        const context = canvas?.getContext('2d');
        context?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
        context?.drawImage(image, 0, 0);
      };
      image.src = signatureData;
    } else {
    }
  }

  BackToSelfie() {
    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/CaptureSelfie', 2]);

      this.spinner.hide();
    }, 200);
  }

  BackFormFour() {
    this.PersonalFormTwo = false;
    this.PersonalFormThree = false;
    // this.PersonalFormFour = true;
    this.PersonalFormFive = false;
  }

  handleImage(webcamImage: WebcamImage) {
    this.imageDataUrl = webcamImage.imageAsDataUrl;
    this.showPreview();
  }

  triggerSnapshot() {
    this.longitude = window.sessionStorage.getItem('capturedLongitude');
    this.latitude = window.sessionStorage.getItem('capturedLatitude');
    this.triggerObservable.next();
  }

  removeModal() {
    this.resetExistingImage();
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
        this.imageChangedEvent = null;
      }
    });
  }

  showPreview() {
    var previewContainer = document.getElementById('previewContainer');
    var previewImage = document.getElementById(
      'previewImage'
    ) as HTMLImageElement;
    if (previewContainer && previewImage) {
      previewImage.src = this.imageDataUrl;
      previewContainer.style.display = 'block';
      this.isPreviewing = true;
    }
  }

  captureAgain() {
    this.imageDataUrl = '';
    const previewContainer = document.getElementById('previewContainer');
    const previewImage = document.getElementById(
      'previewImage'
    ) as HTMLImageElement;
    if (previewContainer && previewImage) {
      previewContainer.style.display = 'none';
      previewImage.src = '';
      this.isPreviewing = false;
    }
    sessionStorage.removeItem('capturedSelfie');
    this.isSelfiePicture = true;
  }

  getLocation() {
    if (!this.isGeolocationSubscribed) {
      this.isGeolocationSubscribed = true;
      this.geolocation.subscribe({
        next: (position) => {
          this.handleLocationSuccess(position);
          this.isGeolocationSubscribed = false;
        },
        error: (error) => {
          console.error('Geolocation Error:', error);
          this.handleLocationError(error);
          this.isGeolocationSubscribed = false;
        },
      });
    }
  }

  handleLocationSuccess(position: GeolocationPosition) {
    this.latitude = position.coords.latitude;
    this.longitude = position.coords.longitude;
    sessionStorage.setItem('capturedLatitude', this.latitude.toString());
    sessionStorage.setItem('capturedLongitude', this.longitude.toString());
    this.PersonalFormTwo = false;
    this.PersonalFormThree = true;
    this.PersonalFormFive = false;
    this.errorMessage = null;
  }

  handleLocationError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.errorMessage = 'User denied the request for Geolocation.';
        this.toastr.warning(this.errorMessage, 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        break;
      case error.POSITION_UNAVAILABLE:
        this.errorMessage = 'Location information is unavailable.';
        this.toastr.warning(this.errorMessage, 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        break;
      case error.TIMEOUT:
        this.errorMessage = 'The request to get user location timed out.';
        this.toastr.warning(this.errorMessage, 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        break;
      default:
        this.errorMessage = 'An unknown error occurred.';
        this.toastr.warning(this.errorMessage, 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        break;
    }
  }

  async fileChangeEvent(event: any): Promise<void> {
    var isAllowed: boolean = await this.fileExtension.onFileChange(event);
    if ((await isAllowed) != true) {
      this.isSignaturePicture = true;
      this.toastr.warning('Please select a Valid File!', '', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });
      this.PersonalFormTwo = false;
      this.PersonalFormThree = false;
      this.PersonalFormFive = true;
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

  handleImageType(file: any) {
    this.spinner.show();
    this.convertToBase64(file).subscribe(
      (base64: string) => {
        if (
          this.file.size > 1 * 1024 * 1024 &&
          this.capture_event == 'upload'
        ) {
          this.file = null;
          this.imageChangedEvent = null;
          this.croppedImage = '';
          this.spinner.hide();
        } else {
          this.fileSizeWarning = false;
          this.errorMsg = '';
          this.imageCompress.compressFile(base64, -1, 90, 70, 600, 600).then(
            (compressedBase64: string) => {
              if (compressedBase64.startsWith('data:image')) {
                this.croppedImage =
                  this.sanitizer.bypassSecurityTrustUrl(compressedBase64);
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

  resetExistingImage(): void {
    this.file = null;
    this.imageChangedEvent = null;
    this.croppedImage = '';
    this.loading = false;
    this.errorMsg = '';
  }

  convertToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      this.readFile(file, observer);
    });
  }

  readFile(file: File, observer: Observer<string>): void {
    const filereader = new FileReader();

    if (file.size > 1048576 && this.capture_event == 'upload') {
      this.errorMsg = 'Maximum file size should be less than 1 MB';
      this.imageChangedEvent = null;
      this.spinner.hide();
      return;
    } else {
      filereader.readAsDataURL(file);
      filereader.onload = () => {
        const base64 = filereader.result as string;
        this.bankProofImg = base64;
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
    //console.log('blobImage', blob);

    if (blob) {
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
              this.bankProofImg = compressedBase64;
              //console.log('this.bankProofImg', this.bankProofImg);
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

  cropperReady(sourceImageDimensions: Dimensions) {
    this.loading = false;
  }

  loadImageFailed() {
    console.error('Load image failed');

    this.spinner.hide();
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
  }

  uploadSignatureUploadImg() {
    // //console.log("this.file.type",this.file)
    // let allowed:boolean  = this.fileExtension.CheckExtension(this.file.name)
    // if (allowed != true){
    //   this.isSignaturePicture = true;
    //   this.toastr.warning('Please Upload a Valid File!', '', {
    //     positionClass: 'toast-bottom-center',
    //     timeOut: 2000,
    //   });
    //   this.PersonalFormTwo = false;
    //   this.PersonalFormThree = false;
    //   this.PersonalFormFive = true;
    //   return;
    // }
    // let allowed:boolean= this.fileExtension.readFileContent(this.file)
    //   if (allowed != true){
    //   this.isSignaturePicture = true;
    //   this.toastr.warning('Please Upload a Valid File!', '', {
    //     positionClass: 'toast-bottom-center',
    //     timeOut: 2000,
    //   });
    //   this.PersonalFormTwo = false;
    //   this.PersonalFormThree = false;
    //   this.PersonalFormFive = true;
    //   return;
    // }
    var reqData = {
      documentType: 'DIYSignature',
      formNumber: window.sessionStorage.getItem('FormNumber'),
      flag: 'docBase64String',
      imgUploadType: 'upload',
      imgBase64String: this.bankProofImg,
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/uploadDocument/upload', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        this.spinner.hide();
        if (response.status == true || response.status == 200) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          // this.toastr.success('Signature Upload Successful!', '', {
          //   positionClass: 'toast-bottom-center',
          //   timeOut: 2000,
          // });

          this.MoengageService.trackEvent('Signature Submission', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Signature_Method: 'File Upload',
            product_name: 'Onboarding DIY',
            category: 'IPV Documents',
          });

          if (this.RejectStatus != 'R') {
            this.signatureImage = response;

            // sessionStorage.setItem('CaptureSignature', 'CaptureSignature');

            this.isSignaturePicture = false;
            this.removeModal();
            //console.log('testttt');
            this.checkPanNameChange();
            // this.router.navigate(['/addNominee', 1]);
          } else {
            setTimeout(() => {
              this.signatureImage = response;

              this.isSignaturePicture = false;

              this.removeModal();

              this.navService.navigateToNextStep();

              this.spinner.hide();
            }, 200);
          }
        } else {
          this.isSignaturePicture = true;

          this.MoengageService.trackEvent('Signature Submission Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Signature_Method: 'File Upload',
            product_name: 'Onboarding DIY',
            ErrorMsg: response.message,
            category: 'IPV Documents',
          });

          this.toastr.warning(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });
          this.PersonalFormTwo = false;
          this.PersonalFormThree = false;
          this.PersonalFormFive = true;
          return;
        }
      });
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
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          //console.log(response);
          if (resp.body.message === 'Data found') {
            // this.selectedIncome = response[0].AnnualIncome;
            //console.log('sdasdasd');
            //console.log(response[0]);
            if (response[0].IsDigilocker == 0) {
              this.router.navigate(['/aadhaar-front']);
            } else if (response[0].UploadPandoc_req.toUpperCase() == 'YES') {
              this.router.navigate(['/uploadPan']);
            } else if (response[0].Namechangedoc_req.toUpperCase() == 'YES') {
              this.router.navigate(['/nameChange']);
            } else if (response[0].Additionaldoc_req.toUpperCase() == 'YES') {
              this.router.navigate(['/additional-document']);
            } else if (response[0].SupportDoc_req.toUpperCase() == 'YES') {
              this.router.navigate(['/support-document']);
            } else {
              this.router.navigate(['/addNominee', 1]);
            }
          }
        }
        this.spinner.hide();
      });
  }

  // triggerFileInput(): void {
  //   this.fileInput.nativeElement.click();
  // }

  // onFileChange(event: Event): void {
  //   const input = event.target as HTMLInputElement;
  //   if (input.files && input.files[0]) {
  //     const file = input.files[0];
  //     const reader = new FileReader();

  //     reader.onload = (e: ProgressEvent<FileReader>) => {
  //       this.imagePreviewUrl = e.target?.result;
  //     };

  //     reader.readAsDataURL(file);
  //   }
  // }

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
