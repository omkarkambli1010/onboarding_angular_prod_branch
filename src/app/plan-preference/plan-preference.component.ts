import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
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
import { ExtensionService } from '../extension.service';
import { Carousel } from 'primeng/carousel';
import { MoengagesdkService } from '../moengagesdk.service';
declare let $: any;

@Component({
  selector: 'app-plan-preference',
  templateUrl: './plan-preference.component.html',
  styleUrls: ['./plan-preference.component.css'],
})
export class PlanPreferenceComponent implements OnInit {
  @ViewChild('carousel') carousel: Carousel | any;

  showCarousel = false;
  carouselPage = 0;
  selectedPlans: { dpflag: string }[] = [];

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  emaildeclaration: any;
  mobiledeclaration: any;
  personalFormNumber: any;

  planPreferenceDeclaration: any;
  selectedSegmentPreference: any;

  PersonalResponse: any;
  questionnaireResponse: any;
  questionnaireResponse1: any;

  // questions:any;
  answers: any[] = [];
  questions: any[] = [];

  planSelectionResponse: any;
  segmentPreferenceResponse: any;
  riskDisclosureModalData: any;
  riskDisclosureData: any;
  termsConditionData: any;
  taxPayerData: any;
  politicalExposedData: any;

  lifecycleDays: any = [
    {
      Days: 'Daily',
      description: 'Daily',
    },
    {
      Days: '30 Days',
      description: 'on or before 1st Friday of every month',
    },
    {
      Days: '90 Days',
      description:
        'on or before 1st Friday of every quarter (Jan, Apr, Jul, Oct)',
    },
  ];
  selectedOption = this.lifecycleDays[0];

  selectedSegment: any;
  isIndianCitizen = false;
  ispep = false;
  istradingPref = false;
  issettledfunds = false;
  istermsandcond = false;
  allCheckboxesSelected = false;
  allCheckboxesProceed = false;
  selectedCheckboxes: string[] = [];

  // Image Cropper
  imageChangedEvent: any = '';
  croppedImage: any = '';
  canvasRotation = 0;
  rotation?: number;
  translateH = 0;
  translateV = 0;
  scale = 1;
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
  clientid: any;

  selectedPlan: any;
  trdSegments: any;
  PaymentResponse: any;
  file: any;

  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  questionID: any;
  selectedPlanID: any;
  selectedPlanTag: any;
  selectedCharges: any;
  saveSchemeSegment: any;
  BankPrefix: any;
  selectedPlanScheme: any;
  selectedRadioPlanScheme: any;

  RiskDisclosure: any;
  selectedDocument: string = ''; // Property to store selected document ID
  BankStatement: any;
  planSelectedID: any;

  documents = [
    { id: 'bankStatemntSixMonths', label: 'Bank Statement (last 6 months)' },
    { id: 'copyofITRAcknowledge', label: 'Copy of ITR Acknowledgement' },
    { id: 'copyofFormSixteen', label: 'Copy of Form 16' },
    { id: 'netWorthCertificate', label: 'Networth Certificate' },
    {
      id: 'copyofDematHoldingAcc',
      label: 'Copy of Demat Account Holding Statement',
    },
    { id: 'copyofAnnualAcc', label: 'Copy of Annual Accounts' },
  ];

  selectedDocumentLabel: any;
  selectedDocumentID: any;
  atomGetResponse: any;
  PaymentStatus: any = '';
  bankStatementImg: any;
  selectedPreferenceDays: any;
  trdSegmentsID: any;
  trdSegmentsName: any;
  responsiveOptions: any[] | undefined;
  SchemeTenure: any;
  selectedplanname: any;

