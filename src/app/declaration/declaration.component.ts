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
import { MoengagesdkService } from '../moengagesdk.service';

declare var $: any;
@Component({
  selector: 'app-declaration',
  templateUrl: './declaration.component.html',
  styleUrls: ['./declaration.component.css'],
})
export class DeclarationComponent implements OnInit {
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  clientid: any;

  planPreferenceDeclaration: any;
  selectedSegmentPreference: any;

  planSelectionResponse: any;
  segmentPreferenceResponse: any;
  riskDisclosureModalData: any;
  riskDisclosureData: any;
  termsConditionData: any;
  taxPayerData: any;
  politicalExposedData: any;

  selectedPlan: any;
  trdSegments: any;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  PersonalResponse: any;

  selectedSegment: any;
  selectAll: boolean = false;
  isIndianCitizen = false;
  ispep = false;
  istradingPref = false;
  issettledfunds = false;
  istermsandcond = false;
  allCheckboxesSelected = false;
  allCheckboxesProceed = false;
  checkFlag = false;
  selectedCheckboxes: string[] = [];
  selectedCharges: any;
  questionID: any;

  answers: any[] = [];
  questions: any[] = [];

  questionnaireResponse: any;
  questionnaireResponse1: any;
  PreferenceDeny: boolean = false;
  PreferenceSelectedDiff: boolean = false;


  //YONO CONSENT VARIABLES
  YonoData: any;
  isyono = false;
  isyonopre = false;
  yonovalue = false;
  yonoconsentvalue = 'No';
  IsYonoForm = false;

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

  // selectedOption = this.lifecycleDays[0];
  selectedOption = this.lifecycleDays[2];

  saveSchemeSegment: any;
  BankPrefix: any;

