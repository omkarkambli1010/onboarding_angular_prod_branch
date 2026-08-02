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
import ImageCompressor from 'image-compressor.js';
import { Observable, Observer } from 'rxjs';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
  selector: 'app-link-bank-account',
  templateUrl: './link-bank-account.component.html',
  styleUrls: ['./link-bank-account.component.css'],
})
export class LinkBankAccountComponent implements OnInit {
  clientid: any;

  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

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

    this.isIOS();
  }

  isIOS() {
    // let isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);

    let isIos = this.detectIOS();

    //console.log('IOS Value', isIos);

    window.sessionStorage.setItem('isIos', isIos.toString());
  }

  // detectSafariOnIpadOS(): boolean {

  //   var userAgent = navigator.userAgent;
  //   var isSafari = /^((?!chrome|android).)*safari/i.test(userAgent);
  //   var isIpad = /iPad/i.test(userAgent);
  //   var isMacintosh = /Macintosh/i.test(userAgent);
  //   var isTouchDevice = "ontouchend" in document;

  //   //console.log("User Agent:", userAgent);
  //   //console.log("detectSafariOnIpadOS result:", isSafari && (isIpad || (isMacintosh && isTouchDevice)));

  //   if (isSafari && (isIpad || (isMacintosh && isTouchDevice))) {
  //     return true;
  //   }
  //   else {
  //     return false
  //   }

  //}

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

  enterManually() {
    this.spinner.show();
    console.log('PID');

    this.MoengageService.trackEvent('Bank Verification Method', {
      product_id: window.sessionStorage.getItem('FormNumber') ?? '',
      Method_used: 'Penny Drop',
      product_name: 'Onboarding DIY',
      category: 'Bank Verification',
    });

    setTimeout(() => {
      this.router.navigate(['/PennyDrop', 1]);
      this.spinner.hide();
    }, 200);
  }

  // enterPaymentGateway() {
  //   const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  //   if (isMobile) {
  //     //console.log('mobile');
  //     this.spinner.show();

  //     setTimeout(() => {
  //       this.router.navigate(['/reversePennyDrop', 1]);
  //       this.spinner.hide();
  //     }, 200);
  //   } else {
  //     //console.log('Desktop');
  //     this.spinner.show();

  //     setTimeout(() => {
  //       this.router.navigate(['/reversePennyDropRpd', 1]);
  //       this.spinner.hide();
  //     }, 200);
  //   }
  // }

  enterPaymentGateway() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    console.log('RPD');

    this.MoengageService.trackEvent('Bank Verification Method', {
      product_id: window.sessionStorage.getItem('FormNumber') ?? '',
      Method_used: 'UPI',
      product_name: 'Onboarding DIY',
      category: 'Bank Verification',
    });

    if (isMobile) {
      //console.log('mobile');
      this.spinner.show();

      setTimeout(() => {
        this.router.navigate(['/reversePennyDrop', 1]);
        this.spinner.hide();
      }, 200);
    } else {
      //console.log('Desktop');
      this.spinner.show();

      setTimeout(() => {
        this.router.navigate(['/reversePennyDrop', 1]);
        this.spinner.hide();
      }, 200);
    }
  }

  BackToFive() {
    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/personalDetailsForm', 5]);
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