  basicPlan: any;
  proZeroPlan: any;
  platinumPlan: any;
  sslEmpPlan: any;
  utmSourcePlanPreference: any;
  isWomenCheck: any;

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
    private fileExtension: ExtensionService,
    private MoengageService: MoengagesdkService,
  ) {}

  ngOnInit(): void {
    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Plan Preference of the customer.',
    });

    this.getPersonalDataTwo();

    this.clientid = sessionStorage.getItem('clientid') ?? '';

    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.selectedPlanScheme = sessionStorage.getItem('selectedPlanScheme');
    this.RiskDisclosure = 'No';
    this.BankStatement = 'No';

    //sessionStorage.setItem('RiskDisclosure', 'No');
    //sessionStorage.setItem('BankStatement', 'No');

    this.getPlanProcess();
    this.getSelectedOptionDays();
    this.selectedPreferenceDays = 'Daily';

    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('response')) {
      this.fetchAtomPaymentResponse();
    }

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
        this.utmSourcePlanPreference = utmSourceURL;
      } else {
        this.utmSourcePlanPreference =
          sessionStorage.getItem('UTMSOURCE') || '';
      }
    });
  }

  getPersonalDataTwo() {
    this.spinner.show();
    var reqData = {
      flag: 'PLANSEGMENT',
      // formnumber: window.sessionStorage.getItem('FormNumber'),
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );

          if (resp.body.message === 'Data found') {
            this.selectedPlanTag = response[0].PlanID;
            console.log('this.selectedPlan', this.selectedPlanTag);
          }
        }
      });
  }

  updateSelectedDocumentLabel(label: string, id: string) {
    this.selectedDocumentLabel = label;
    this.selectedDocumentID = id;
  }

  getSelectedOptionDays() {
    const savedOption = this.selectedPreferenceDays;

    if (savedOption) {
      this.selectedOption = { Days: savedOption };
      this.cdRef.detectChanges();
    } else {
      this.selectedOption = this.lifecycleDays[0];
    }
  }

  selectOption(option: any) {
    this.selectedOption = option;
    this.selectedPreferenceDays = option.Days;
  }

  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  getPlanProcess() {
    this.spinner.show();
    setTimeout(() => {
      var reqData = {
        flag: 'all',
        // FormNumber: window.sessionStorage.getItem('FormNumber'),
        FormNumber: window.sessionStorage.getItem('FormNumber'),
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
                this.clientid,
              ),
            );
          }
          this.PersonalResponse = response;
          //console.log('this.PersonalResponse', this.PersonalResponse);
          this.planSelectionResponse = this.PersonalResponse.data16;
          console.log('POK', this.planSelectionResponse);

          this.isWomenCheck = Array.isArray(this.planSelectionResponse)
            ? this.planSelectionResponse[0]?.IsWoman === 'Y'
            : this.planSelectionResponse?.IsWoman === 'Y';

          console.log('this.isWomenCheck', this.isWomenCheck);

          if (window.innerWidth <= 768) {
            let index = this.planSelectionResponse.findIndex(
              (plan: { PlanID: number }) => plan.PlanID == this.selectedPlanTag,
            );
            // console.log('SelectedPlanTag index:', index);
            if (index === -1) {
              index = this.planSelectionResponse.findIndex(
                (plan: { TCSSchemeCode: any }) =>
                  plan.TCSSchemeCode == 'AOS14DIY99',
              );
            }
            if (index !== -1) {
              this.carouselPage = index;
            }
          }
          this.segmentPreferenceResponse = this.PersonalResponse.data6;
          this.riskDisclosureModalData = this.PersonalResponse.data17;
        });
    }, 100);
  }

  openModal(planID: number): void {
    this.selectedPlan = planID;
    setTimeout(() => {
      $(`#knowMoreModal${planID}`).modal('show');
      this.selectedPlan = null;
    }, 0);
  }

  closeModal() {
    if (this.selectedPlan !== null) {
      $(`#knowMoreModal${this.selectedPlan}`).modal('hide');
      this.selectedPlan = null;
    }
  }

  selectPlanID(planId: string | number): void {
    this.selectedPlan = planId;
    setTimeout(() => {
      this.selectedPlan = null;
    }, 0);
  }

  showPlanDetails(plans: any, event: Event): void {
    event.stopPropagation();
    this.selectedPlan = plans;
  }

  isSelected(plan: any): boolean {
    return this.selectedRadioPlanScheme?.SCHEMECODE === plan.SCHEMECODE;
  }

  isRadioSelected(plan: any): boolean {
    return this.selectedPlan?.SCHEMECODE === plan.SCHEMECODE;
  }

  selectPlan(plan: any): void {
    this.selectedPlan = plan;
    this.selectedRadioPlanScheme = plan.TCSSchemeCode;
    this.selectedPlanID = plan.PlanID;
    this.selectedCharges = plan.SchemeCharges;
    this.selectedplanname = plan.schemeType;
    this.SchemeTenure = plan.SchemeTenure;

    window.sessionStorage.setItem(
      'selectedPlanScheme',
      this.selectedRadioPlanScheme,
    );
    window.sessionStorage.setItem('selectedPlanID', this.selectedPlanID);
    window.sessionStorage.setItem('selectedCharges', this.selectedCharges);
  }

  ViewPDF() {
    const newTab = window.open(
      'https://diy.sbisecurities.in/kycDocument/Documents/DPTariff.pdf',
      '_blank'
    );
    // const newTab = window.open(
    //   'https://udn.sbisecurities.in/kycDocument/Documents/DPTariff.pdf',
    //   '_blank'
    // );
    if (newTab) {
      try {
        newTab.opener = null;
      } catch (e) {
        console.error('Some issue occured ', e);
      }
    }
  }

  accountNumeric(event: Event) {
    let input = event.target as HTMLInputElement;
    input.value = input.value.replace(/\D/g, '');
  }

  accountIfsc(event: Event) {
    let input = event.target as HTMLInputElement;
    input.value = input.value.trim().toUpperCase();
    input.value = input.value.replace(/[^A-Z0-9]/g, '');
  }

  savePlanScheme(id: any) {
    this.planSelectedID = id;
    console.log('this.planSelectedID', this.planSelectedID);

    this.spinner.show();

    const reqData = {
      flag: 'planselection',
      PlanID: this.planSelectedID,
      // FormNumber: window.sessionStorage.getItem('FormNumber'),
      FormNumber: window.sessionStorage.getItem('FormNumber'),
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };
    this._http
      .postRequest('api/v1/schemeSegmentDetail/save', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        console.log('this.saveSchemeSegment', response);
        if (response.status == true) {
          const response = JSON.parse(
            this.aesService.decrypt(
              resp.body.data,
              this.clientid,
              this.clientid,
            ),
          );
          console.log('this.saveSchemeSegment', response);
          this.saveSchemeSegment = response;

          // if (this.selectedCharges > 0 && this.BankPrefix != 'SBIN') {
          if (
            this.saveSchemeSegment[0].status == 'Success' &&
            this.saveSchemeSegment[0].PaymentStatus == 'PaymentRequired'
          ) {
            this.MoengageService.trackEvent('Plan Selection', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Plan_Selected: this.selectedplanname + ' ' + this.planSelectedID,
              Plan_Charge: this.selectedCharges,
              Plan_SchemeCode: this.selectedRadioPlanScheme,
              Plan_Validity: this.SchemeTenure,
              Response: JSON.stringify(this.saveSchemeSegment),
              product_name: 'Onboarding DIY',
              category: 'Plan Process',
            });

            this.getpaymentlink();
          } else if (
            this.saveSchemeSegment[0].status == 'Success' &&
            this.saveSchemeSegment[0].PaymentStatus == 'PaymentNotRequired'
          ) {
            //this.spinner.show();

            this.MoengageService.trackEvent('Plan Selection', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Plan_Selected: this.selectedplanname + ' ' + this.planSelectedID,
              Plan_Charge: this.selectedCharges,
              Plan_SchemeCode: this.selectedRadioPlanScheme,
              Plan_Validity: this.SchemeTenure,
              Response: JSON.stringify(this.saveSchemeSegment),
              product_name: 'Onboarding DIY',
              category: 'Plan Process',
            });

            if (this.RejectStatus != 'R') {
              setTimeout(() => {
                this.router.navigate(['/planprocess', 3]);
                this.spinner.hide();
              }, 200);
            } else {
              setTimeout(() => {
                this.navService.navigateToNextStep();
                // this.spinner.hide();
              }, 200);
            }
          }
          if (this.saveSchemeSegment[0].status == 'Failed') {
            this.MoengageService.trackEvent('Plan Selection Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Plan_Selected: this.planSelectedID,
              Plan_Charge: this.selectedCharges,
              Plan_SchemeCode: this.selectedRadioPlanScheme,
              Plan_Validity: this.SchemeTenure,
              ErrorMsg: this.saveSchemeSegment[0].Msg,
              Response: JSON.stringify(this.saveSchemeSegment),
              product_name: 'Onboarding DIY',
              category: 'Plan Process',
            });

            this.toastr.warning(this.saveSchemeSegment[0].Msg, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.spinner.hide();
          }
          if (this.saveSchemeSegment[0].status == 'PaymentDone') {
            // this.toastr.success(this.saveSchemeSegment[0].Msg, '', {
            //   positionClass: 'toast-bottom-center',
            //   timeOut: 4000,
            // });

            this.MoengageService.trackEvent('Plan Selection', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Plan_Selected: this.planSelectedID,
              Plan_Charge: this.selectedCharges,
              Plan_SchemeCode: this.selectedRadioPlanScheme,
              Plan_Validity: this.SchemeTenure,
              Response: JSON.stringify(this.saveSchemeSegment),
              product_name: 'Onboarding DIY',
              category: 'Plan Process',
            });

            if (this.RejectStatus != 'R') {
              setTimeout(() => {
                this.router.navigate(['/planprocess', 3]);
                this.spinner.hide();
              }, 200);
            } else {
              setTimeout(() => {
                this.navService.navigateToNextStep();
                //this.spinner.hide();
              }, 200);
            }
          }
        } else {
          this.MoengageService.trackEvent('Plan Selection Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Plan_Selected: this.planSelectedID,
            Plan_Charge: this.selectedCharges,
            Plan_SchemeCode: this.selectedRadioPlanScheme,
            Plan_Validity: this.SchemeTenure,
            ErrorMsg: response.message,
            Response: JSON.stringify(this.saveSchemeSegment),
            product_name: 'Onboarding DIY',
            category: 'Plan Process',
          });

          this.toastr.warning(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });

          this.spinner.hide();
        }
      });
  }

  getpaymentStatus() {
    this.spinner.show();
    setTimeout(() => {
      var reqData = {
        // FormNumber: window.sessionStorage.getItem('FormNumber'),
        FormNumber: window.sessionStorage.getItem('FormNumber'),
      };
      this._http
        .postRequest('api/v1/payment/getpaymentStatus', reqData)
        .subscribe((resp) => {
          let response = resp.body;
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid,
              ),
            );
          } else {
            this.spinner.show();
            this.toastr.warning(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
            setTimeout(() => {
              this.router.navigate(['/planprocess', 2]);
              this.spinner.hide();
            }, 200);
          }
          this.spinner.hide();
        });
    }, 200);
  }

  getpaymentlink() {
    this.spinner.show();
    setTimeout(() => {
      var reqData = {
        // FormNumber: window.sessionStorage.getItem('FormNumber'),
        FormNumber: window.sessionStorage.getItem('FormNumber'),
      };
      this._http
        .postRequest('api/v1/payment/getpaymentlink', reqData)
        .subscribe((resp) => {
          let response = resp.body;
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid,
              ),
            );
            this.PaymentResponse = response;
            if (this.PaymentResponse) {
              window.location.href = this.PaymentResponse;

              this.MoengageService.trackEvent('Plan Payment Redirection', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                URL: this.PaymentResponse,
                product_name: 'Onboarding DIY',
                category: 'Plan Process',
              });

              this.spinner.hide();
            } else {
              this.spinner.hide();
            }
          } else {
            this.MoengageService.trackEvent('Plan Payment Redirection Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              ErrorMsg: response.message,
              product_name: 'Onboarding DIY',
              category: 'Plan Process',
            });

            this.toastr.warning(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.spinner.hide();
          }
        });
    }, 200);
  }

  saveSegment() {
    this.spinner.show();

    // this.BankPrefix = sessionStorage.getItem('selectedBankPrefix');
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
      // FormNumber: window.sessionStorage.getItem('FormNumber'),
      FormNumber: window.sessionStorage.getItem('FormNumber'),
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };

    this._http
      .postRequest('api/v1/schemeSegmentDetail/save', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        if (response.status == true) {
          const response = JSON.parse(
            this.aesService.decrypt(
              resp.body.data,
              this.clientid,
              this.clientid,
            ),
          );
          this.saveSchemeSegment = response;
          if (this.saveSchemeSegment[0].status == 'Success') {
            const modalBackdrops = document.querySelectorAll('.modal-backdrop');
            modalBackdrops.forEach((backdrop) => {
              if (backdrop instanceof HTMLElement) {
                backdrop.remove();
              }
            });

            setTimeout(() => {
              this.router.navigate(['/uploadSignature', 1]);

              this.spinner.hide();
            }, 200);
          } else {
            this.toastr.error(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.spinner.hide();
          }
        } else {
          this.toastr.warning(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });

          this.spinner.hide();
        }
      });
  }

  BackFormOne() {
    this.spinner.show();

    setTimeout(() => {
      this.router.navigate(['/planprocess', 1]);

      this.spinner.hide();
    }, 200);
  }

  handleChange(event: any, plan: any) {
    const isChecked = event.target.checked;
    const dpflag = plan.dpflag;
    if (!isChecked && dpflag !== 'Equity & Mutual Fund') {
      this.openRiskDisclosureModal();
    }
  }

  planPreferenceForm() {
    let selectedSegments = this.segmentPreferenceResponse.filter((t: any) =>
      t.selected == null ? '' : t.selected.toString() == 'true',
    );
    let trdSegments = selectedSegments.map((t: any) => t.id);
    //  sessionStorage.setItem( 'trdSegmentsID', JSON.stringify(trdSegments).slice(1, -1));
    this.trdSegmentsID = JSON.stringify(trdSegments).slice(1, -1);
    let trdID = trdSegments.filter((id: string) => id == '2');

    this.trdSegmentsName = selectedSegments
      .map((t: any) => t.trdSegment)
      .join(', ');
    let trdName = selectedSegments.filter(
      (trdSegment: string) => trdSegment == 'Equity & Mutual Fund',
    );
    if (trdID.length > 0) {
      this.openRiskDisclosureModal();
    } else {
      this.saveSegment();
    }
  }

  // redirectUploadSignaturePage() {
  //   this.spinner.show();
  //   setTimeout(() => {
  //     const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  //     modalBackdrops.forEach((backdrop) => {
  //       if (backdrop instanceof HTMLElement) {
  //         backdrop.remove();
  //       }
  //     });
  //     this.router.navigate(['/uploadSignature', 1]);
  //     this.spinner.hide();
  //   }, 200);
  // }

  openBankStatementModal() {
    const panConfirmationDone = document.getElementById('uploadBankStatement');
    if (panConfirmationDone) {
      const myModal = new bootstrap.Modal(panConfirmationDone);
      myModal.show();
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

  BackFormTwo() {
    this.spinner.show();

    if (this.PaymentStatus == 'Ok') {
      this.toastr.info('Payment Already Done', '', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });

      this.spinner.hide();
    } else {
      setTimeout(() => {
        this.router.navigate(['/planprocess', 2]);
      }, 200);

      this.spinner.hide();
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
        },
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
      },
    );
  }

  convertToBase64(file: File): Observable<string> {
    return new Observable((observer) => {
      this.readFile(file, observer);
    });
  }

  readFile(file: File, observer: Observer<string>): void {
    const filereader = new FileReader();
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

  imageCropped(event: ImageCroppedEvent) {
    const image = new Image();
    const objectUrl = event.objectUrl || event.base64 || '';

    this.loading = true;

    new Promise<void>((resolve, reject) => {
      image.onload = () => {
        this.croppedImage = this.sanitizer.bypassSecurityTrustUrl(image.src);
        this.bankStatementImg = this.croppedImage;
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

  fetchAtomPaymentResponse() {
    this.spinner.show();

    const urlParams = new URLSearchParams(window.location.search);
    const response = urlParams.get('response');
    var reqData = {
      // formNumber: window.sessionStorage.getItem('FormNumber'),
      formNumber: window.sessionStorage.getItem('FormNumber'),
      encryptedData: response,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };

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
              this.clientid,
            ),
          );
          if (response[0].status == 'Success') {
            // this.toastr.success('Payment Successful!!', '', {
            //   positionClass: 'toast-bottom-center',
            //   timeOut: 2000,
            // });
            this.spinner.hide();
            this.router.navigate([], {
              queryParams: {},
            });
          } else {
            this.spinner.show();
            setTimeout(() => {
              this.toastr.error(
                'Oops! We could not complete the transaction. Please re-initiate payment for the selected plan. In case any amount is deducted from your account, it will be refunded to source of payment within 3 working days. For more support, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 5000,
                },
              );

              this.router.navigate(['/planprocess', 2]);
              this.spinner.hide();
            }, 200);
          }
        } else {
          this.spinner.show();
          setTimeout(() => {
            this.toastr.error(response.message, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.router.navigate(['/planprocess', 1]);
            this.spinner.hide();
          }, 200);
        }
      });
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });
  }
}
