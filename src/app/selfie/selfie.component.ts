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
declare let $: any;

import * as bootstrap from 'bootstrap';
import { ExtensionService } from '../extension.service';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
  selector: 'app-selfie',
  templateUrl: './selfie.component.html',
  styleUrls: ['./selfie.component.css'],
})
export class SelfieComponent implements OnDestroy, OnInit {
  @Output()
  public pictureTaken = new EventEmitter<WebcamImage>();
  // @ViewChild('fileInput') fileInput!: ElementRef;
  // toggle webcam on/off
  public showWebcam = true;
  public allowCameraSwitch = true;
  public multipleWebcamsAvailable = false;
  public deviceId: any;
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

  PersonalFormTwo: boolean = false;
  PersonalFormThree: boolean = false;

  triggerObservable: Subject<void> = new Subject<void>();
  // public videoOptions: MediaTrackConstraints = {
  //   facingMode: 'user',
  // };
  isPreviewing: boolean = false;
  isAccess: boolean = false;

  timeoutId: any;
  location: GeolocationPosition | null = null;
  latitude: any;
  longitude: any;
  errorMessage: string | null = null;
  clientid: any;
  SSLAPP: any;
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
  isDisableSignaturePicture: boolean = true;
  cameraPermission: boolean = false;

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
  hasRefreshed: boolean = false;
  continueLink: any;
  web:boolean=true;
  ios:any;
  android:any;


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
    private fileExtension: ExtensionService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    WebcamUtil.getAvailableVideoInputs().then(
      (mediaDevices: MediaDeviceInfo[]) => {
        this.multipleWebcamsAvailable = mediaDevices && mediaDevices.length > 1;
      }
    );  

    this.getLocation();

