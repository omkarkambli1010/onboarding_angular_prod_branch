import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Inject,
  NgZone,
  OnInit,
  Renderer2,
  ViewChild,
  DOCUMENT,
  ChangeDetectionStrategy
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../api.service';
import { Meta, Title } from '@angular/platform-browser';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { NgModel } from '@angular/forms';
import { NavigationService } from '../navigation.service';
import { NgOtpInputConfig } from 'ng-otp-input';
import { CookieService } from 'ngx-cookie-service';
declare let $: any;
import * as bootstrap from 'bootstrap';

import { MoengagesdkService } from '../moengagesdk.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { delay } from 'rxjs';

declare const google: any;

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css'],
    changeDetection: ChangeDetectionStrategy.Eager,
    standalone: false
})
export class HomeComponent implements OnInit {
  @ViewChild('mobilecloseModal') mobilecloseModal: any;
  @ViewChild('emailclosebutton') emailclosebutton: any;
  @ViewChild('otpMobileInput') otpMobileInput: any | NgModel;
  @ViewChild('otpEmailInput') otpEmailInput: any | NgModel;

  clientid: any;
  mobile: string = '';
  email: string = '';
  mobileOTPResponse: any;
  emailOTPResponse: any;
  timeLeft: number = 30;
  interval: any;
  timerStart: any;
  displayMobile: any;
  timeroff: any = true;
  displayEmail: any;
  timeroff1: any = true;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  status: string = '';
  sendOtp: any = {
    mobile: '',
    email: '',
    fullname: '',
  };
  isWrongOTP: boolean = false;
  isRightOTP: boolean = false;
  mobileReq: boolean = false;
  mobileDigitReq: boolean = false;
  emailReq: boolean = false;
  emailFormatVal: boolean = false;
  emailspecialchars: boolean = false;
  Googleoath: boolean = true;
  emailmultiplesymb: boolean = false;
  sbiemailFormatVal: boolean = false;
  isDisabledLoginBtn: boolean = true;
  isMobileVerifyBtn: boolean = true;
  isValidEmailBtn: boolean = true;
  isEmailDisableBtn: boolean = true;
  otpFieldMobile: any;
  otpFieldEmail: any;
  // mainContent: boolean = true;

  // emailGoogle: boolean = false;
  otpMobile: any;
  otpEmail: any;
  ngOtpInput: any;
  otp: any;
  config: NgOtpInputConfig = {
    allowNumbersOnly: true,
    length: 6,
    isPasswordInput: false,
    disableAutoFocus: false,
    placeholder: '',
  };

  gmailparams: any = {
    email: '',
    name: '',
    email_verified: '',
    EmailError: '',
  };

  homeURL: any;
  mobileEncrpyt: any;
  mobileDecrpyt: any;
  fullnameEncrpyt: any;
  fullnameDecrpyt: any;
  googleprompt: string = '';
  googlebtn: boolean = false;
  googleHideBtn: boolean = false;

  responsiveOptions: any = [];

  responsiveVideoOptions: any = [
    {
      breakpoint: '1024px',
      numVisible: 2,
      numScroll: 1,
    },
    {
      breakpoint: '768px',
      numVisible: 1,
      numScroll: 1,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ];

  testimonials: any[] = [
    {
      message:
        'We appreciate the innovative solutions and tools provided by SBI Securities, particularly the SBI Securities app. The app has been a game-changer for us, offering a seamless and intuitive trading experience. Its features, such as real-time market updates, customizable watchlists, and easy order placement, have greatly enhanced our investment experience.',
      author: 'Arun Kumar Mishra',
    },
    {
      message:
        'I am really thankful for your personal touch in understanding SBI Securities platform.  Earlier, I was not aware about Infra Tracker, Reality Tracker, and other Trackers bunch available in the platform which helped me to invest in better manner as portfolio. For resolving my day to day issues, you have been helpful. ',
      author: 'Rajiv Ranjan',
    },
  ];

  // cc_load_policy=1 turns the YouTube caption track on by default (WCAG 1.2.2).
  // `transcript` backs the text alternative required by 1.2.3; the panel and its
  // link only render once the transcript copy has been supplied.
  videos: any[] = [
    {
      url: 'https://www.youtube.com/embed/0cfFB8d_n60?si=Mwd2ApOaaT1SXOhM&cc_load_policy=1',
      caption: 'Invest to your FULL POTENTIAL with the SBI Securities App!',
      transcriptId: 'transcript-invest-full-potential',
      transcript: '',
    },
    {
      url: 'https://www.youtube.com/embed/Rb7IE_P3UcA?cc_load_policy=1',
      caption:
        'E‑Margin (Margin Trading Facility) - Up to 4x Buying Power at 0% Interest for 23 trading days',
      transcriptId: 'transcript-emargin',
      transcript: '',
    },
  ];

  videoItems: any[] = [
    {
      embedUrl: 'https://www.youtube.com/embed/0cfFB8d_n60?si=Mwd2ApOaaT1SXOhM',
      title: 'Invest to your FULL POTENTIAL with the SBI Securities App!',
    },
    {
      embedUrl: 'https://www.youtube.com/embed/Rb7IE_P3UcA',
      title:
        'E-Margin (Margin Trading Facility) - Up to 4x Buying Power at 0% Interest for 23 trading days',
    },
  ];

  panFullNameReqSpecial: boolean = false;
  panFullNameReqDigit: boolean = false;
  panFullNameReqSpace: boolean = false;

  junkValueString: any;
  moreThanTwoValues: boolean = false;

  constructor(
    private _http: APIService,
    private router: Router,
    private title: Title,
    private meta: Meta,
    private aesService: AesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private navService: NavigationService,
    private zone: NgZone,
    private cdr: ChangeDetectorRef,
    private chCookie: CookieService,
    private renderer: Renderer2,
    private MoengageService: MoengagesdkService,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngAfterViewInit(): void {
    // WCAG 1.3.1 (Issue: carousel content skipped by screen reader).
    // PrimeNG p-carousel sets aria-hidden="true" on the visible item
    // wrappers, causing NVDA to skip the testimonial / video content.
    // Remove aria-hidden from any carousel item that is actually visible,
    // and keep doing so as PrimeNG re-renders on interaction/resize.
    const unhideVisibleCarouselItems = () => {
      const items = this.document.querySelectorAll(
        '.p-carousel-items-container [aria-hidden="true"]'
      );
      items.forEach((el: Element) => {
        const htmlEl = el as HTMLElement;
        if (htmlEl.offsetParent !== null) {
          htmlEl.removeAttribute('aria-hidden');
        }
      });
    };
    setTimeout(unhideVisibleCarouselItems, 500);
    setTimeout(unhideVisibleCarouselItems, 1500);
    window.addEventListener('resize', () =>
      setTimeout(unhideVisibleCarouselItems, 300)
    );
  }

  /**
   * WCAG 1.2.3 - when the user follows the transcript link, move focus to the
   * transcript itself rather than just scrolling the page.
   */
  focusTranscript(event: Event, transcriptId: string) {
    event.preventDefault();
    const target = this.document.getElementById(transcriptId);
    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' });
      target.focus();
    }
  }


  ngOnInit(): void {

    this.setJourneyBanner();


    this.getJunkValue();
    this.addFaqStructuredData();
    this.sendOtp.mobile = sessionStorage.getItem('mobile');
    this.sendOtp.fullname = sessionStorage.getItem('NameSubmitted');

    this.title.setTitle(
      'Open Demat Account - Free Demat & Trading Account Opening Online | SBI Securities'
    );

    this.meta.updateTag({
      name: 'description',
      content:
        'Open Demat Account - Zero Cost Demat & Trading Account opening online at SBI Securities; ₹0* Brokerage till ₹75 lakh Trades, Flat Brokerage ₹20/order* and Zero AMC for 1st Year & more',
    });

    this.clientid = window.sessionStorage.getItem('clientid') ?? '';
    this.utm_source = this.route.snapshot.queryParams['utm_source'] || 'NA';
    this.utm_medium = this.route.snapshot.queryParams['utm_medium'] || 'NA';
    this.utm_campaign = this.route.snapshot.queryParams['utm_campaign'] || 'NA';
    this.status = this.route.snapshot.queryParams['status'];

    this.gmailparams.email_verified =
      this.route.snapshot.queryParams['email_verified'] || '';

    this.gmailparams.email = this.route.snapshot.queryParams['email'] || '';

    this.gmailparams.name = this.route.snapshot.queryParams['name'] || '';

    this.gmailparams.EmailError =
      this.route.snapshot.queryParams['Error'] || '';

    //console.log('email:', this.gmailparams.email);
    //console.log('email_verified:', this.gmailparams.email_verified);
    //console.log('name:', this.gmailparams.name);

    if (
      this.gmailparams.email != '' &&
      this.gmailparams.email_verified === 'true'
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

      this.getEmailOtpVerify(false);
    } else if (
      this.gmailparams.EmailError != '' &&
      this.gmailparams.EmailError != null
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

        this.MoengageService.trackEvent('Google Authentication Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          product_name: 'Onboarding DIY',
          category: 'Google Authentication',
          ErrorMsg: 'Google Authentication Failed, Please Try Again...',
        });
      }, 500);