  selectedPreferenceDays: any;
  isProceedButton: boolean = true;

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
    private MoengageService: MoengagesdkService
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
    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Plan Preference of the customer.',
    });
    this.title.setTitle('Plan Preference - Onboarding-DIY-PWA');
    // this.getpaymentStatus();

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
    this.PreferenceDeny = false;
    // this.selectAll = true;
    this.getDeclarationData();
    this.getTradingPreferenceAcceptance();
    this.getPlanProcess();
    this.getSelectedOptionDays();
    this.checkAllCheckboxesSelected();
    this.selectAll = true;

    this.selectedPreferenceDays = this.selectedOption.Days;

    this.selectAllCheckboxes();
    // console.log("INIT", this.selectedPreferenceDays)

    // this.selectedPreferenceDays = 'Daily';
  }

  getPlanProcess() {
    this.spinner.show();
    setTimeout(() => {
      var reqData = {
        flag: 'all',
        formnumber: window.sessionStorage.getItem("FormNumber")
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
          }
          this.PersonalResponse = response;
          this.planSelectionResponse = this.PersonalResponse.data16;
          this.segmentPreferenceResponse = this.PersonalResponse.data6;
          this.riskDisclosureModalData = this.PersonalResponse.data17;
          this.YonoData = this.PersonalResponse.data20
          // console.log("ISYONOCUSTOMER", this.YonoData[0].IsYono)
          // console.log("ISYONOPREFILLED", this.isyonopre)
          // console.log("YONOPREFILLEDVALUE", this.yonovalue)


          //If YONO form and prefilled data does not exist
          if (this.YonoData[0].IsYono == 1 && this.isyonopre == false) {
            this.IsYonoForm = true;
            this.isyono = true;

          }
          //If YONO form and prefilled data exists and also set as yes
          else if (this.YonoData[0].IsYono == 1 && this.isyonopre == true && this.yonovalue == true) {
            this.IsYonoForm = true;
            this.isyono = true;
          }
          //If YONO form and prefilled data exists but previously unticked
          else if (this.YonoData[0].IsYono == 1 && this.isyonopre == true && this.yonovalue == false) {
            this.IsYonoForm = true;
            this.isyono = false;
          }
          //NON-YONO Flow
          else {
            this.IsYonoForm = false;
            this.isyono = false;
            this.yonoconsentvalue = 'No';

          }

          // console.log("yonoform: ", this.IsYonoForm)

          this.spinner.hide();
          this.segmentPreferenceResponse.forEach((plan: { selected: any }) => {
            if (
              plan.selected === 'Equity (NSE & BSE)' ||
              plan.selected === 'Mutual Fund'
            ) {
              plan.selected = true;
            }
          });
          for (var i = 0; i < this.riskDisclosureModalData.length; i++) {
            if (this.riskDisclosureModalData[i].Category == 'Risk disclosure') {
              this.riskDisclosureData =
                this.riskDisclosureModalData[i].Discription;
            } else if (
              this.riskDisclosureModalData[i].Category ==
              'Tax payer declaration'
            ) {
              this.taxPayerData = this.riskDisclosureModalData[i].Discription;
            } else if (
              this.riskDisclosureModalData[i].Category == 'Terms and Conditions'
            ) {
              this.termsConditionData =
                this.riskDisclosureModalData[i].Discription;
            } else if (
              this.riskDisclosureModalData[i].Category ==
              'Who is a politically exposed ot related person'
            ) {
              this.politicalExposedData =
                this.riskDisclosureModalData[i].Discription;
            }
          }
          const trdSegmentsString = sessionStorage.getItem('trdSegments');
          if (trdSegmentsString) {
            this.trdSegments = JSON.parse(trdSegmentsString);
          }
          this.planPreferenceDeclaration =
            window.sessionStorage.getItem('selectedPlan');
          this.selectedPlan = this.planPreferenceDeclaration;
        });
    }, 200);
  }

  storeSelectedValues(checkboxId: string): void {
    const checkbox = <HTMLInputElement>document.getElementById(checkboxId);
    if (checkbox.checked) {
      if (!this.selectedCheckboxes.includes(checkboxId)) {
        this.selectedCheckboxes.push(checkboxId);
      }
    } else {
      this.selectedCheckboxes = this.selectedCheckboxes.filter(
        (id) => id !== checkboxId
      );
    }
    sessionStorage.setItem(
      'selectedCheckboxes',
      JSON.stringify(this.selectedCheckboxes)
    );
    if (this.selectedCheckboxes.length == 5) {
      this.isProceedButton = false;
      this.selectAll = true;
    } else {
      this.isProceedButton = true;
      this.selectAll = false;
    }
    this.checkAllCheckboxesSelected();
  }

  getDeclarationData() {
    //console.log('getDeclarationData');

    this.spinner.show();
    var reqData = {
      flag: 'declaration',
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
            this.isIndianCitizen = response[0].ResidentInd;
            this.ispep = response[0].IsPEP;

            this.isyonopre = true;
            if (response[0].IsYonoConsent == 'Yes') {
              this.yonovalue = true
            }

            this.istradingPref = response[0].Prefernces;
            this.istermsandcond = response[0].TermsAndCondition;
            this.selectedPreferenceDays = response[0].FundcycleDays;

            if (this.selectedOption) {
              this.getSelectedOptionDays();

              this.issettledfunds = true;
            }
          }

          this.selectAll = true;
          this.allCheckboxesProceed = false;
          this.selectAllCheckboxes();
          //this.allCheckboxesProceed = true;
          //this.allCheckboxesSelected = true;
        }
      });
  }

  getTradingPreferenceAcceptance() {
    const reqData = {
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/tradeprefrence/gettradeprefrence', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        if (response.status === true) {
          const decryptedData = this.aesService.decrypt(
            response.data,
            this.clientid,
            this.clientid
          );
          this.questionnaireResponse = JSON.parse(decryptedData);

          console.log(this.questionnaireResponse);

          this.questionnaireResponse.forEach(
            (data: { SelectedAns: string }) => {
              if (!data.SelectedAns) {
                data.SelectedAns = 'YES';
              }
            }
          );

          this.answers = this.questionnaireResponse[0].Answer;
          this.planPreferenceDeclaration = window.sessionStorage.getItem(
            'selectePreferencedPlan'
          );
          this.selectedPlan = this.planPreferenceDeclaration;
          this.checkIfPreferenceChanged();
        }
      });
  }

  getSelectedOptionDays() {
    const savedOption = this.selectedPreferenceDays;

    if (savedOption) {
      this.selectedOption = { Days: savedOption };
      this.cdRef.detectChanges();
    } else {
      this.selectedOption = this.lifecycleDays[2];
    }
  }

  // selectAllcheck(): void {
  //   if (this.selectAll == true) {
  //   }
  // }

  selectAllCheckboxes(): void {
    if (this.selectAll == true && this.allCheckboxesProceed == false) {
      this.isIndianCitizen = true;
      this.ispep = true;
      //tick validations only apply if it is a YONO form
      if (this.IsYonoForm == true) {
        this.isyono = true;
      }
      this.istradingPref = true;
      this.issettledfunds = true;
      this.istermsandcond = true;
      this.selectedCheckboxes = [
        'indianCitizen',
        'pep',
        'tradingPref',
        'settledfunds',
        'termsandcond',
      ];
      sessionStorage.setItem(
        'selectedCheckboxes',
        JSON.stringify(this.selectedCheckboxes)
      );
      this.isProceedButton = false;
      return;
    } else if (this.selectAll && this.allCheckboxesProceed) {
      this.isIndianCitizen = false;
      this.ispep = false;
      //tick validations only apply if it is a YONO form
      if (this.IsYonoForm == true) {
        this.isyono = false;
      }
      this.istradingPref = false;
      this.issettledfunds = false;
      this.istermsandcond = false;
      this.selectedCheckboxes = [];
      sessionStorage.setItem(
        'selectedCheckboxes',
        JSON.stringify(this.selectedCheckboxes)
      );
      // this.isProceedButton = false;
      return;
    } else {
      this.isIndianCitizen = false;
      this.ispep = false;
      //tick validations only apply if it is a YONO form
      if (this.IsYonoForm == true) {
        this.isyono = false;
      }
      this.istradingPref = false;
      this.issettledfunds = false;
      this.istermsandcond = false;
      this.selectedCheckboxes = [];
      sessionStorage.setItem(
        'selectedCheckboxes',
        JSON.stringify(this.selectedCheckboxes)
      );
    }
    this.checkAllCheckboxesSelected();
  }

  checkAllCheckboxesSelected(): void {
    //Validation only considered when YONO Form is yes and Yono consent is selected
    if (this.IsYonoForm == true && this.isyono == true) {
      this.allCheckboxesSelected =
        this.isIndianCitizen &&
        this.ispep &&
        this.istradingPref &&
        this.issettledfunds &&
        this.istermsandcond &&
        this.isyono

        ;
    } else {
      this.allCheckboxesSelected =
        this.isIndianCitizen &&
        this.ispep &&
        this.istradingPref &&
        this.issettledfunds &&
        this.istermsandcond;
    }

    this.allCheckboxesProceed = this.allCheckboxesSelected;
    this.selectAll = true;
    //If it is a YONO form and only consent is unticked then only select all gets unticked and proceed button stays the same
    if (this.allCheckboxesProceed == true && this.isyono == false && this.IsYonoForm == true) {
      // var selectBox = document.getElementById('selectAll') as HTMLInputElement;
      // selectBox.checked = false;
      this.selectAll = false;

      this.isProceedButton = false;
    }
    else if (this.allCheckboxesProceed == true) {
      // var selectBox = document.getElementById('selectAll') as HTMLInputElement;
      // selectBox.checked = true;
      this.selectAll = true;
      this.isProceedButton = false;
    }
    else if (this.allCheckboxesProceed == false) {
      // var selectBox = document.getElementById('selectAll') as HTMLInputElement;
      // selectBox.checked = false;
      this.selectAll = false;

      this.isProceedButton = true;
    }
  }


  stopPropagation(event: Event) {
    event.stopPropagation();
  }

  DeclartionAPICall() {
    //console.log("test",this.PreferenceSelectedDiff)

    this.checkIfPreferenceChanged();

    this.spinner.show();

    //YONO consent yes is only considered if the form is of YONO and the option is ticked
    if (this.isyono == true && this.IsYonoForm == true) {
      this.yonoconsentvalue = 'Yes'
    } else {
      this.yonoconsentvalue = 'No'

    }
    if (this.PreferenceSelectedDiff == true) {
      //console.log("YAHA OPEN MODAL!")

      this.MoengageService.trackEvent('Declaration Submission Error', {
        product_id: window.sessionStorage.getItem('FormNumber') ?? '',
        ErrorMsg: 'Prefrences selection changed',
        product_name: 'Onboarding DIY',
        category: 'Plan Process',
      });

      this.openModal();
      this.spinner.hide();
      return;
    }
    const reqData = {
      flag: 'declaration',
      isPEP: 'Yes',
      IsTaxResident: 'Yes',
      Declaration: 'Yes',
      Prefernces: 'Yes',
      TermsAndCondition: 'Yes',
      FundcycleDays: this.selectedPreferenceDays,
      FormNumber: window.sessionStorage.getItem('FormNumber'),
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
      IsYono: this.yonoconsentvalue,
    };
    console.log('REQUEST DATA', reqData);
    this._http
      .postRequest('api/v1/schemeSegmentDetail/save', reqData)
      .subscribe((resp) => {
        let response = resp.body;
        if (response.status == true) {
          const response = JSON.parse(
            this.aesService.decrypt(
              resp.body.data,
              this.clientid,
              this.clientid
            )
          );
          this.saveSchemeSegment = response;

          this.MoengageService.trackEvent('Declaration Submitted', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            Declaration: 'All the checkboxes Selected',
            Fund_Settlement_Cycle: this.selectedPreferenceDays + ' Days',
            product_name: 'Onboarding DIY',
            category: 'Plan Process',
          });

          if (this.RejectStatus != 'R') {
            setTimeout(() => {
              this.router.navigate(['/planprocess', 2]);
              this.spinner.hide();
            }, 200);
          } else {
            setTimeout(() => {
              this.navService.navigateToNextStep();
              this.spinner.hide();
            }, 200);
          }
        } else {

          this.MoengageService.trackEvent('Declaration Submission Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            ErrorMsg: response.message,
            product_name: 'Onboarding DIY',
            category: 'Plan Process',
          });

          this.spinner.hide();

          this.toastr.warning(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 200,
          });
        }
      });
  }


  saveTradePreferenceQA() {
    // this.getTradingPreferenceAcceptance()
    this.spinner.show();
    let tradePrefrenceSaveRequestModel: any = [];
    for (var i = 0; i < this.questionnaireResponse.length; i++) {
      for (var j = 0; j < this.questionnaireResponse[i].Questions.length; j++) {
        tradePrefrenceSaveRequestModel.push({
          Title: this.questionnaireResponse[i].Title,
          TitleId: this.questionnaireResponse[i].TitleId,
          QuestionId: this.questionnaireResponse[i].Questions[j].QuestionId,
          AnswerKey: this.questionnaireResponse[i].Questions[j].SelectedAns,
          utm_source: this.utm_source,
          utm_medium: this.utm_medium,
          utm_campaign: this.utm_campaign,
        });
      }
    }
    this.checkIfPreferenceChanged();
    //console.log('test', this.PreferenceSelectedDiff);
    if (this.PreferenceSelectedDiff == true) {
      //console.log('YAHA OPEN MODAL!');

      this.MoengageService.trackEvent('Declaration Submission Error', {
        product_id: window.sessionStorage.getItem('FormNumber') ?? '',
        ErrorMsg: 'Prefrences selection changed',
        product_name: 'Onboarding DIY',
        category: 'Plan Process',
      });

      this.openModal();
      this.spinner.hide();
      return;
    }
    this.spinner.hide();
    window.sessionStorage.setItem('Preference', 'Yes');
    const reqData = {
      FormNumber: window.sessionStorage.getItem('FormNumber'),
      tradePrefrenceSaveRequestModel: tradePrefrenceSaveRequestModel,
    };

    this._http
      .postRequest('api/v1/tradeprefrence/savetradeprefrence', reqData)
      .subscribe((resp) => {
        let response = JSON.parse(
          this.aesService.decrypt(resp.body.data, this.clientid, this.clientid)
        );

        if (response == true) {
          this.questionnaireResponse1 = response;
          this.questions = this.questionnaireResponse[0].Questions[0].Question;
          this.questionID =
            this.questionnaireResponse[0].Questions[0].QuestionId;
          this.answers = this.questionnaireResponse[0].Questions[0].Answer;

          window.sessionStorage.setItem('Preference', 'Yes');
        } else {
          this.MoengageService.trackEvent('Declaration Submission Error', {
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
          return;
        }
      });
  }

  checkIfPreferenceChanged() {
    let tradePrefrenceSaveRequestModel: any = [];
    for (var i = 0; i < this.questionnaireResponse.length; i++) {
      for (var j = 0; j < this.questionnaireResponse[i].Questions.length; j++) {
        tradePrefrenceSaveRequestModel.push({
          Title: this.questionnaireResponse[i].Title,
          TitleId: this.questionnaireResponse[i].TitleId,
          QuestionId: this.questionnaireResponse[i].Questions[j].QuestionId,
          AnswerKey: this.questionnaireResponse[i].Questions[j].SelectedAns,
          utm_source: this.utm_source,
          utm_medium: this.utm_medium,
          utm_campaign: this.utm_campaign,
        });
      }
    }
    const get = (idx: number) => tradePrefrenceSaveRequestModel[idx];
    this.PreferenceSelectedDiff = (
      (get(0)?.Title == 'Automatic Credit' && get(0)?.AnswerKey != 'YES') ||
      (get(1)?.Title == 'Pledge' && get(1)?.AnswerKey != 'YES') ||
      (get(2)?.Title == 'DIS' && get(2)?.AnswerKey != 'NO') ||
      (get(3)?.Title == 'DDPI Operation' && get(3)?.AnswerKey != 'YES') ||
      (get(4)?.Title == 'SMS Alert Facility' && get(4)?.AnswerKey != 'YES' && get(4)?.QuestionId == 5) ||
      (get(5)?.Title == 'SMS Alert Facility' && get(5)?.AnswerKey != 'NO' && get(5)?.QuestionId == 6) ||
      (get(6)?.Title == 'SMS Alert Facility' && get(6)?.AnswerKey != 'NO' && get(6)?.QuestionId == 7) ||
      (get(7)?.Title == 'ECS Mandate' && get(7)?.AnswerKey != 'YES') ||
      (get(8)?.Title == 'BSDA Facility' && get(8)?.AnswerKey != 'YES') ||
      (get(9)?.Title == 'Account Statement' && get(9)?.AnswerKey != 'As per SEBI Regulation') ||
      (get(10)?.Title == 'RTA' && get(10)?.AnswerKey != 'YES') ||
      (get(11)?.Title == 'Standard Documents / Annual Report' && get(11)?.AnswerKey != 'Electronic') ||
      (get(12)?.Title == 'easi / Ideas' && get(12)?.AnswerKey != 'YES')
    ) ?? false;
  }

  // checkIfPreferenceChanged() {
  //   let tradePrefrenceSaveRequestModel: any = [];
  //   for (var i = 0; i < this.questionnaireResponse.length; i++) {
  //     for (var j = 0; j < this.questionnaireResponse[i].Questions.length; j++) {
  //       tradePrefrenceSaveRequestModel.push({
  //         Title: this.questionnaireResponse[i].Title,
  //         TitleId: this.questionnaireResponse[i].TitleId,
  //         QuestionId: this.questionnaireResponse[i].Questions[j].QuestionId,
  //         AnswerKey: this.questionnaireResponse[i].Questions[j].SelectedAns,
  //         utm_source: this.utm_source,
  //         utm_medium: this.utm_medium,
  //         utm_campaign: this.utm_campaign,
  //       });
  //     }
  //   }
  //   if (
  //     (tradePrefrenceSaveRequestModel[0].Title == 'Automatic Credit' &&
  //       tradePrefrenceSaveRequestModel[0].AnswerKey != 'YES') ||
  //     (tradePrefrenceSaveRequestModel[1].Title == 'Pledge' &&
  //       tradePrefrenceSaveRequestModel[1].AnswerKey != 'YES') ||
  //     (tradePrefrenceSaveRequestModel[2].Title == 'DIS' &&
  //       tradePrefrenceSaveRequestModel[2].AnswerKey != 'NO') ||
  //     (tradePrefrenceSaveRequestModel[3].Title == 'DDPI Operation' &&
  //       tradePrefrenceSaveRequestModel[3].AnswerKey != 'YES') ||
  //     (tradePrefrenceSaveRequestModel[4].Title == 'SMS Alert Facility' &&
  //       tradePrefrenceSaveRequestModel[4].AnswerKey != 'YES' &&
  //       tradePrefrenceSaveRequestModel[4].QuestionId == 5) ||
  //     (tradePrefrenceSaveRequestModel[5].Title == 'SMS Alert Facility' &&
  //       tradePrefrenceSaveRequestModel[5].AnswerKey != 'NO' &&
  //       tradePrefrenceSaveRequestModel[5].QuestionId == 6) ||
  //     (tradePrefrenceSaveRequestModel[6].Title == 'SMS Alert Facility' &&
  //       tradePrefrenceSaveRequestModel[6].AnswerKey != 'NO' &&
  //       tradePrefrenceSaveRequestModel[6].QuestionId == 7) ||
  //     (tradePrefrenceSaveRequestModel[7].Title == 'ECS Mandate' &&
  //       tradePrefrenceSaveRequestModel[7].AnswerKey != 'YES') ||
  //     (tradePrefrenceSaveRequestModel[8].Title == 'BSDA Facility' &&
  //       tradePrefrenceSaveRequestModel[8].AnswerKey != 'YES') ||
  //     (tradePrefrenceSaveRequestModel[9].Title == 'Account Statement' &&
  //       tradePrefrenceSaveRequestModel[9].AnswerKey !=
  //         'As per SEBI Regulation') ||
  //     (tradePrefrenceSaveRequestModel[10].Title == 'RTA' &&
  //       tradePrefrenceSaveRequestModel[10].AnswerKey != 'YES') ||
  //     (tradePrefrenceSaveRequestModel[11].Title ==
  //       'Standard Documents / Annual Report' &&
  //       tradePrefrenceSaveRequestModel[11].AnswerKey != 'Electronic') ||
  //     (tradePrefrenceSaveRequestModel[12].Title == 'easi / Ideas' &&
  //       tradePrefrenceSaveRequestModel[12].AnswerKey != 'YES')
  //   ) {
  //     this.PreferenceSelectedDiff = true;
  //     // console.log("PREFERENCE true!",this.PreferenceSelectedDiff)
  //   } else {
  //     this.PreferenceSelectedDiff = false;
  //     // console.log("PREFERENCE false!",this.PreferenceSelectedDiff)
  //   }
  // }

  selectOption(option: any) {
    this.selectedOption = option;
    this.selectedPreferenceDays = option.Days;
  }

  acceptTerms() {
    sessionStorage.setItem('AcceptTerms', 'Yes');
  }

  redirectToBankDetails() {
    var mode = window.sessionStorage.getItem('mode');

    let IsYonoClient = window.sessionStorage.getItem('IsYono') ?? '';
    let yonobankstatus = window.sessionStorage.getItem('yonobank') ?? '';

    if (yonobankstatus === 'UNIQUE' && (IsYonoClient === 'YONO' || IsYonoClient === 'Branch Portal')) {
      this.spinner.show();
      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.router.navigate(['/personalDetailsForm', 5]);
        this.spinner.hide();
      }, 200);
    } else {
      if (mode === 'Penny Drop' || mode === 'OCR') {
        this.spinner.show();
        setTimeout(() => {
          const modalBackdrops = document.querySelectorAll('.modal-backdrop');
          modalBackdrops.forEach((backdrop) => {
            if (backdrop instanceof HTMLElement) {
              backdrop.remove();
            }
          });
          this.router.navigate(['/PennyDrop', 2]);
          this.spinner.hide();
        }, 200);
      } else if (mode === 'RevPennyDrop') {
        this.spinner.show();
        setTimeout(() => {
          const modalBackdrops = document.querySelectorAll('.modal-backdrop');
          modalBackdrops.forEach((backdrop) => {
            if (backdrop instanceof HTMLElement) {
              backdrop.remove();
            }
          });
          this.router.navigate(['/reversePennyDrop', 2]);
          this.spinner.hide();
        }, 200);
      } else {
        this.spinner.show();
        setTimeout(() => {
          const modalBackdrops = document.querySelectorAll('.modal-backdrop');
          modalBackdrops.forEach((backdrop) => {
            if (backdrop instanceof HTMLElement) {
              backdrop.remove();
            }
          });
          this.router.navigate(['/personalDetailsForm', 6]);
          this.spinner.hide();
        }, 200);
      }
    }
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });
  }
  openModal() {
    $('#confirmPref').modal('show');
  }

  terminateModal() {
    this.PreferenceDeny = true;
  }
  DoNotChange() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });
    this.getTradingPreferenceAcceptance();
  }
}