    this.title.setTitle('Upload Selfie - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Uploading the signature of the customer.',
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

    this.SSLAPP = sessionStorage.getItem('SSLAPP')??'N';
    
      this.detectDevice();
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
        this.getPersonalDataTwo();
        break;
      default:
        break;
    }
  }

  getPersonalDataTwo() {
    this.spinner.show();
    var reqData = {
      flag: 'selfie',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe(async (resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (resp.body.message === 'Data found') {
            var base64Image = await this.getBase64ImageFromUrl(
              response[0].Document
            );

            this.imageDataUrl = base64Image;

            this.showPreview();

            setTimeout(() => {
              this.spinner.hide();
            }, 1000);
          }

          this.spinner.hide();
        }
        this.spinner.hide();
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
      this.spinner.hide();
      console.log(Exception);
      return '';
    }
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
    } else {
      this.isPreviewing = false;
    }
  }

  public toggleWebcam(): void {
    this.showWebcam = !this.showWebcam;
  }

  public handleInitError(error: WebcamInitError): void {
    if (
      error.mediaStreamError &&
      error.mediaStreamError.name === 'NotAllowedError'
    ) {
      console.error('Camera permission denied by the user:', error);
      this.cameraPermission = true;
      this.isPreviewing = false;
    } else {
      this.isPreviewing = true;
      this.showPreview();
    }
  }

  // public showNextWebcam(directionOrDeviceId: boolean | string): void {
  //   if (this.showWebcam) {
  //     this.nextWebcam.next(directionOrDeviceId);
  //     alert('Enabled the webcam.');
  //   } else {
  //     alert('Please enable the webcam first.');
  //   }
  // }
  public showNextWebcam(directionOrDeviceId: boolean | string): void {
    try {
      this.nextWebcam.next(directionOrDeviceId);
    } catch (error: any) {
      this.handleInitError(error);
    }
  }

  public cameraWasSwitched(deviceId: string): void {
    if (deviceId && deviceId.trim() !== '') {
      this.deviceId = deviceId;
    } else {
      alert('Device ID does not meet the condition.');
    }
  }

  public get nextWebcamObservable(): Observable<boolean | string> {
    return this.nextWebcam.asObservable();
  }

  captureAgain() {
    if (this.cameraPermission!=false){
      this.openModalCamera();
      return;
    }
    this.imageDataUrl = '';
    var previewContainer = document.getElementById('previewContainer');
    var previewImage = document.getElementById(
      'previewImage'
    ) as HTMLImageElement;
    if (previewContainer && previewImage) {
      previewContainer.style.display = 'none';
      previewImage.src = '';
      this.isPreviewing = true;
    }
    this.isPreviewing = false;
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
        //   this.toastr.warning("Geolocation Error:"+error, 'Warning', {
        //   positionClass: 'toast-bottom-center',
        //   timeOut: 2000,
        // });
          this.handleLocationError(error);
          this.isGeolocationSubscribed = false;
        },
      });
    }
  }

  handleLocationSuccess(position: GeolocationPosition) {
    if (this.isGeolocationSubscribed) {
      this.latitude = position.coords.latitude;
      this.longitude = position.coords.longitude;
      sessionStorage.setItem('capturedLatitude', this.latitude.toString());
      sessionStorage.setItem('capturedLongitude', this.longitude.toString());
      this.errorMessage = null;
      this.autoRefresh();
    }
  }

  handleLocationError(error: GeolocationPositionError) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        this.errorMessage =
          'Please go to settings of your browser or device and provide access to location to continue.';
        // this.toastr.warning(this.errorMessage, 'Warning', {
        //   positionClass: 'toast-bottom-center',
        //   timeOut: 2000,
        // });
        this.isAccess = true;
        this.router.navigate(['/CaptureSelfie', 1]);
        break;
      case error.POSITION_UNAVAILABLE:
        this.errorMessage = 'Location information is unavailable.';
        // this.toastr.warning(this.errorMessage, 'Warning', {
        //   positionClass: 'toast-bottom-center',
        //   timeOut: 2000,
        // });
        this.isAccess = true;
        this.router.navigate(['/CaptureSelfie', 1]);
        break;
      case error.TIMEOUT:
        this.errorMessage = 'The request to get user location timed out.';
        // this.toastr.warning(this.errorMessage, 'Warning', {
        //   positionClass: 'toast-bottom-center',
        //   timeOut: 2000,
        // });
        this.isAccess = true;
        this.router.navigate(['/CaptureSelfie', 1]);
        break;
      default:
        this.errorMessage = 'An unknown error occurred.';
        this.toastr.warning(this.errorMessage, 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        this.isAccess = true;
        this.router.navigate(['/CaptureSelfie', 1]);
        break;
    }

    this.MoengageService.trackEvent('Selfie Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Geolocation_Lat: this.latitude,
              Geolocation_Long: this.longitude,
              ErrorMsg: this.errorMessage,
              product_name: 'Onboarding DIY',
              category: 'IPV Documents',
            });
  }

  autoRefresh() {
    if (this.isAccess && !this.hasRefreshed) {
      this.hasRefreshed = true;
      setTimeout(() => {
        window.location.reload();
      }, 5000);
    }
  }

  // Image Cropper
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
    this.file = event.target.files[0];
    this.loading = true;
    this.imageChangedEvent = event;

    // Convert the file to base64
    this.convertToBase64(this.file).subscribe(
      (base64: any) => {
        this.file.base64 = base64;
        this.loading = false;
      },
      (error: any) => {
        console.error('Error converting file to base64:', error);
        this.loading = false;
      }
    );
  }

  convertToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      this.readFile(file, observer);
    });
  }

  readFile(file: File, observer: Observer<string>): void {
    var filereader = new FileReader();
    filereader.readAsDataURL(file);
    filereader.onload = () => {
      let result = filereader.result as string;
      var base64 = result;
      this.bankProofImg = base64;
      observer.next(base64);
      observer.complete();
    };
    filereader.onerror = (error) => {
      observer.error(error);
      observer.complete();
    };
  }

  imageCropped(event: ImageCroppedEvent) {
    var image = new Image();
    var objectUrl = event.objectUrl || event.base64 || '';
    this.loading = true;
    new Promise<void>((resolve, reject) => {
      image.onload = () => {
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(image.src);
        resolve();
      };
      image.onerror = () => {
        reject();
      };
      image.src = objectUrl;
    })
      .then(() => {
        this.loading = false;
      })
      .catch(() => {
        this.toastr.error('Failed to load image', 'Error', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        this.loading = false;
      });
  }

  imageLoaded() {
    this.showCropper = true;
  }

  cropperReady(sourceImageDimensions: Dimensions) {
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
  }

  ngOnDestroy() {
    if (this.resizeObserver) {
      this.resizeObserver.disconnect();
    }
  }

  handleImage(webcamImage: WebcamImage) {
    this.imageDataUrl = webcamImage.imageAsDataUrl;
    this.showPreview();
  }

  triggerSnapshot() {
    if (this.cameraPermission!=false){
      this.openModalCamera();
      return;
    }
    this.longitude = window.sessionStorage.getItem('capturedLongitude');
    this.latitude = window.sessionStorage.getItem('capturedLatitude');
    this.triggerObservable.next();
  }

  removeModal() {
    var modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });
  }
  detectDevice() {
    var android_test = /Android/i.test(navigator.userAgent);
    var ios_test = /iPhone|iPad|iPod/i.test(navigator.userAgent);
    console.log("this.android",this.android)
    console.log("this.ios",this.ios)
    console.log("this.web",this.web)
    //Case 1
    this.web = true;
    // this.android = false;j
    // this.ios = false;
    
    //Case 2
    if (android_test == true) {
      this.android = true;
      this.web=false
      this.ios = false

      //console.log('mobile');
      //Case 3
    } else if (ios_test == true && this.SSLAPP == 'Y'){
      this.ios = true;
      this.android = false;
      this.web=false;
    } 
  }
  continueWithMobile() {
    this.spinner.show();
    var reqData = {
      flag: 'sendlink',
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/communication/sendsms', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          this.continueLink = response;
          //console.log('this.continueLink', this.continueLink);
          // this.captureWindowBox();
          this.toastr.info(
            'Kindly follow the link in the SMS sent to your registered mobile number.',
            '',
            {
              positionClass: 'toast-bottom-center',
              timeOut: 6000,
            }
          );

          this.spinner.hide();
        } else {
          this.spinner.hide();
        }
      });
  }

  // captureWindowBox() {
  //   const continueLnk = document.getElementById('continueLink');
  //   if (continueLnk) {
  //     const myLinkModal = new bootstrap.Modal(continueLnk);
  //     myLinkModal.show();
  //   } else {
  //     this.removeModal();
  //   }
  // }

  uploadSelfieApiCall() {

    if (this.latitude != null && this.latitude != "" && this.longitude != null && this.longitude != ""){
    this.spinner.show();
    var reqData = {
      documentType: 'PhotoProof',
      formNumber: window.sessionStorage.getItem('FormNumber'),
      flag: 'docBase64String',
      imgBase64String: this.imageDataUrl,
      lat: this.latitude,
      longi: this.longitude,
    };
    //console.log('api/v1/uploadDocument/upload', reqData);

    this._http
      .postRequest('api/v1/uploadDocument/upload', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        //this.spinner.hide();

        let data: any = JSON.parse(
          this.aesService.decrypt(response.data, this.clientid, this.clientid)
        );

        if (
          response.status === true &&
          response.message != 'Live face detection failed' &&
          data.are_eyes_open === 'true'
        ) {
          response.data = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.MoengageService.trackEvent('Selfie Submission', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Liveliness_Status: JSON.stringify(data),
            Geolocation_Lat: this.latitude,
            Geolocation_Long: this.longitude,
            product_name: 'Onboarding DIY',
            category: 'IPV Documents',
          });

          this.selfieImage = response;
          //console.log('this.selfieImage', this.selfieImage);

          if (this.RejectStatus != 'R') {
            this.router.navigate(['/uploadSignature']);
            this.spinner.hide();
          } else {
            this.navService.navigateToNextStep();
            this.spinner.hide();
          }
        } else if (data.are_eyes_open === 'false') {
          this.isSelfiePicture = true;
          this.PersonalFormTwo = false;
          this.PersonalFormThree = true;

          this.MoengageService.trackEvent('Selfie Submission Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Liveliness_Status: JSON.stringify(data),
            Geolocation_Lat: this.latitude,
            Geolocation_Long: this.longitude,
            ErrorMsg: 'Please make sure your Eyes are Open',
            product_name: 'Onboarding DIY',
            category: 'IPV Documents',
          });

          this.captureAgain();

          this.spinner.hide();

          this.toastr.warning(
            'Please make sure your Eyes are Open',
            'Warning',
            {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            }
          );
        } else {
          response.data = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (response.data.face_detected === 'false') {
            this.isSelfiePicture = true;
            this.PersonalFormTwo = false;
            this.PersonalFormThree = true;

            this.MoengageService.trackEvent('Selfie Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Liveliness_Status: JSON.stringify(data),
              Geolocation_Lat: this.latitude,
              Geolocation_Long: this.longitude,
              ErrorMsg: 'Please make sure your Face is clearly visible',
              product_name: 'Onboarding DIY',
              category: 'IPV Documents',
            });

            this.captureAgain();

            this.spinner.hide();

            this.toastr.warning(
              'Please make sure your Face is clearly visible',
              'Warning',
              {
                positionClass: 'toast-bottom-center',
                timeOut: 3000,
              }
            );
          } else if (response.data.multiple_faces_detected === 'true') {
            this.isSelfiePicture = true;
            this.PersonalFormTwo = false;
            this.PersonalFormThree = true;

            this.MoengageService.trackEvent('Selfie Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Liveliness_Status: JSON.stringify(data),
              Geolocation_Lat: this.latitude,
              Geolocation_Long: this.longitude,
              ErrorMsg: 'Multiple faces detected',
              product_name: 'Onboarding DIY',
              category: 'IPV Documents',
            });

            this.captureAgain();

            this.spinner.hide();

            this.toastr.warning('Multiple faces detected', 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });
          } else if (response.data.is_face_cropped === 'true') {
            this.isSelfiePicture = true;
            this.PersonalFormTwo = false;
            this.PersonalFormThree = true;

            this.MoengageService.trackEvent('Selfie Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Liveliness_Status: JSON.stringify(data),
              Geolocation_Lat: this.latitude,
              Geolocation_Long: this.longitude,
              ErrorMsg:
                'Face is cropped in the selfie. Ensure the whole face is captured inside the circle while clicking the selfie',
              product_name: 'Onboarding DIY',
              category: 'IPV Documents',
            });

            this.captureAgain();

            this.spinner.hide();

            this.toastr.warning(
              'Face is cropped in the selfie. Ensure the whole face is captured inside the circle while clicking the selfie',
              'Warning',
              {
                positionClass: 'toast-bottom-center',
                timeOut: 4000,
              }
            );
          } else {
            this.isSelfiePicture = true;
            this.PersonalFormTwo = false;
            this.PersonalFormThree = true;

            this.MoengageService.trackEvent('Selfie Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Liveliness_Status: JSON.stringify(data),
              Geolocation_Lat: this.latitude,
              Geolocation_Long: this.longitude,
              ErrorMsg: response.message,
              product_name: 'Onboarding DIY',
              category: 'IPV Documents',
            });

            this.captureAgain();

            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.spinner.hide();
          }
        }
        this.spinner.hide();
      });

    //this.spinner.hide();

    //this.captureAgain();
    }
    else{

      this.openModalLocation();
      return;

    }

  }

  redirectPlanProcess() {
    this.spinner.show();
    setTimeout(() => {
      var modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
      this.router.navigate(['/planprocess', 3]);
      this.spinner.hide();
    }, 200);
  }

  redirectToTwo() {

    if (!this.isGeolocationSubscribed && this.isAccess != true) {
      this.PersonalFormTwo = false;
      this.PersonalFormThree = true;
      this.isPreviewing = false;
      this.spinner.hide();
      this.router.navigate(['/CaptureSelfie', 2]);
    } else {
      this.isPreviewing = true;
      this.showPreview();
      this.openModalLocation();
    }
  }
  openModalLocation() {
    $('#refreshPage').modal('show');
  }
  openModalCamera() {
    $('#refreshPageCamera').modal('show');
  }

  closeModalLocation() {
    $('#refreshPage').modal('hide');
  }    
  closeModalCamera() {
    $('#refreshPageCamera').modal('hide');
  }

  BackToOne() {
    this.spinner.show();
    setTimeout(() => {
      this.PersonalFormTwo = true;
      this.PersonalFormThree = false;
      this.getLocation();
      this.router.navigate(['/CaptureSelfie', 1]);
      this.spinner.hide();
    }, 200);
  }

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName
    )}`;
  }
}