      // const mobileOtpModal = document.getElementById('mobileotp');
      // mobileOtpModal?.classList.remove('show');
      // $('#mobileOtpModal').modal('show');
      this.clearTimer();
      // this.clearMobileOTPFields();
      // this.removeModal();
      // this.emailWindowBox();

      this.toastr.error(
        'Google Authentication Failed, Please Try Again...',
        'Error',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 5000,
        }
      );
    }

    if (this.status == 'exhausted') {
      this.toastr.warning(
        'Your Mobile OTP request limit is exhausted, please retry to log in after 15 minutes',
        'Warning',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 5000,
        }
      );
    }

    if (this.status == 'internal_server_error') {
      this.toastr.error('Internal Server Error', 'Error', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const utmSource = urlParams.get('utm_source');

    if (
      !utmSource ||
      utmSource === 'search-engine' ||
      utmSource === 'search_engine' ||
      utmSource === 'NA' ||
      utmSource === ''
    ) {
      this.googleHideBtn = false;
      //console.log('hide');
    } else {
      this.googleHideBtn = true;
      //console.log('show');
    }

    var cookie = this.chCookie.getAll();

    this.route.queryParams.subscribe((params: any) => {
      if (Object.keys(params).length > 0) {
        this.mobileEncrpyt = params.request;
        this.fullnameEncrpyt = params.name_submitted;

        // if (
        //   (this.mobileEncrpyt && this.mobileEncrpyt.trim() !== '') ||
        //   (this.fullnameEncrpyt && this.fullnameEncrpyt.trim() !== '')
        // ) {
        //   sessionStorage.removeItem('mobile');
        //   sessionStorage.removeItem('NameSubmitted');
        // }

        if (
          (this.mobileEncrpyt != null &&
            this.mobileEncrpyt != '' &&
            this.mobileEncrpyt != undefined) ||
          (this.fullnameEncrpyt != null &&
            this.fullnameEncrpyt != '' &&
            this.fullnameEncrpyt != undefined)
        ) {
          this.homeURL = {
            utm_source: params['utm_source'] || 'NA',
            utm_campaign: params['utm_campaign'] || 'NA',
            utm_medium: params['utm_medium'] || 'NA',
            status: params['status'] || '',
          };
          var enc_mob = this.mobileEncrpyt;
          enc_mob = enc_mob.replaceAll('/slash/g', '/');
          enc_mob = enc_mob.replaceAll('/plus/g', '+');
          enc_mob = enc_mob.replaceAll('/equal/g', '==');

          var enc_fullname = this.fullnameEncrpyt;
          enc_fullname = enc_fullname.replaceAll('/slash/g', '/');
          enc_fullname = enc_fullname.replaceAll('/plus/g', '+');
          enc_fullname = enc_fullname.replaceAll('/equal/g', '==');

          this.mobileDecrpyt = this.aesService.decrypt(
            enc_mob,
            this.clientid,
            this.clientid
          );
          this.fullnameDecrpyt = this.aesService.decrypt(
            enc_fullname,
            this.clientid,
            this.clientid
          );
          console.log('enc_mob---->', this.mobileDecrpyt);
          console.log('enc_fullname---->', this.fullnameDecrpyt);
          this.sendOtp.mobile = this.mobileDecrpyt;
          this.sendOtp.fullname = this.fullnameDecrpyt;

          if (params.request || params.name_submitted) {
            sessionStorage.setItem('mobile', this.sendOtp.mobile);
            sessionStorage.setItem('NameSubmitted', this.sendOtp.fullname);
          }

          if (this.status == 'valid') {
            // $('#mobileotp').modal('show');

            // this.startTimerMobile();
            // this.timeroff = true;

            this.mobileReq = false;
            this.mobileDigitReq = false;
          } else {
            // $('#mobileotp').modal('hide');
          }
        }
        // this.clearMobileOTPFields();
      } else {
        this.spinner.hide();
      }
    });

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 2,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];

    this.route.queryParams.subscribe((params) => {
      const utmSourceURL = params['utm_source'] || '';

      if (utmSourceURL) {
        sessionStorage.setItem('UTMSOURCE', utmSourceURL);
        this.utm_source = utmSourceURL;
      } else {
        this.utm_source = sessionStorage.getItem('UTMSOURCE') || 'NA';
      }
    });
  }

  desktopBanner =
    'assets/images/diy/Website-Banner-DIY2-Foreground.webp';

  mobileBanner =
    'assets/images/diy/Website-Banner-DIY2-Mobile-Foreground.webp';

  private setJourneyBanner(): void {
    const queryParams = new URLSearchParams(window.location.search);

    const utmSource = queryParams.get('utm_source')?.trim().toLowerCase();
    // const utmMedium = queryParams.get('utm_medium')?.trim().toLowerCase();
    // const utmCampaign = queryParams.get('utm_campaign')?.trim().toLowerCase();

    const isRetailSalesJourney =
      /* utmSource === 'retailsales' &&
      utmMedium === 'email' &&
      utmCampaign === 'na';
 */
      utmSource === 'retailsales'
    if (isRetailSalesJourney) {
      this.desktopBanner =
        'assets/images/diy/Website-Banner-DIY2-Foreground_RetailSales.webp';

      this.mobileBanner =
        'assets/images/diy/Website-Banner-DIY2-Mobile-Foreground_RetailSales.webp';
    }
  }

  onOtpChange(otp: any) {
    this.otp = otp;
  }

  onOtpChangeMobile(otpMobile: string) {
    this.zone.run(() => {
      this.otpFieldMobile = otpMobile;
      this.checkIfAllOTPMobileFilled();
      this.cdr.detectChanges();
    });
  }

  onOtpChangeEmail(otpEmail: string) {
    this.zone.run(() => {
      this.otpFieldEmail = otpEmail;
      this.checkIfAllOTPEmailFilled();
      this.cdr.detectChanges();
    });
  }

  timer() {
    this.clearTimer();
    this.interval = setInterval(() => {
      if (this.timeLeft > 0) {
        this.timeLeft--;
      } else {
        this.timeLeft = 30;
      }
    }, 1000);
  }

  startTimerMobile() {
    // this.clearTimer();
    let minute = 1;
    let seconds: number = minute * 30;
    let textSec: any = '0';
    let statSec: number = 30;
    this.displayMobile = `00:30`;
    const prefix = minute < 10 ? '0' : '';

    this.interval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 29;
      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displayMobile = `${prefix}${Math.floor(seconds / 30)}:${textSec}`;

      if (seconds == 0) {
        this.timeroff = false;
        this.clearTimer();
      }
    }, 1000);
  }

  startTimerEmail() {
    // this.clearTimer();
    let minute = 1;
    let seconds: number = minute * 30;
    let textSec: any = '0';
    let statSec: number = 30;
    this.displayEmail = `00:30`;
    const prefix = minute < 10 ? '0' : '';

    this.interval = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 29;
      if (statSec < 10) {
        textSec = '0' + statSec;
      } else textSec = statSec;

      this.displayEmail = `${prefix}${Math.floor(seconds / 30)}:${textSec}`;

      if (seconds == 0) {
        this.timeroff1 = false;
        this.clearTimer();
      }
    }, 1000);
  }

  termsPage() {
    const newTab = window.open('https://www.sbisecurities.in/terms', '_blank');
    if (newTab) {
      newTab.opener = null;
    }
  }

  clearTimer() {
    // this.mainContent = true;
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
    this.timeLeft = 30;
  }

  mobileNoValidation2(event: any) {
    let input = event.target.value;
    this.mobileNoValidation(event, true);
  }

  mobileNoValidation(event: any, showError: boolean) {
    this.mobileDigitReq = false;
    let input = event.target.value;
    input = input.replace(/\D/g, '');
    if (input.length > 10) {
      input = input.slice(0, 10);
    }
    if (input.length >= 1 && !['6', '7', '8', '9'].includes(input.charAt(0))) {
      input = input.slice(1);
    }
    event.target.value = input;
    if (input.length > 0) {
      this.sendOtp.mobile = input;
    }
    if (showError) {
      if (input.length >= 10) {
        this.mobileReq = false;
        this.mobileDigitReq = false;
      } else {
        this.mobileReq = false;
        this.mobileDigitReq = true;
      }
    }
    this.validateFormFields();
  }

  getJunkValue() {
    const reqData = {
      flag: 'Junkvalue',
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/masters/getjunkvalue', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        }
        this.junkValueString = response || [];
        // console.log('this.junkValueString', this.junkValueString);

        this.spinner.hide();
      });
  }

  checkInput(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    this.moreThanTwoValues = value.length > 0 && value.length <= 2;
    value = value.replace(/\s{2,}/g, ' ');
    value = value.replace(/[^a-zA-Z\s]/g, '');
    value = value.toUpperCase();
    event.target.value = value;
    this.sendOtp.fullname = value;
    this.panFullNameReqSpace = value.length === 0;
    this.validateFormFields();
  }

  updateDisplayedName2(event: any) {
    let value = event.target.value;

    value = value.replace(/^\s+/, '');
    value = value.replace(/\s{2,}/g, ' ');
    value = value.replace(/[^a-zA-Z\s]/g, '');
    value = value.toUpperCase();

    const blockedWords = this.junkValueString.map((item: any) =>
      item.jv_value.toUpperCase()
    );
    const blockedWordsRegex = new RegExp(
      `\\b(?:${blockedWords.join('|')})\\b`,
      'g'
    );

    const tokens = value.trim().split(/\s+/);
    if (tokens.length > 1) {
      value = value.replace(blockedWordsRegex, '');
      value = value.replace(/\b([A-Z])\1{2,}\b/g, '');
    }

    if (/^(?:[A-Z]\s+)+[A-Z]$/.test(value)) {
      value = '';
    }
    if (/^(?:[A-Z]\s+)([A-Z])\1{1,}$/.test(value)) {
      value = '';
    }
    if (/^([A-Z])\1{2,}$/.test(value)) {
      value = '';
    }
    if (blockedWordsRegex.test(value)) {
      value = '';
    }
    value = value.replace(/\s{2,}/g, ' ').trim();
    // this.isDisabledLoginBtn = !value || value.length < 3;
    event.target.value = value;
    this.sendOtp.fullname = value;
    this.panFullNameReqSpace = value.length === 0;
    this.updateDisplayedName(event);
    this.validateFormFields();
  }

  onKeyPress(event: KeyboardEvent): void {
    const char = event.key;
    const regExp = /^[a-zA-Z\s]*$/;

    if (!regExp.test(char)) {
      event.preventDefault();
    }
  }

  updateDisplayedName(value: any): void {
    if (typeof value !== 'string') {
      return;
    }
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.panFullNameReqSpecial = specialCharRegex.test(trimmedValue);
    this.panFullNameReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);

    const isValid =
      trimmedValue.length > 2 &&
      !this.panFullNameReqSpecial &&
      !this.panFullNameReqDigit &&
      !containsEmoji;

    if (isValid) {
      this.sendOtp.fullname = trimmedValue.toUpperCase();
      this.panFullNameReqSpace = false;
    } else {
      this.panFullNameReqSpace = true;
    }

    this.validateFormFields();
  }

  checkAtSymbolCount(inputString: string): number {
    return (inputString.match(/@/g) || []).length;
  }

  validateFormFields(): void {
    const isFullNameValid =
      this.sendOtp.fullname &&
      this.sendOtp.fullname.trim().length > 2 &&
      !this.panFullNameReqSpecial &&
      !this.panFullNameReqDigit &&
      !/[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu.test(
        this.sendOtp.fullname
      );

    const isMobileValid =
      this.sendOtp.mobile &&
      this.sendOtp.mobile.length === 10 &&
      ['6', '7', '8', '9'].includes(this.sendOtp.mobile.charAt(0));

    this.isDisabledLoginBtn = !(isFullNameValid && isMobileValid);

    // window.localStorage.clear();
    // window.sessionStorage.clear();
  }

  validateEmail() {
    var symbcount = this.checkAtSymbolCount(this.sendOtp.email);

    if (symbcount > 1) {
      this.emailmultiplesymb = true;

      this.isEmailDisableBtn = this.emailmultiplesymb;
    } else {
      this.emailmultiplesymb = false;

      this.isEmailDisableBtn = false;
    }

    this.emailReq = this.sendOtp.email.length === 0;

    this.emailFormatVal =
      !this.emailReq && !this.isEmailValid(this.sendOtp.email);

    this.emailspecialchars = this.checkEmailSecialchars(this.sendOtp.email);

    this.sbiemailFormatVal = this.sendOtp.email.includes('sbi.co.in');

    this.isEmailDisableBtn =
      this.emailReq ||
      this.emailFormatVal ||
      this.sbiemailFormatVal ||
      this.emailmultiplesymb ||
      this.emailspecialchars;
  }

  focusOutFunction() {
    this.validateEmail();
  }

  checkEmailSecialchars(email: string): boolean {
    const invalidCharsRegex = /[^a-z0-9_.@]/i;
    const isValidFormat = invalidCharsRegex.test(email);
    return isValidFormat;
  }

  isEmailValid(email: string): boolean {
    const emailRegex =
      /^[a-z](?!.*[_.]{2})[a-z0-9_.]*@[a-z0-9-]+(\.[a-z]{2,})+$/i;
    const isValidFormat = emailRegex.test(email);
    const isExcludedDomain = email.endsWith('@sbi.co.in');
    return isValidFormat && !isExcludedDomain;
  }

  checkIfAllOTPMobileFilled() {
    const isComplete = this.otpFieldMobile?.length === 6;
    this.isMobileVerifyBtn = !isComplete;

    if (isComplete) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    } else {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    }
  }

  checkIfAllOTPEmailFilled() {
    const isComplete = this.otpFieldEmail?.length === 6;
    this.isValidEmailBtn = !isComplete;

    if (isComplete) {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    } else {
      this.isWrongOTP = false;
      this.isRightOTP = false;
    }
  }

  initGoogleSignIn() {
    try {
      google.accounts.id.initialize({
        client_id:
          '652145000458-ebpj0tfffq6e2lolfl3ei5fu11mhr831.apps.googleusercontent.com',
        context: 'use',
        use_fedcm_for_prompt: true,
        callback: this.handleGoogleResponse.bind(this),
        cancel_on_tap_outside: false,
        prompt_paraent_id: 'one-tap-container',
        auto_select: false,
        itp_support: true,
      });
    } catch (error) {
      //console.log('Google Error: ', error);
    }
  }

  delete_cookie(name: string) {
    document.cookie =
      name + '=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
  }

  signInWithGoogle(): void {
    this.spinner.show();

    google.accounts.id.cancel();

    // this.chCookie.set('g_state', '{"i_p":1725374488233,"i_l":2}', {
    //   path: '/',
    //   expires: new Date(0),
    // });

    this.chCookie.delete('g_state');

    this.chCookie.delete('g_state', '//');

    this.googleprompt =
      this.googleprompt ?? window.sessionStorage.getItem('Reason');

    if (this.googleprompt === '' || this.googleprompt === null) {
      this.initGoogleSignIn();

      google.accounts.id.prompt((notification: any) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
          //console.log('Prompt Not Dispayed', notification);

          let reason = 'Unknown reason';

          if (notification.isNotDisplayed()) {
            reason = notification.getNotDisplayedReason
              ? notification.getNotDisplayedReason()
              : 'Prompt Not Displayed';
          } else if (notification.isSkippedMoment()) {
            reason = notification.getSkippedMomentReason
              ? notification.getSkippedMomentReason()
              : 'Prompt Skipped';
          }

          //console.log('Reason: ', reason);

          window.sessionStorage.setItem('GoogleError', reason);
          this.googleprompt = reason;

          this.Googleoath = false;

          this.zone.run(() => {
            this.CheckGoogleoath();
          });
        }
      });

      setTimeout(() => {
        this.spinner.hide();
      }, 2500);
    } else {
      this.spinner.show();

      //window.location.href = "https://localhost:44326/GoogleSignIn.aspx?clientcode=" + window.sessionStorage.getItem("FormNumber");

      this.googlebtn = true;

      window.location.href =
        'https://diy.sbisecurities.in/GoogleAuthentication/GoogleSignIn.aspx?clientcode=' +
        window.sessionStorage.getItem('FormNumber');

      // window.location.href =
      //   'https://udn.sbisecurities.in/GoogleAuthentication/GoogleSignIn.aspx?clientcode=' +
      //   window.sessionStorage.getItem('FormNumber');
    }
  }

  CheckGoogleoath() {
    if (this.Googleoath != true) {
      this.toastr.warning(
        'Please provide permission to fetch your data from Google or please enter Email ID manually',
        'Warning',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        }
      );
    } else {
      this.Googleoath = true;
    }

    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  panNoValidation(event: Event): void {
    let input = (event.target as HTMLInputElement).value;
    input = input.replace(/[^A-Za-z0-9X]/g, '');
    input = input.slice(0, 10);
    const formattedInput = input.replace(/^(.{5})(.{4})(.)$/, '$1$2$3');
    (event.target as HTMLInputElement).value = formattedInput.toUpperCase();
  }

  getNumericTimestamp(): string {
    const now = new Date();
    return (
      now.getFullYear().toString() +
      (now.getMonth() + 1).toString().padStart(2, '0') +
      now.getDate().toString().padStart(2, '0') +
      now.getHours().toString().padStart(2, '0') +
      now.getMinutes().toString().padStart(2, '0') +
      now.getSeconds().toString().padStart(2, '0') +
      now.getMilliseconds().toString().padStart(3, '0')
    );
  }

  getMobileOtp(isRetry: boolean) {
    window.localStorage.clear();
    window.sessionStorage.clear();

    window.sessionStorage.setItem('UTMSOURCE', this.utm_source);
    window.sessionStorage.setItem('UTMMEDIUM', this.utm_medium);
    window.sessionStorage.setItem('UTMCAMP', this.utm_campaign);

    this.clientid = '';

    this.MoengageService.MoeInit();

    this.spinner.show();

    this.clearTimer();
    this.clearMobileOTPFields();

    if (this.sendOtp.mobile.length == 0) {
      this.mobileReq = true;
      return;
    } else if (this.sendOtp.mobile == null || this.sendOtp.mobile == '') {
      this.mobileDigitReq = false;
      this.mobileReq = true;
      return;
    } else if (this.sendOtp.mobile.length < 10) {
      this.mobileDigitReq = true;
      this.mobileReq = false;
      return;
    } else {
      this.mobileReq = false;
    }
    const reqData = {
      Flag: 'InsertOtpMobile',
      name_submitted: this.sendOtp.fullname,
      mobileno: this.sendOtp.mobile,
      emailid: this.sendOtp.email,
      isRetry: isRetry,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };

    window.sessionStorage.setItem('mobile', reqData.mobileno);
    window.sessionStorage.setItem('NameSubmitted', reqData.name_submitted);

    this._http
      .postRequest('api/v1/oauth/service/otp/send', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
        }
        this.mobileOTPResponse = response;
        this.spinner.hide();
        this.startTimerMobile();
        this.timeroff = true;
        if (resp.body.status == true) {
          setTimeout(() => {
            this.router.navigate(['/mobile-home-otp']);
            this.spinner.hide();
          }, 200);
          this.mobileReq = false;
          this.mobileDigitReq = false;
        } else if (resp.body.status == false) {
          if (response.message == 'Internal server error') {
            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.spinner.hide();
          } else if (
            response.message ===
            'Your Mobile OTP request limit is exhausted, please retry to log in after 15 minutes'
          ) {
            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });
            this.spinner.hide();
          } else {
            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });
            this.clearMobileOTPFields();
          }
        }
      });
  }

  trackApplicationWindow() {
    const timelineStatus = document.getElementById('tracktimeline');
    if (timelineStatus) {
      $('#tracktimeline').modal('show');
    } else {
      this.removeModal();
    }
  }

  dismissTimeLineModal() {
    const timelineModal = document.getElementById('tracktimeline2');
    const mobileModal = document.getElementById('mobileotp');
    if (timelineModal && mobileModal) {
      $('#tracktimeline2').modal('hide');
      $('#mobileotp').modal('hide');
      //   timelineModal?.classList.remove('show');
      //   timelineModal?.classList.add('d-none');
      //   mobileModal?.classList.remove('show');
      //   mobileModal?.classList.add('d-none');
    } else {
    }
  }

  dismissTrackApplicationModal() {
    const completeTrackApplication = document.getElementById('tracktimeline');
    if (completeTrackApplication) {
      // completeTrackApplication.classList.remove('show');
      $('#tracktimeline').modal('hide');
    }
    this.clearMobileOTPFields();
  }

  trackApplicationWindow2() {
    const timelineStatus = document.getElementById('tracktimeline2');
    if (timelineStatus) {
      // const myTimeLineModal = new bootstrap.Modal(timelineStatus);
      // myTimeLineModal.show();
      $('#tracktimeline2').modal('show');
    } else {
      this.removeModal();
    }
  }

  dismissTrackApplicationModal2() {
    const completeTrackApplication = document.getElementById('tracktimeline2');
    if (completeTrackApplication) {
      // completeTrackApplication.classList.remove('show');
      $('#tracktimeline2').modal('hide');
    }
    this.clearMobileOTPFields();
  }

  dismissEmailOtp() {
    const dismissEmailOtpModal = document.getElementById('emailotp');
    if (dismissEmailOtpModal) {
      // dismissEmailOtpModal.classList.remove('show');
      $('#tracktimeline2').modal('hide');
    }
    this.clearEmailOTPFields();
  }

  editEmail() {
    const emailModalOtpModal = document.getElementById('emailotp');
    if (emailModalOtpModal) {
      this.clearTimer();
      // emailModalOtpModal.classList.remove('show');
      // emailModalOtpModal.classList.add('d-none');
      $('#emailotp').modal('hide');

      this.removeModal();
      this.dismissEmailOtp();
      this.emailWindowBox();
    } else {
      this.dismissEmailOtp();
      this.clearEmailOTPFields();
      this.removeModal();
    }
  }

  emailWindowBox() {
    const panConfirmationDone = document.getElementById('email2faotp');
    if (panConfirmationDone) {
      // const myModal = new bootstrap.Modal(panConfirmationDone);
      // myModal.show();
      // this.getEmailOtp(false);
      $('#email2faotp').modal('show');
    } else {
      this.removeModal();
    }
  }

  clearEmailOtpModal() {
    $('#emailotp').modal('hide');
    $('#email2faotp').modal('hide');
    $('#mobileotp').modal('hide');
  }

  getEmailOtp(isRetry: boolean) {
    this.spinner.show();

    const emailModalOtpModal = document.getElementById(
      'emailotp'
    ) as HTMLElement;
    if (emailModalOtpModal) {
      $('#emailotp').modal('show');
      $('#email2faotp').modal('hide');
    }

    this.clearTimer();
    this.clearEmailOTPFields();
    if (this.emailReq || this.emailFormatVal) {
      return;
    }
    this.isEmailDisableBtn = false;
    this.emailReq = false;
    this.isWrongOTP = false;
    this.isRightOTP = false;
    const reqData = {
      Flag: 'InsertOtpEmail',
      emailid: this.sendOtp.email,
      mobileno: this.sendOtp.mobile,
      isRetry: isRetry,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      Formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    window.sessionStorage.setItem('email', reqData.emailid);
    this._http
      .postRequest('api/v1/oauth/service/otp/send', reqData)
      .subscribe((resp) => {
        this.spinner.hide();
        let response: any = resp.body;

        if (response.status === true) {
          const emailModal = document.getElementById('email2faotp');
          if (emailModal) {
            this.clearTimer();
            // emailModal.classList.remove('show');
            $('#email2faotp').modal('hide');
            this.clearEmailOTPFields();
          }
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.MoengageService.trackEvent('Email OTP Sent', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Email OTP',
            EmailID: this.sendOtp.email,
          });

          this.MoengageService.setUserAttributes(
            window.sessionStorage.getItem('FormNumber') ?? '',
            window.sessionStorage.getItem('mobile') ?? '',
            this.sendOtp.email,
            '',
            ''
          );
        }

        this.emailOTPResponse = response;
        this.startTimerEmail();
        this.timeroff1 = true;
        if (resp.body.status === true) {
          this.removeModal();
          // const myModal = new bootstrap.Modal(
          //   document.getElementById('emailotp')!
          // );
          // myModal.show();
          $('#emailotp').modal('show');
          $('#email2faotp').modal('hide');

        } else if (resp.body.status === false) {
          this.MoengageService.trackEvent('Email OTP Sent Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Email OTP',
            EmailID: this.sendOtp.email,
            ErrorMsg: response.message,
          });

          if (response.message === 'Internal server error') {
            const emailModalOtpModal = document.getElementById(
              'emailotp'
            ) as HTMLElement;
            if (emailModalOtpModal) {
              $('#email2faotp').modal('show');
              $('#emailotp').modal('hide');
            }
            // emailModalOtpModal.classList.add('d-none');
            // emailModalOtpModal.classList.remove('d-block');

            this.toastr.error('Internal Server Error!', 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            this.spinner.hide();
          } else if (
            response.message ===
            'Your Email OTP request limit is exhausted, please retry to log in after 15 minutes'
          ) {
            const emailModalOtpModal = document.getElementById(
              'emailotp'
            ) as HTMLElement;
            if (emailModalOtpModal) {
              $('#email2faotp').modal('show');
              $('#emailotp').modal('hide');
            }
            // emailModalOtpModal.classList.add('d-none');
            // emailModalOtpModal.classList.remove('d-block');

            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });
            this.spinner.hide();
          } else {
            const emailModalOtpModal = document.getElementById(
              'emailotp'
            ) as HTMLElement;
            if (emailModalOtpModal) {
              $('#email2faotp').modal('show');
              $('#emailotp').modal('hide');
            }

            // emailModalOtpModal.classList.add('d-none');
            // emailModalOtpModal.classList.remove('d-block');
            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            });

            this.clearEmailOTPFields();
          }
        }
      });
  }

  responsePayload: any = null;

  handleGoogleResponse(response: any) {
    try {
      if (response.credential) {
        this.responsePayload = this.decodeJwtResponse(response.credential);
        if (this.responsePayload.email_verified == true) {
          this.getEmailOtpVerify(false);
        }
      } else {
      }
    } catch (error) {
      this.MoengageService.trackEvent('Google Authentication Error', {
        product_id: window.sessionStorage.getItem('FormNumber') ?? '',
        product_name: 'Onboarding DIY',
        category: 'Google Authentication',
        EmailID: this.responsePayload.email,
        ErrorMsg: error,
      });
    }
  }

  decodeJwtResponse(token: string) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  getEmailOtpVerify(isRetry: boolean) {
    if (this.responsePayload != null) {
      $('#emailotp').modal('hide');
      $('#email2faotp').modal('hide');

      const reqData = {
        Flag: 'SaveGmail',
        emailid: this.responsePayload.email,
        emailidverified: this.responsePayload.email_verified,
        GmailProfileName: this.responsePayload.name,
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        mobileno: this.sendOtp.mobile,
        utm_source: this.utm_source,
        utm_medium: this.utm_medium,
        utm_campaign: this.utm_campaign,
      };

      this.spinner.show();
      this._http
        .postRequest('api/v1/oauth/service/otp/savegmail', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          this.spinner.hide();
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );

            this.MoengageService.trackEvent('Email Verified via Google', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              EmailID: this.responsePayload.email,
            });

            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              window.sessionStorage.getItem('mobile') ?? '',
              this.responsePayload.email,
              '',
              ''
            );

            this.isRightOTP = true;
            this.clearTimer();
            this.clearEmailOTPFields();
            this.removeModal();

            $('#emailotp').modal('hide');
            $('#email2faotp').modal('hide');

            this.removeModal();

            setTimeout(() => {
              this.router.navigate(['/uploadProcess', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            this.MoengageService.trackEvent('Google Authentication Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              EmailID: this.responsePayload.email,
              ErrorMsg: response.message,
            });

            $('#emailotp').modal('hide');

            this.emailWindowBox();
            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            this.spinner.hide();
          }
        });
    } else if (this.gmailparams.email != '' && this.otpFieldEmail != '') {
      $('#emailotp').modal('hide');
      $('#email2faotp').modal('hide');

      const reqData = {
        Flag: 'SaveGmail',
        emailid: this.gmailparams.email,
        emailidverified: this.gmailparams.email_verified,
        GmailProfileName: this.gmailparams.name,
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        mobileno: this.sendOtp.mobile,
        utm_source: this.utm_source,
        utm_medium: this.utm_medium,
        utm_campaign: this.utm_campaign,
      };

      this.spinner.show();
      this._http
        .postRequest('api/v1/oauth/service/otp/savegmail', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          this.spinner.hide();
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );

            this.MoengageService.trackEvent('Email Verified via Google', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              EmailID: this.gmailparams.email,
            });

            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              window.sessionStorage.getItem('mobile') ?? '',
              this.gmailparams.email,
              '',
              ''
            );

            this.isRightOTP = true;
            this.clearTimer();
            this.clearEmailOTPFields();

            $('#emailotp').modal('hide');
            $('#email2faotp').modal('hide');

            this.removeModal();

            setTimeout(() => {
              this.router.navigate(['/uploadProcess', 1]);
              this.spinner.hide();
            }, 200);
          } else {
            this.MoengageService.trackEvent('Google Authentication Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Google Authentication',
              EmailID: this.responsePayload.email,
              ErrorMsg: response.message,
            });

            $('#emailotp').modal('hide');

            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            this.emailWindowBox();

            this.spinner.hide();
          }
        });
    } else {
      this.isWrongOTP = false;
      this.isRightOTP = false;
      let otpFieldEmail = this.otpFieldEmail;
      if (otpFieldEmail == '') {
        this.toastr.info('Please enter the OTP', 'Info', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        this.isValidEmailBtn = true;
        return;
      }
      this.isValidEmailBtn = false;
      const reqData = {
        Flag: 'VerifyOTPEmail',
        Formnumber: window.sessionStorage.getItem('FormNumber'),
        emailid: this.sendOtp.email,
        mobileno: this.sendOtp.mobile,
        isRetry: isRetry,
        otp: otpFieldEmail,
        utm_source: this.utm_source,
        utm_medium: this.utm_medium,
        utm_campaign: this.utm_campaign,
      };
      this.spinner.show();
      this._http
        .postRequest('api/v1/oauth/service/otp/verify', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          this.spinner.hide();
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
          }
          if (
            resp.body.message == 'OTP Verify successfully' &&
            resp.body.status == true
          ) {
            this.MoengageService.trackEvent('Email Verified', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Email OTP',
              EmailID: this.sendOtp.email,
            });

            this.MoengageService.setUserAttributes(
              window.sessionStorage.getItem('FormNumber') ?? '',
              window.sessionStorage.getItem('mobile') ?? '',
              this.sendOtp.email,
              '',
              ''
            );

            const emailOtpModal = document.getElementById('emailotp');
            if (emailOtpModal) {
              this.isRightOTP = true;
              this.clearTimer();

              // $('#emailotp').modal('hide');

              // const emailModalOtpModal = document.getElementById(
              //   'emailotp'
              // ) as HTMLElement;
              // if (emailModalOtpModal) {
              //   $('#emailotp').modal('hide');
              // }

              $('#emailotp').modal('hide');
              $('#email2faotp').modal('hide');

              // emailOtpModal.classList.remove('show');
              this.clearEmailOTPFields();
              this.removeModal();
              // this.mainContent = false;
              setTimeout(() => {
                this.router.navigate(['/uploadProcess', 1]);
                this.spinner.hide();
              }, 200);
            }
          } else if (resp.body.status == false) {
            this.MoengageService.trackEvent('Email Verification Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Email OTP',
              EmailID: this.sendOtp.email,
              ErrorMsg: response.message,
            });

            if (
              response.message == 'Internal server error' &&
              response.status == 400
            ) {
              this.toastr.error(response.statusText, 'Error', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });
            } else if (response.message == 'OTP Limit Exceeded') {
              this.toastr.warning(response.message, 'Warning', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });
            } else if (response.message == 'Wrong Otp') {
              this.isWrongOTP = true;
              this.isRightOTP = false;
            } else {
              this.clearEmailOTPFields();
              this.toastr.info(response.message, 'Info', {
                positionClass: 'toast-bottom-center',
                timeOut: 2000,
              });
              this.isWrongOTP = false;
              this.isRightOTP = false;
            }

            this.spinner.hide();
          }
        });
    }
  }

  clearMobileOTPFields() {
    // this.mainContent = false;
    if (this.otpFieldMobile) {
      this.otpMobileInput.setValue('');
      this.otpFieldMobile = '';
      this.isRightOTP = false;
      this.isWrongOTP = false;
    }
    this.clearTimer();
  }

  clearEmailOTPFields() {
    if (this.otpFieldEmail) {
      this.otpEmailInput.setValue('');
      this.otpFieldEmail = '';
      this.isRightOTP = false;
      this.isWrongOTP = false;
    }
    this.clearTimer();
  }

  getGoogleEmailVerify() {
    if (this.sendOtp.email.includes('@gmail.com')) {
      //console.log('Gmail');
      return;
    } else if (!this.sendOtp.email.includes('@gmail.com')) {
      this.getEmailOtp(false);
    }
  }

  // clearEmailOtpModal() {
  //   const emailModalOtpModal = document.getElementById(
  //     'emailotp'
  //   ) as HTMLElement;
  //   const emailIDModal = document.getElementById('email2faotp') as HTMLElement;
  //   const mobileOtpModal = document.getElementById('mobileotp') as HTMLElement;

  //   mobileOtpModal.classList.add('d-none');
  //   mobileOtpModal.classList.remove('d-block');
  //   emailIDModal.classList.add('d-none');
  //   emailIDModal.classList.remove('d-block');
  //   emailModalOtpModal.classList.add('d-none');
  //   emailModalOtpModal.classList.remove('d-block');
  // }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
        $('#mobileotp').modal('hide');
        // $('#emailotp').modal('hide');
        $('#email2faotp').modal('hide');
        $('#termsandcond').modal('hide');
        $('#tracktimeline2').modal('hide');
      }
    });
  }

  goToTop() {
    window.scrollTo(0, 0);
  }

  addFaqStructuredData(): void {
    console.log('FAQ');
    const script = this.renderer.createElement('script');

    script.type = 'application/ld+json';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'How does a Demat account work?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Imagine your Demat account as a secure digital locker for your investments, like stocks and bonds. Instead of physical certificates, these investments are stored electronically. When you buy or sell stocks, it is like moving them in or out of this digital locker. Your Demat account keeps track of all these transactions, making it convenient and efficient to manage your investments in the stock market without dealing with paperwork or physical documents.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why do you need a Demat account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To hold electronic securities e.g., shares, bonds, mutual funds, IPOs, etc., in electronic format, you require a Demat account.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I invest without Demat?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'SEBI regulations do not permit you to trade equities without a demat account, be it intraday or delivery. Similarly, index ETFs and other ETFs also mandatorily need a demat account for holding them.',
          },
        },

        {
          '@type': 'Question',
          name: 'Do I Need Demat Account to Invest in IPO?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'If you want to invest in any IPO, then having a demat account is mandatory. IPO shares are only allotted in demat form. In fact, if you do not have an active demat account then your IPO application itself is not valid.',
          },
        },
        {
          '@type': 'Question',
          name: 'What Is the Difference Between a Demat and a Trading Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A trading account is used to execute buy/sell transactions, while a demat account is used to hold securities in electronic form. Trading accounts handle the flow of transactions, whereas demat accounts store the stock holdings. For example, futures and options can be traded with just a trading account, but equities and IPOs require a demat account. Settlement in a trading account involves cash movement, while in a demat account it involves security movement.',
          },
        },
        {
          '@type': 'Question',
          name: 'What Are the Types of Demat Accounts?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There are two types of demat accounts – Individual and Non-Individual. For individuals, accounts are classified based on residency: Resident Indian accounts, Repatriable and Non-Repatriable accounts for NRIs. BSDA accounts are for small investors with holdings under ₹4 lakhs. Regular accounts have no upper limit. Repatriable accounts allow fund transfer abroad and are linked to NRE accounts. Non-repatriable accounts are linked to NRO accounts and do not allow fund transfer abroad.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are Some Common Terms of Demat Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Common terms include: Dematerialization (converting physical shares to electronic form), Depository (NSDL/CDSL), Depository Participant (DP), Lien (pledged shares), Freeze (temporary or court-ordered block), Transmission (transfer to legal heir), Transposition (changing joint holder order), and Closure (closing account after transferring or selling all holdings).',
          },
        },
        {
          '@type': 'Question',
          name: 'How to Open Demat Account Online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'To open demat account online, you must complete the online application form and submit it with details pertaining to proof of identity, proof of address, bank account details, PAN card details etc. In the digilocker screen, enter your aadhaar number, OTP and 6-digit digilocker pin to allow the system to fetch your aadhaar card from digilocker. Once your documents are submitted and accepted as valid, your E-KYC (electronic know your client) process is completed. E-KYC verifies your information electronically. The last step before esign, is to allow camera access to capture a live photograph for an in-person verification (IPV). The whole process takes less than 5 minutes.',
          },
        },
        {
          '@type': 'Question',
          name: 'How long does it take to open and fully activate the Demat & Trading account with SBI Securities?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The entire process for digitally opening your Demat account takes less than 5 minutes for processing, and to do transactions it will take min T+2 days. Subject to regulatory approvals.',
          },
        },
        {
          '@type': 'Question',
          name: 'What documents are required to open a Demat account online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'You need PAN card, a photo, a cancelled cheque, address proof (Aadhaar, Driving Licence, Voter ID, Passport, or Government ID), and a signature image. Your mobile number and email must be linked to Aadhaar for digital signing.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is eSign?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'eSign is an online electronic signature or digital signature. In online account opening, if you have an aadhaar card linked to your mobile number, you can eSign the documents digitally through One Time Password (OTP) Authentication.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the Charges for Opening a Demat and Trading Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There are ZERO demat account opening charges when you open demat account (Suvidha Account) with SBI Securities. This is a 2-in-1 demat and trading account. While you benefit from free demat account opening, you incur DP AMC (Annual Maintenance Charge). Trading account incurs costs each time you transact in the form of brokerage, statutory charges, exchange charges, etc. Apart from the Suvidha account, which offers zero account opening charges, there are multiple plans available to cater to various individual needs. Each plan offers distinct features and benefits, allowing you to select the one that aligns best with your trading and investment goals.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is it safe to open a Demat Account Online?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, opening a Demat account online is generally safe. Make sure to choose a well-known and trusted broker, follow good password practices, and keep your login details confidential to ensure the safety of your Demat account.',
          },
        },
        {
          '@type': 'Question',
          name: 'Who is eligible to open a Demat and Trading Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'There is no minimum age to invest in the stock market, even a minor can open a Demat account. In case of minors, the demat account can be operated with the help of parents or appointed guardian and can only be opened offline. You can visit your nearest SBI Securities branch to open an account for minor.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I Open a Joint Demat Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can open a joint demat account without any demat account opening charges. A joint demat account can have up to 3 account holders. One of the account holders must be designated as the primary holder and the other two will be joint holders. Only majors can be joint holders, minors cannot hold joint accounts. Joint account can only be opened offline, by visiting your nearest SBI Securities branch.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can an NRI Open a Demat Account in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, a non-resident Indian (NRI) can open demat account in India. NRIs settled abroad can open a demat account online or offline. In India, NRIs are allowed to open repatriable demat accounts and non-repatriable demat accounts.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can a Minor Open a Demat Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A minor can open a demat account through their guardian (legal parent or court-appointed guardian). As minors are not eligible to enter into contracts, they cannot open a demat account on their own. Upon attaining majority, the minor account status is automatically deactivated and frozen, at which point the major (former minor) has to update the account, which will allow them to make all buy and sell decisions. Minors cannot be joint holders in a demat account. A demat account for minor can only be opened offline, by visiting your nearest SBI Securities branch.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is it compulsory to assign a nominee?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A nominee can be added to the Demat account even though it is not compulsory.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the Advantages of a Demat Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: ' - You do away with physical paper certificates and transfer deeds once and for all. This reduces the risks like loss of share certificates, storage risks, signature mismatch, bad delivery, duplicate certificates etc.<br /> - The entire transaction process is digital and seamless. Share transfer is reflected in T+1 days.<br /> - There is an automatic audit trail of all transactions and holdings. You can refer to & download the transaction statement and the holding statement in real-time.<br /> - Dividends are directly credited to your bank account registered with your demat account. Stock splits and bonuses are also automatically credited to the demat account with the new ISIN number.<br /> - Updating details like change in address or email or mobile number becomes quick and seamless as all you need to do is to give a single communication to the DP and it is reflected in all your holdings.<br /> - You can have a nominee or even multiple nominees with specified interest shares. Upon the holders death, the transmission is automatic and only the death certificate is required.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I transfer shares from my Demat account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'A. Yes, shares can be transferred from one Demat account to another. Here is the process of transfer in brief. Step 1 - The investor fills the Delivery Instruction Slip (DIS) and submits it to the current broker.<br /> Step 2 - The broker forwards the DIS form or request to the depository.<br /> Step 3 - The Depository will transfer your existing shares to the Demat account.<br /> Step 4 - Once the transfer of all the shares is completed, the same will be reflected in the investor’s new Demat account. Alternatively, A. You can use EASIEST (Electronic Access To Securities Information and Execution of Secured Transaction) facility for CDSL or the SPEED-e facility for NSDL. B. You can also go for DDPI option:  Transfer of securities held in the beneficial owner accounts of the client towards Stock Exchange related deliveries / settlement obligations arising out of trades executed by clients on the Stock Exchange through the same stock broker.  Pledging / re-pledging of securities in favour of trading member (TM) /clearing member (CM) for the purpose of meeting margin requirements of the clients in connection with the trades executed by the clients on the Stock Exchange. Mutual Fund transactions being executed on Stock Exchange order entry platforms. Tendering shares in open offers through Stock Exchange platforms.',
          },
        },
        {
          '@type': 'Question',
          name: 'Can I Transfer Shares from CDSL Demat Account to NSDL Demat Account?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes, you can transfer shares from your CDSL demat account to your NSDL demat account. The only condition here is that the particular stocks that you want to transfer, must be eligible for demat on both NSDL and CDSL.',
          },
        },
      ],
    });
    this.renderer.appendChild(this.document.head, script);
  }
}
