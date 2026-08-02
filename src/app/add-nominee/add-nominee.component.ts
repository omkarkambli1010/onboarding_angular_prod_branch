import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { DatePipe } from '@angular/common';
import { concat } from 'rxjs';
import { MoengagesdkService } from '../moengagesdk.service';
import { Action } from 'rxjs/internal/scheduler/Action';
declare var $: any;
@Component({
  selector: 'app-add-nominee',
  templateUrl: './add-nominee.component.html',
  styleUrls: ['./add-nominee.component.css'],
})
export class AddNomineeComponent {
  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  PersonalFormOne: boolean = true;
  PersonalFormTwo: boolean = false;
  PersonalFormThree: boolean = false;
  PersonalFormFour: boolean = false;
  PersonalFormFive: boolean = false;
  PersonalFormSix: boolean = false;

  PersonalResponse: any;
  NomineeOneResponse: any = '';
  NomineeTwoResponse: any = '';
  NomineeThreeResponse: any = '';

  NomineeOneProofResponse: any = '';
  NomineeTwoProofResponse: any = '';
  NomineeThreeProofResponse: any = '';

  CityStateResponse: any;

  guardianListResponse: any;
  utm_source!: any;
  utm_medium!: any;
  utm_campaign!: any;
  clientid: any;

  preFilledAddress: boolean = false;
  preFilledGuardianAddress: boolean = false;
  manualAddress: boolean = true;

  nomineeOneGuardian: boolean = false;
  nomineeTwoGuardian: boolean = false;
  nomineeThreeGuardian: boolean = false;

  ageBelow18warning: boolean = false;
  ageBelow18warning2: boolean = false;
  ageBelow18warning3: boolean = false;

  personalFormNumber = window.sessionStorage.getItem('FormNumber');

  formattedDOB: any;
  minDate: any;
  maxDate: any;
  minDateGuardian: any;
  maxDateGuardian: any;
  nomineeoptout: boolean = false;

  isNomineeSOH: boolean = false;

  emailmultiplesymb1: boolean = false;
  emailReq1: boolean = false;
  emailFormatVal1: boolean = false;
  emailspecialchars1: boolean = false;

  emailmultiplesymb2: boolean = false;
  emailReq2: boolean = false;
  emailFormatVal2: boolean = false;
  emailspecialchars2: boolean = false;

  emailmultiplesymb3: boolean = false;
  emailReq3: boolean = false;
  emailFormatVal3: boolean = false;
  emailspecialchars3: boolean = false;

  emailmultiplesymbGuar1: boolean = false;
  emailReqGuar1: boolean = false;
  emailFormatValGuar1: boolean = false;
  emailspecialcharsGuar1: boolean = false;

  emailmultiplesymbGuar2: boolean = false;
  emailReqGuar2: boolean = false;
  emailFormatValGuar2: boolean = false;
  emailspecialcharsGuar2: boolean = false;

  emailmultiplesymbGuar3: boolean = false;
  emailReqGuar3: boolean = false;
  emailFormatValGuar3: boolean = false;
  emailspecialcharsGuar3: boolean = false;

  isEmailDisableBtn1: boolean = false;
  isEmailDisableBtn2: boolean = false;
  isEmailDisableBtn3: boolean = false;

  isEmailDisableBtnGuar1: boolean = false;
  isEmailDisableBtnGuar2: boolean = false;
  isEmailDisableBtnGuar3: boolean = false;

  nomineeDetails: any = {
    FormNumber: window.sessionStorage.getItem('FormNumber'),
    nomineefname: '',
    nomineelname: '',
    nomineeOnedob: '',
    nomineeAllocationRange: '100',
    nomineeApplicantCheck: true,
    nomineeisMinorCheck: false,
    isNomineeMinorDisable: false,
    nomineeAddress1: '',
    nomineeAddress2: '',
    nomineeAddress3: '',
    nomineePincode: '',
    nomineeState: '',
    nomineeCity: '',
    nomineeGuardianFirstName: '',
    nomineeGuardianLastName: '',
    nomineeGuardiandob: '',
    nomineeGuardianApplicantCheck: false,
    nomineeGuardianAddress1: '',
    nomineeGuardianAddress2: '',
    nomineeGuardianAddress3: '',
    nomineeGuardianPincode: '',
    nomineeGuardianState: '',
    nomineeGuardianCity: '',

    nomineeGuardianEmail: '',
    nomineeGuardianMobile: '',
    nomineeGuardianProofType: '',
    nomineeGuardianProofnumber: '',

    nom_relation: '',
    nom_guard_relation: '',
    utm_source: this.utm_source,
    utm_medium: this.utm_medium,
    utm_campaign: this.utm_campaign,
    NomTrdMobile: '',
    NomEmailID: '',
    nomineeprooftype: '',
    nomineeproofnumber: '',
    isNomineeSOH: false,
  };

  nomineeDetails2: any = {
    FormNumber: window.sessionStorage.getItem('FormNumber'),
    nomineefname: '',
    nomineelname: '',
    nomineeOnedob: '',
    nomineeAllocationRange: '',
    nomineeApplicantCheck: true,
    nomineeisMinorCheck: false,
    isNomineeMinorDisable: false,
    nomineeGuardianAddress1: '',
    nomineeGuardianAddress2: '',
    nomineeGuardianAddress3: '',
    nomineeGuardianPincode: '',
    nomineeGuardianState: '',
    nomineeGuardianCity: '',

    nomineeGuardianEmail: '',
    nomineeGuardianMobile: '',
    nomineeGuardianProofType: '',
    nomineeGuardianProofnumber: '',

    nomineeAddress1: '',
    nomineeAddress2: '',
    nomineeAddress3: '',
    nomineePincode: '',
    nomineeState: '',
    nomineeCity: '',
    nomineeGuardianFirstName: '',
    nomineeGuardianLastName: '',
    nomineeGuardiandob: '',
    nomineeGuardianApplicantCheck: false,
    nom_relation: '',
    nom_guard_relation: '',
    utm_source: this.utm_source,
    utm_medium: this.utm_medium,
    utm_campaign: this.utm_campaign,
    NomTrdMobile: '',
    NomEmailID: '',
    nomineeprooftype: '',
    nomineeproofnumber: '',
  };

  nomineeDetails3: any = {
    FormNumber: window.sessionStorage.getItem('FormNumber'),
    nomineefname: '',
    nomineelname: '',
    nomineeOnedob: '',
    nomineeAllocationRange: '',
    nomineeApplicantCheck: true,
    nomineeisMinorCheck: false,
    isNomineeMinorDisable: false,
    nomineeAddress1: '',
    nomineeAddress2: '',
    nomineeAddress3: '',
    nomineePincode: '',
    nomineeState: '',
    nomineeCity: '',
    nomineeGuardianFirstName: '',
    nomineeGuardianLastName: '',
    nomineeGuardiandob: '',
    nomineeGuardianApplicantCheck: false,
    nomineeGuardianAddress1: '',
    nomineeGuardianAddress2: '',
    nomineeGuardianAddress3: '',
    nomineeGuardianPincode: '',
    nomineeGuardianState: '',
    nomineeGuardianCity: '',

    nomineeGuardianEmail: '',
    nomineeGuardianMobile: '',
    nomineeGuardianProofType: '',
    nomineeGuardianProofnumber: '',

    nom_relation: '',
    nom_guard_relation: '',
    utm_source: this.utm_source,
    utm_medium: this.utm_medium,
    utm_campaign: this.utm_campaign,
    NomTrdMobile: '',
    NomEmailID: '',
    nomineeprooftype: '',
    nomineeproofnumber: '',
  };

  accordionItems: { heading: any; body: any; isOpen: boolean }[] = [];

  visibleAccordions = 0;
  dateOfBirthId = 'nomineedob';
  dateOfBirthName = 'nomineedob';
  dateOfBirthIdTwo = 'nomineeTwodob';
  dateOfBirthNameTwo = 'nomineeTwodob';
  dateOfBirthIdThree = 'nomineeThreedob';
  dateOfBirthNameThree = 'nomineeThreedob';
  NomineeOneDob: any;
  NomineeTwoDob: any;
  NomineeThreeDob: any;

  Nominee1FName: boolean = false;
  Nominee1FSpecial: boolean = false;
  Nominee1FSpace: boolean = false;
  Nominee1FDigit: boolean = false;
  Nominee1LName: boolean = false;
  Nominee1LSpecial: boolean = false;
  Nominee1LSpace: boolean = false;
  Nominee1LDigit: boolean = false;

  Nominee2FName: boolean = false;
  Nominee2FSpecial: boolean = false;
  Nominee2FSpace: boolean = false;
  Nominee2FDigit: boolean = false;
  Nominee2LName: boolean = false;
  Nominee2LSpecial: boolean = false;
  Nominee2LSpace: boolean = false;
  Nominee2LDigit: boolean = false;

  Nominee3FName: boolean = false;
  Nominee3FSpecial: boolean = false;
  Nominee3FSpace: boolean = false;
  Nominee3FDigit: boolean = false;
  Nominee3LName: boolean = false;
  Nominee3LSpecial: boolean = false;
  Nominee3LSpace: boolean = false;
  Nominee3LDigit: boolean = false;

  Nominee1Relation: boolean = false;
  Nominee2Relation: boolean = false;
  Nominee3Relation: boolean = false;

  // Nominee1DOB: boolean = false;
  // Nominee2DOB: boolean = false;
  // Nominee3DOB: boolean = false;

  Nominee1Mobile: boolean = false;
  Nominee2Mobile: boolean = false;
  Nominee3Mobile: boolean = false;
  Nominee1Mobilerror: boolean = false;
  Nominee2Mobilerror: boolean = false;
  Nominee3Mobilerror: boolean = false;

  Nominee1GuarMobile: boolean = false;
  Nominee2GuarMobile: boolean = false;
  Nominee3GuarMobile: boolean = false;
  Nominee1GuarMobilerror: boolean = false;
  Nominee2GuarMobilerror: boolean = false;
  Nominee3GuarMobilerror: boolean = false;
  Nominee1Email: boolean = false;
  Nominee2Email: boolean = false;
  Nominee3Email: boolean = false;
  Nominee1Prooftype: boolean = false;
  Nominee2Prooftype: boolean = false;
  Nominee3Prooftype: boolean = false;
  Nominee1ProofIdNo: boolean = false;
  Nominee2ProofIdNo: boolean = false;
  Nominee3ProofIdNo: boolean = false;

  NomineeGuar1Prooftype: boolean = false;
  NomineeGuar2Prooftype: boolean = false;
  NomineeGuar3Prooftype: boolean = false;
  NomineeGuar1ProofIdNo: boolean = false;
  NomineeGuar2ProofIdNo: boolean = false;
  NomineeGuar3ProofIdNo: boolean = false;

  Nominee1adharmsg: boolean = false;
  Nominee2adharmsg: boolean = false;
  Nominee3adharmsg: boolean = false;

  NomineeGuar1adharmsg: boolean = false;
  NomineeGuar2adharmsg: boolean = false;
  NomineeGuar3adharmsg: boolean = false;

  Nominee1DOBisMinor: boolean = false;
  Nominee2DOBisMinor: boolean = false;
  Nominee3DOBisMinor: boolean = false;

  Nominee1Allocation: boolean = false;
  Nominee2Allocation: boolean = false;
  Nominee3Allocation: boolean = false;
  Nominee1AllocationPer: boolean = false;
  Nominee2AllocationPer: boolean = false;
  Nominee3AllocationPer: boolean = false;
  Nominee1AddLine1: boolean = false;
  Nominee2AddLine1: boolean = false;
  Nominee3AddLine1: boolean = false;
  Nominee1AddLine1Space: boolean = false;
  Nominee2AddLine1Space: boolean = false;
  Nominee3AddLine1Space: boolean = false;
  Nominee1AddLine2Space: boolean = false;
  Nominee2AddLine2Space: boolean = false;
  Nominee3AddLine2Space: boolean = false;
  Nominee1AddLine3Space: boolean = false;
  Nominee2AddLine3Space: boolean = false;
  Nominee3AddLine3Space: boolean = false;
  Nominee1GuardianAddLine1: boolean = false;
  Nominee2GuardianAddLine1: boolean = false;
  Nominee3GuardianAddLine1: boolean = false;
  Nominee1GuardianAddLine2: boolean = false;
  Nominee2GuardianAddLine2: boolean = false;
  Nominee3GuardianAddLine2: boolean = false;
  Nominee1GuardianAddLine3: boolean = false;
  Nominee2GuardianAddLine3: boolean = false;
  Nominee3GuardianAddLine3: boolean = false;
  Nominee1GuardianAddLine1Space: boolean = false;
  Nominee2GuardianAddLine1Space: boolean = false;
  Nominee3GuardianAddLine1Space: boolean = false;
  Nominee1GuardianAddLine2Space: boolean = false;
  Nominee2GuardianAddLine2Space: boolean = false;
  Nominee3GuardianAddLine2Space: boolean = false;
  Nominee1GuardianAddLine3Space: boolean = false;
  Nominee2GuardianAddLine3Space: boolean = false;
  Nominee3GuardianAddLine3Space: boolean = false;
  Nominee1Pincode: boolean = false;
  Nominee2Pincode: boolean = false;
  Nominee3Pincode: boolean = false;
  Nominee1PincodeLength: boolean = false;
  Nominee2PincodeLength: boolean = false;
  Nominee3PincodeLength: boolean = false;
  Nominee1GuardianPincode: boolean = false;
  Nominee2GuardianPincode: boolean = false;
  Nominee3GuardianPincode: boolean = false;
  Nominee1GuardianPincodeLength: boolean = false;
  Nominee2GuardianPincodeLength: boolean = false;
  Nominee3GuardianPincodeLength: boolean = false;
  // Nominee1State: boolean = false;
  // Nominee2State: boolean = false;
  // Nominee3State: boolean = false;
  Nominee1City: boolean = false;
  Nominee2City: boolean = false;
  Nominee3City: boolean = false;

  Nominee1GuardianCity: boolean = false;
  Nominee2GuardianCity: boolean = false;
  Nominee3GuardianCity: boolean = false;
  Nominee1GuardianState: boolean = false;
  Nominee2GuardianState: boolean = false;
  Nominee3GuardianState: boolean = false;
  Nominee1FGuardianName: boolean = false;
  Nominee2FGuardianName: boolean = false;
  Nominee3FGuardianName: boolean = false;
  Nominee1FGuardianSpecial: boolean = false;
  Nominee2FGuardianSpecial: boolean = false;
  Nominee3FGuardianSpecial: boolean = false;
  Nominee1FGuardianSpace: boolean = false;
  Nominee2FGuardianSpace: boolean = false;
  Nominee3FGuardianSpace: boolean = false;
  Nominee1FGuardianDigit: boolean = false;
  Nominee2FGuardianDigit: boolean = false;
  Nominee3FGuardianDigit: boolean = false;

  Nominee1LGuardianName: boolean = false;
  Nominee2LGuardianName: boolean = false;
  Nominee3LGuardianName: boolean = false;
  Nominee1LGuardianSpecial: boolean = false;
  Nominee2LGuardianSpecial: boolean = false;
  Nominee3LGuardianSpecial: boolean = false;
  Nominee1LGuardianSpace: boolean = false;
  Nominee2LGuardianSpace: boolean = false;
  Nominee3LGuardianSpace: boolean = false;
  Nominee1LGuardianDigit: boolean = false;
  Nominee2LGuardianDigit: boolean = false;
  Nominee3LGuardianDigit: boolean = false;

  Nominee1GuardianRelation: boolean = false;
  Nominee2GuardianRelation: boolean = false;
  Nominee3GuardianRelation: boolean = false;
  Nominee1GuardianDOB: boolean = false;
  Nominee2GuardianDOB: boolean = false;
  Nominee3GuardianDOB: boolean = false;

  Nominee1SameAsFirst: boolean = false;
  Nominee2SameAsFirst: boolean = false;
  Nominee3SameAsFirst: boolean = false;
  CityReqSpecial: boolean = false;
  CityReqDigit: boolean = false;
  City2ReqSpecial: boolean = false;
  City2ReqDigit: boolean = false;
  City3ReqSpecial: boolean = false;
  City3ReqDigit: any = false;
  SaveNominee: boolean = false;

  constructor(
    private _http: APIService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private aesService: AesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private datePipe: DatePipe,
    private MoengageService: MoengagesdkService
  ) {}

  // onGuardianApplicantCheckChangeOne(event: any): void {
  //   const isChecked = event.target.checked;
  //   if (isChecked == true) {
  //     this.nomineeDetails.nomineeGuardianApplicantCheck = true;
  //   } else if (this.nomineeDetails.nomineeisMinorCheck == false) {
  //     this.nomineeDetails.nomineeGuardianApplicantCheck = false;
  //   }
  // }

  // onGuardianApplicantCheckChangeTwo(event: any): void {
  //   const isChecked = event.target.checked;
  //   if (isChecked == true) {
  //     this.nomineeDetails2.nomineeGuardianApplicantCheck = true;
  //   } else if (this.nomineeDetails2.nomineeisMinorCheck == false) {
  //     this.nomineeDetails2.nomineeGuardianApplicantCheck = false;
  //   }
  // }

  // onGuardianApplicantCheckChangeThree(event: any): void {
  //   const isChecked = event.target.checked;
  //   if (isChecked == true) {
  //     this.nomineeDetails3.nomineeGuardianApplicantCheck = true;
  //   } else if (this.nomineeDetails3.nomineeisMinorCheck == false) {
  //     this.nomineeDetails3.nomineeGuardianApplicantCheck = false;
  //   }
  // }

  ngOnInit(): void {
    this.title.setTitle('Add Nominee - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Adding Nominee during the onboarding process journey',
    });

    this.route.params.subscribe((params) => {
      const formNumber = params['formNumber'];
      this.setFormVisibility(formNumber);
    });

    this.clientid = window.sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';
    this.getNomineeGuardianDetails();

    this.nomineeDetails.utm_source = this.utm_source;
    this.nomineeDetails.utm_medium = this.utm_medium;
    this.nomineeDetails.utm_campaign = this.utm_campaign;

    this.nomineeDetails2.utm_source = this.utm_source;
    this.nomineeDetails2.utm_medium = this.utm_medium;
    this.nomineeDetails2.utm_campaign = this.utm_campaign;

    this.nomineeDetails3.utm_source = this.utm_source;
    this.nomineeDetails3.utm_medium = this.utm_medium;
    this.nomineeDetails3.utm_campaign = this.utm_campaign;

    const storedItems = sessionStorage.getItem('accordionItems');

    if (storedItems) {
      this.accordionItems = JSON.parse(storedItems);
      this.visibleAccordions = this.accordionItems.length;
    } else {
      this.addNominee();
    }

    const today = new Date();
    this.maxDate = today;
    this.minDate = new Date(
      today.getFullYear() - 18,
      today.getMonth(),
      today.getDate() + 1
    );
    this.minDateGuardian = new Date(
      today.getFullYear() - 100,
      today.getMonth(),
      today.getDate()
    );

    this.maxDateGuardian = new Date(new Date().getFullYear() - 18, 0, 1);
  }

  // Define the flatpickr options
  datePickerOptions: any = {
    dateFormat: 'd/m/Y',
    altFormat: 'd/m/Y',
    enableTime: false,
    defaultDate: null,
    disableMobile: true, // Disable native mobile date picker
    minDate: new Date(new Date().getFullYear() - 100, 0, 1),
    maxDate: new Date(),
  };

  datePickerOptionsGurdian: any = {
    dateFormat: 'd/m/Y',
    altFormat: 'd/m/Y',
    enableTime: false,
    defaultDate: null,
    disableMobile: true, // Disable native mobile date picker
    minDate: new Date(new Date().getFullYear() - 100, 0, 1),
    maxDate: new Date(new Date().getFullYear() - 18, 0, 1),
  };

  setFormVisibility(formNumber: string) {
    this.PersonalFormOne = false;
    this.PersonalFormTwo = false;

    switch (formNumber) {
      case '1':
        this.PersonalFormOne = true;
        break;
      case '2':
        this.PersonalFormTwo = true;
        this.getPersonalDataTwo();
        break;
      default:
        break;
    }
  }

  getPersonalDataTwo() {
    this.spinner.show();
    var reqData = {
      flag: 'nominee',
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
            // console.log('response',response)
            var soh;
            if (response[0].IsNomineeSOH == 'True') {
              soh = true;
            } else {
              soh = false;
            }
            if (response && response[0] && !response[0].nomineeOptOut) {
              this.visibleAccordions = 1;
              this.nomineeDetails = {
                FormNumber: window.sessionStorage.getItem('FormNumber'),

                nomineefname: response[0].NomTrdNameFir,

                nomineelname: response[0].NomTrdNameLas,

                // nomineeOnedob: this.datePipe.transform(
                //   response[0].NomtrdDOB,
                //   'dd/MM/yyyy'
                // ),

                NomTrdMobile: response[0].NomTrdMobile,
                NomEmailID: response[0].NomEmailID,
                nomineeprooftype: response[0].nomineeprooftype,
                nomineeproofnumber: response[0].nomineeproofnumber,

                nomineeOnedob: response[0].NomtrdDOB,

                nomineeAllocationRange: response[0].nomineepercentage,

                nomineeApplicantCheck: response[0].sameAsApplicantNominee,

                nomineeAddress1: response[0].NomTrdHousFlat,
                nomineeAddress2: response[0].NomtrdBuilStr,
                nomineeAddress3: response[0].NomTrdPosttown,

                nomineePincode: response[0].NomTrdPincode,

                nomineeState: response[0].NomTrdState,

                nomineeCity: response[0].NomTrdDistCity,

                nomineeGuardianFirstName: response[0].NomtrdNameGurFir,

                nomineeGuardianLastName: response[0].NomtrdNameGurLas,

                nomineeGuardiandob: response[0].nomineeGuardiandob,
                nomineeGuardianAddress1: response[0].NomTrdGurHousFlat,
                nomineeGuardianAddress2: response[0].NomtrdGurBuilStr,
                nomineeGuardianAddress3: response[0].NomTrdGurPosttown,
                nomineeGuardianPincode: response[0].NomTrdGurPincode,
                nomineeGuardianState: response[0].NomTrdGurState,
                nomineeGuardianCity: response[0].NomTrdGurDistCity,
                isNomineeSOH: soh,

                nomineeGuardianEmail: response[0].NomTrdGurEmail,
                nomineeGuardianMobile: response[0].NomTrdGurMobile,
                nomineeGuardianProofType: response[0].gurnomineeprooftype,
                nomineeGuardianProofnumber: response[0].gurnomineeproofnumber,
                // nomineeGuardiandob: this.datePipe.transform(
                //   response[0].nomineeGuardiandob,
                //   'dd/MM/yyyy'),

                nomineeGuardianApplicantCheck:
                  response[0].sameAsGuardianAddress,

                nom_relation: response[0].NomTrdRelation,

                nom_guard_relation: response[0].NomTrdGurRelation,

                utm_source: this.utm_source,

                utm_medium: this.utm_medium,

                utm_campaign: this.utm_campaign,
              };

              this.checkNomineeAge();
            }

            if (response && response[1]) {
              this.visibleAccordions = 2;
              this.nomineeDetails2 = {
                FormNumber: window.sessionStorage.getItem('FormNumber'),

                nomineefname: response[1].NomTrdNameFir,

                nomineelname: response[1].NomTrdNameLas,

                // nomineeOnedob: this.datePipe.transform(
                //   response[1].NomtrdDOB,
                //   'dd/MM/yyyy'
                // ),

                NomTrdMobile: response[1].NomTrdMobile,
                NomEmailID: response[1].NomEmailID,
                nomineeprooftype: response[1].nomineeprooftype,
                nomineeproofnumber: response[1].nomineeproofnumber,

                nomineeOnedob: response[1].NomtrdDOB,

                nomineeAllocationRange: response[1].nomineepercentage,

                nomineeApplicantCheck: response[1].sameAsApplicantNominee,

                nomineeAddress1: response[1].NomTrdHousFlat,

                nomineeAddress2: response[1].NomtrdBuilStr,

                nomineeAddress3: response[1].NomTrdPosttown,

                nomineePincode: response[1].NomTrdPincode,

                nomineeState: response[1].NomTrdState,

                nomineeCity: response[1].NomTrdDistCity,

                nomineeGuardianFirstName: response[1].NomtrdNameGurFir,

                nomineeGuardianLastName: response[1].NomtrdNameGurLas,

                nomineeGuardiandob: response[1].nomineeGuardiandob,
                nomineeGuardianAddress1: response[1].NomTrdGurHousFlat,
                nomineeGuardianAddress2: response[1].NomtrdGurBuilStr,
                nomineeGuardianAddress3: response[1].NomTrdGurPosttown,
                nomineeGuardianPincode: response[1].NomTrdGurPincode,
                nomineeGuardianState: response[1].NomTrdGurState,
                nomineeGuardianCity: response[1].NomTrdGurDistCity,
                nomineeGuardianEmail: response[1].NomTrdGurEmail,
                nomineeGuardianMobile: response[1].NomTrdGurMobile,
                nomineeGuardianProofType: response[1].gurnomineeprooftype,
                nomineeGuardianProofnumber: response[1].gurnomineeproofnumber,
                // nomineeGuardiandob: this.datePipe.transform(
                //   response[1].nomineeGuardiandob,
                //   'dd/MM/yyyy'),

                nomineeGuardianApplicantCheck:
                  response[1].sameAsGuardianAddress,

                nom_relation: response[1].NomTrdRelation,

                nom_guard_relation: response[1].NomTrdGurRelation,

                utm_source: this.utm_source,

                utm_medium: this.utm_medium,

                utm_campaign: this.utm_campaign,
              };

              this.checkNomineeAgeTwo();
            }

            if (response && response[2]) {
              this.visibleAccordions = 3;

              this.nomineeDetails3 = {
                FormNumber: window.sessionStorage.getItem('FormNumber'),

                nomineefname: response[2].NomTrdNameFir,

                nomineelname: response[2].NomTrdNameLas,

                // nomineeOnedob: this.datePipe.transform(
                //   response[2].NomtrdDOB,
                //   'dd/MM/yyyy'
                // ),

                NomTrdMobile: response[2].NomTrdMobile,
                NomEmailID: response[2].NomEmailID,
                nomineeprooftype: response[2].nomineeprooftype,
                nomineeproofnumber: response[2].nomineeproofnumber,

                nomineeOnedob: response[2].NomtrdDOB,

                nomineeAllocationRange: response[2].nomineepercentage,

                nomineeApplicantCheck: response[2].sameAsApplicantNominee,

                nomineeAddress1: response[2].NomTrdHousFlat,

                nomineeAddress2: response[2].NomTrdHousFlat,

                nomineeAddress3: response[2].NomTrdPosttown,

                nomineePincode: response[2].NomTrdPincode,

                nomineeState: response[2].NomTrdState,

                nomineeCity: response[2].NomTrdDistCity,
                nomineeGuardianFirstName: response[2].NomtrdNameGurFir,

                nomineeGuardianLastName: response[2].NomtrdNameGurLas,

                nomineeGuardiandob: response[2].nomineeGuardiandob,
                nomineeGuardianAddress1: response[2].NomTrdGurHousFlat,
                nomineeGuardianAddress2: response[2].NomtrdGurBuilStr,
                nomineeGuardianAddress3: response[2].NomTrdGurPosttown,
                nomineeGuardianPincode: response[2].NomTrdGurPincode,
                nomineeGuardianState: response[2].NomTrdGurState,
                nomineeGuardianCity: response[2].NomTrdGurDistCity,
                nomineeGuardianEmail: response[2].NomTrdGurEmail,
                nomineeGuardianMobile: response[2].NomTrdGurMobile,
                nomineeGuardianProofType: response[2].gurnomineeprooftype,
                nomineeGuardianProofnumber: response[2].gurnomineeproofnumber,
                // nomineeGuardiandob: this.datePipe.transform(
                //   response[2].nomineeGuardiandob,
                //   'dd/MM/yyyy'),

                nomineeGuardianApplicantCheck:
                  response[2].sameAsGuardianAddress,

                nom_relation: response[2].NomTrdRelation,

                nom_guard_relation: response[2].NomTrdGurRelation,

                utm_source: this.utm_source,

                utm_medium: this.utm_medium,

                utm_campaign: this.utm_campaign,
              };

              this.checkNomineeAgeThree();
            }
          }
        }
      });
  }

  addNominee() {
    if (this.visibleAccordions < 3) {
      document
        .querySelectorAll('.accordion-collapse.show')
        .forEach((accordion) => {
          accordion.classList.remove('show');
        });
      this.accordionItems.push({ heading: '', body: '', isOpen: false });
      this.visibleAccordions++;
      // this.saveToLocalStorage();
      setTimeout(() => {
        const newAccordion = document.querySelectorAll('.accordion-collapse')[
          this.visibleAccordions - 1
        ];
        if (newAccordion) {
          newAccordion.classList.add('show');
        } else {
        }
      }, 0);
    } else {
    }
  }

  removeNominee() {
    if (this.visibleAccordions > 1) {
      this.accordionItems.pop();
      this.visibleAccordions--;
      // this.saveToLocalStorage();

      // this.save_allnomineedetails(this.visibleAccordions);

      if (this.visibleAccordions === 1) {
        this.nomineeDetails2 = [];

        this.nomineeDetails3 = [];

        this.nomineeTwoGuardian = false;
        this.nomineeThreeGuardian = false;
        this.nomineeDetails.nomineeAllocationRange = '100';
      }

      if (this.visibleAccordions === 2) {
        this.nomineeThreeGuardian = false;
      }
    }
  }

  onKeyPress(event: KeyboardEvent) {
    const char = event.key;
    const regExp = /^[A-Za-z\s]$/;
    const emojiRegExp = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/u;

    if (!regExp.test(char) || emojiRegExp.test(char)) {
      event.preventDefault();
    }
  }

  // saveToLocalStorage() {
  //   sessionStorage.setItem('accordionItems', '');
  // }
  checkPanNameChangeReverse() {
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

          if (resp.body.message === 'Data found') {
            // this.selectedIncome = response[0].AnnualIncome;
            //console.log('sdasdasd');
            //console.log(response);
            if (response[0].SupportDoc_req.toUpperCase() == 'YES') {
              this.router.navigate(['/support-document']);

            } else if (response[0].Namechangedoc_req.toUpperCase() == 'YES') {
              this.router.navigate(['/nameChange']);
            }
            else if (
              response[0].Namechangedoc_req.toUpperCase() == 'YES' &&
              response[0].tdw_namechangedoc == 'Y'
            ) {
              this.router.navigate(['/nameChange']);
            } else if (
              response[0].UploadPandoc_req.toUpperCase() == 'YES' &&
              response[0].tdw_Uploadpan == 'Y'
            ) {
              this.router.navigate(['/uploadPan']);
            }
            //incomplete
            else if (
              response[0].IsDigilocker == 0 &&
              response[0].tdw_AadhaarBack == 'Y'
            ) {
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
      this.checkPanNameChangeReverse();
      this.spinner.hide();
    }, 200);
  }

  // redirectLogin() {
  //   this.spinner.show();
  //   setTimeout(() => {
  //     const modalBackdrops = document.querySelectorAll('.modal-backdrop');
  //     modalBackdrops.forEach((backdrop) => {
  //       if (backdrop instanceof HTMLElement) {
  //         backdrop.remove();
  //       }
  //     });
  //     this.router.navigate(['/home']);
  //     this.spinner.hide();
  //   }, 2000);
  // }

  checkNomineeAge(): void {
    let nomineedob = this.nomineeDetails.nomineeOnedob;
    if (typeof nomineedob === 'string') {
      nomineedob = nomineedob.replace(/[^\d\/\-]/g, '').trim();
    } else if (nomineedob instanceof Date) {
      nomineedob = this.datePipe.transform(nomineedob, 'dd/MM/yyyy') || '';
    } else {
      return;
    }

    if (nomineedob instanceof Date) {
      this.NomineeOneDob = this.datePipe.transform(nomineedob, 'dd/MM/yyyy');
    } else {
      this.NomineeOneDob = nomineedob;
    }

    if (this.NomineeOneDob) {
      let day: number, month: number, year: number;
      if (this.NomineeOneDob.includes('/')) {
        [day, month, year] = this.NomineeOneDob.split('/').map(Number);
      } else if (this.NomineeOneDob.includes('-')) {
        [year, month, day] = this.NomineeOneDob.split('-').map(Number);
      } else {
        return;
      }
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return;
      }
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      this.ageBelow18warning = age < 18;

      if (this.ageBelow18warning === true) {
        // this.nomineeDetails.nomineeGuardianApplicantCheck = true;
        this.nomineeDetails.isNomineeMinorDisable = false;
      } else {
        this.nomineeDetails.nomineeGuardianFirstName = '';
        this.nomineeDetails.nomineeGuardianLastName = '';
        this.nomineeDetails.nomineeGuardiandob = '';
        // this.nomineeDetails.nomineeGuardianApplicantCheck = false;
        this.nomineeDetails.isNomineeMinorDisable = true;
        this.nomineeDetails.nom_guard_relation = '';
      }
      this.nomineeOneGuardian = this.ageBelow18warning;
    }

    this.nomineeDetails.nomineeisMinorCheck = this.ageBelow18warning;
  }

  checkNomineeAgeTwo(): void {
    let nomineedob = this.nomineeDetails2.nomineeOnedob;
    if (typeof nomineedob === 'string') {
      nomineedob = nomineedob.replace(/[^\d\/\-]/g, '').trim();
    } else if (nomineedob instanceof Date) {
      nomineedob = this.datePipe.transform(nomineedob, 'dd/MM/yyyy') || '';
    } else {
      return;
    }

    if (nomineedob instanceof Date) {
      this.NomineeTwoDob = this.datePipe.transform(nomineedob, 'dd/MM/yyyy');
    } else {
      this.NomineeTwoDob = nomineedob;
    }

    if (this.NomineeTwoDob) {
      let day: number, month: number, year: number;
      if (this.NomineeTwoDob.includes('/')) {
        [day, month, year] = this.NomineeTwoDob.split('/').map(Number);
      } else if (this.NomineeTwoDob.includes('-')) {
        [year, month, day] = this.NomineeTwoDob.split('-').map(Number);
      } else {
        return;
      }
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return;
      }
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      this.ageBelow18warning2 = age < 18;

      if (this.ageBelow18warning2 === true) {
        // this.nomineeDetails2.nomineeGuardianApplicantCheck = true;
        this.nomineeDetails2.isNomineeMinorDisable = false;
      } else {
        this.nomineeDetails2.nomineeGuardianFirstName = '';
        this.nomineeDetails2.nomineeGuardianLastName = '';
        this.nomineeDetails2.nomineeGuardiandob = '';
        // this.nomineeDetails2.nomineeGuardianApplicantCheck = false;
        this.nomineeDetails2.isNomineeMinorDisable = true;
        this.nomineeDetails2.nom_guard_relation = '';
      }

      this.nomineeTwoGuardian = this.ageBelow18warning2;
    }

    this.nomineeDetails2.nomineeisMinorCheck = this.ageBelow18warning2;
  }

  checkNomineeAgeThree(): void {
    let nomineedob = this.nomineeDetails3.nomineeOnedob;
    if (typeof nomineedob === 'string') {
      nomineedob = nomineedob.replace(/[^\d\/\-]/g, '').trim();
    } else if (nomineedob instanceof Date) {
      nomineedob = this.datePipe.transform(nomineedob, 'dd/MM/yyyy') || '';
    } else {
      return;
    }

    if (nomineedob instanceof Date) {
      this.NomineeThreeDob = this.datePipe.transform(nomineedob, 'dd/MM/yyyy');
    } else {
      this.NomineeThreeDob = nomineedob;
    }

    if (this.NomineeThreeDob) {
      let day: number, month: number, year: number;
      if (this.NomineeThreeDob.includes('/')) {
        [day, month, year] = this.NomineeThreeDob.split('/').map(Number);
      } else if (this.NomineeThreeDob.includes('-')) {
        [year, month, day] = this.NomineeThreeDob.split('-').map(Number);
      } else {
        return;
      }
      if (isNaN(day) || isNaN(month) || isNaN(year)) {
        return;
      }
      const birthDate = new Date(year, month - 1, day);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDifference = today.getMonth() - birthDate.getMonth();

      if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
      ) {
        age--;
      }
      this.ageBelow18warning3 = age < 18;

      if (this.ageBelow18warning3 === true) {
        // this.nomineeDetails3.nomineeGuardianApplicantCheck = true;
        this.nomineeDetails3.isNomineeMinorDisable = false;
      } else {
        this.nomineeDetails3.nomineeGuardianFirstName = '';
        this.nomineeDetails3.nomineeGuardianLastName = '';
        this.nomineeDetails3.nomineeGuardiandob = '';
        this.nomineeDetails3.nomineeGuardianApplicantCheck = false;
        this.nomineeDetails3.isNomineeMinorDisable = true;
        this.nomineeDetails3.nom_guard_relation = '';
      }

      this.nomineeThreeGuardian = this.ageBelow18warning3;
    }

    this.nomineeDetails3.nomineeisMinorCheck = this.ageBelow18warning;
  }

  redirectToTwo() {
    this.spinner.show();
    setTimeout(() => {
      this.PersonalFormOne = false;
      this.PersonalFormTwo = true;
      this.router.navigate(['/addNominee', 2]);
      this.spinner.hide();
    }, 200);
  }

  BackToOne() {
    this.spinner.show();

    setTimeout(() => {
      this.PersonalFormOne = true;
      this.PersonalFormTwo = false;

      this.router.navigate(['/addNominee', 1]);

      this.spinner.hide();
    }, 200);
  }

  getNomineeGuardianDetails() {
    var reqData = {
      flag: 'all',
      rmloginid: '10882',
    };
    this._http.postRequest('api/v1/masters/get', reqData).subscribe((resp) => {
      let response: any = resp.body;
      if (response.status == true) {
        response = JSON.parse(
          this.aesService.decrypt(response.data, this.clientid, this.clientid)
        );
      }
      this.PersonalResponse = response;
      this.guardianListResponse = this.PersonalResponse.data3;
      this.NomineeOneResponse = this.PersonalResponse.data5;
      this.NomineeOneProofResponse = this.PersonalResponse.data4;

      // console.log('check nominee regex' + this.NomineeOneProofResponse[0].Regex_Validation)

      this.CityStateResponse = this.PersonalResponse.data18;

      this.NomineeTwoResponse = this.PersonalResponse.data3;
      this.NomineeThreeResponse = this.PersonalResponse.data3;
    });
  }

  // Nominee1 validation
  Nominee1Validation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    this.nomineeDetails.nomineefname =
      this.nomineeDetails.nomineefname?.replace(emojiRegex, '') || '';

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.Nominee1FSpecial = specialCharRegex.test(
      this.nomineeDetails.nomineefname
    );

    this.Nominee1FDigit = /\d/.test(this.nomineeDetails.nomineefname);

    this.Nominee1FSpace = this.nomineeDetails.nomineefname.trim().length === 0;

    this.Nominee1FName = this.nomineeDetails.nomineefname.length === 0;

    this.Nominee1SameAsFirst =
      this.nomineeDetails.nomineefname === this.nomineeDetails.nomineelname;
  }

  checkInput(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    //console.log('checkInput event value', value);
    // this.nomineeDetails.nomineefname = value;
  }

  Nominee1LastValidation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.nomineeDetails.nomineelname =
      this.nomineeDetails.nomineelname?.replace(emojiRegex, '') || '';

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.Nominee1LSpecial = specialCharRegex.test(
      this.nomineeDetails.nomineelname
    );
    this.Nominee1LDigit = /\d/.test(this.nomineeDetails.nomineelname);

    this.Nominee1LSpace = this.nomineeDetails.nomineelname.trim().length === 0;
    this.Nominee1LName = this.nomineeDetails.nomineelname.length === 0;

    this.Nominee1SameAsFirst =
      this.nomineeDetails.nomineefname === this.nomineeDetails.nomineelname;
  }

  // Nominee2 validation
  Nominee2Validation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    this.nomineeDetails2.nomineefname =
      this.nomineeDetails2.nomineefname?.replace(emojiRegex, '') || '';

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.Nominee1FSpecial = specialCharRegex.test(
      this.nomineeDetails2.nomineefname
    );

    this.Nominee2FDigit = /\d/.test(this.nomineeDetails2.nomineefname);

    this.Nominee2FSpace = this.nomineeDetails2.nomineefname.trim().length === 0;

    this.Nominee2FName = this.nomineeDetails2.nomineefname.length === 0;

    this.Nominee2SameAsFirst =
      this.nomineeDetails2.nomineefname === this.nomineeDetails2.nomineelname;
  }

  Nominee2LastValidation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.nomineeDetails2.nomineelname =
      this.nomineeDetails2.nomineelname?.replace(emojiRegex, '') || '';

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.Nominee2LSpecial = specialCharRegex.test(
      this.nomineeDetails2.nomineelname
    );
    this.Nominee2LDigit = /\d/.test(this.nomineeDetails2.nomineelname);

    this.Nominee2LSpace = this.nomineeDetails2.nomineelname.trim().length === 0;
    this.Nominee2LName = this.nomineeDetails2.nomineelname.length === 0;

    this.Nominee2SameAsFirst =
      this.nomineeDetails2.nomineefname === this.nomineeDetails2.nomineelname;
  }

  // Nominee3 validation
  Nominee3Validation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    this.nomineeDetails3.nomineefname =
      this.nomineeDetails3.nomineefname?.replace(emojiRegex, '') || '';

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.Nominee3FSpecial = specialCharRegex.test(
      this.nomineeDetails3.nomineefname
    );

    this.Nominee3FDigit = /\d/.test(this.nomineeDetails3.nomineefname);

    this.Nominee3FSpace = this.nomineeDetails3.nomineefname.trim().length === 0;

    this.Nominee3FName = this.nomineeDetails3.nomineefname.length === 0;

    this.Nominee3SameAsFirst =
      this.nomineeDetails3.nomineefname === this.nomineeDetails3.nomineelname;
  }

  Nominee3LastValidation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.nomineeDetails3.nomineelname =
      this.nomineeDetails3.nomineelname?.replace(emojiRegex, '') || '';

    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.Nominee3LSpecial = specialCharRegex.test(
      this.nomineeDetails3.nomineelname
    );
    this.Nominee3LDigit = /\d/.test(this.nomineeDetails3.nomineelname);

    this.Nominee3LSpace = this.nomineeDetails3.nomineelname.trim().length === 0;
    this.Nominee3LName = this.nomineeDetails3.nomineelname.length === 0;

    this.Nominee3SameAsFirst =
      this.nomineeDetails3.nomineefname === this.nomineeDetails3.nomineelname;
  }

  //  Nominee new regulatory changes added by Nitesh S on 28022025 Start

  openModal() {
    $('#confirmPref').modal('show');
  }

  terminateModal() {
    //this.nomineeoptout = true
    this.save_optoutstatus('Yes');
  }

  DoNotChange() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });

    this.redirectToTwo();
  }

  NomMobVal1() {
    if (this.nomineeDetails.NomTrdMobile.length < 10) {
      this.Nominee1Mobilerror = true;
      return false;
    } else {
      this.Nominee1Mobilerror = false;
    }
    return true;
  }
  NomGuarMobVal1() {
    if (this.nomineeDetails.nomineeGuardianMobile.length < 10) {
      this.Nominee1GuarMobilerror = true;
      return false;
    } else {
      this.Nominee1GuarMobilerror = false;
    }
    return true;
  }

  NomMobVal2() {
    if (this.nomineeDetails2.NomTrdMobile.length < 10) {
      this.Nominee2Mobilerror = true;
      return false;
    } else {
      this.Nominee2Mobilerror = false;
    }
    return true;
  }
  NomGuarMobVal2() {
    if (this.nomineeDetails2.nomineeGuardianMobile.length < 10) {
      this.Nominee2GuarMobilerror = true;
      return false;
    } else {
      this.Nominee2GuarMobilerror = false;
    }
    return true;
  }
  NomMobVal3() {
    if (this.nomineeDetails3.NomTrdMobile.length < 10) {
      this.Nominee3Mobilerror = true;
      return false;
    } else {
      this.Nominee3Mobilerror = false;
    }
    return true;
  }
  NomGuarMobVal3() {
    if (this.nomineeDetails3.nomineeGuardianMobile.length < 10) {
      this.Nominee3GuarMobilerror = true;
      return false;
    } else {
      this.Nominee3GuarMobilerror = false;
    }
    return true;
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
    return isValidFormat;
  }

  checkAtSymbolCount(inputString: string): number {
    return (inputString.match(/@/g) || []).length;
  }

  validateGuarEmail1() {
    var symbcount = this.checkAtSymbolCount(
      this.nomineeDetails.nomineeGuardianEmail
    );
    if (symbcount > 1) {
      this.emailmultiplesymbGuar1 = true;
      return false;
    } else {
      this.emailmultiplesymbGuar1 = false;
    }
    this.emailReqGuar1 = this.nomineeDetails.nomineeGuardianEmail.length === 0;
    this.emailFormatValGuar1 =
      !this.emailReq1 &&
      !this.isEmailValid(this.nomineeDetails.nomineeGuardianEmail);

    if (this.emailFormatValGuar1) {
      return false;
    }

    this.emailspecialcharsGuar1 = this.checkEmailSecialchars(
      this.nomineeDetails.nomineeGuardianEmail
    );

    if (this.emailspecialcharsGuar1) {
      return false;
    }

    if (this.nomineeDetails.nomineeGuardianEmail) {
      this.isEmailDisableBtnGuar1 = false;
    } else {
      this.isEmailDisableBtnGuar1 = true;
      return false;
    }

    return true;
  }

  validateEmail1() {
    var symbcount = this.checkAtSymbolCount(this.nomineeDetails.NomEmailID);
    if (symbcount > 1) {
      this.emailmultiplesymb1 = true;
      return false;
    } else {
      this.emailmultiplesymb1 = false;
    }
    this.emailReq1 = this.nomineeDetails.NomEmailID.length === 0;
    this.emailFormatVal1 =
      !this.emailReq1 && !this.isEmailValid(this.nomineeDetails.NomEmailID);

    if (this.emailFormatVal1) {
      return false;
    }

    this.emailspecialchars1 = this.checkEmailSecialchars(
      this.nomineeDetails.NomEmailID
    );

    if (this.emailspecialchars1) {
      return false;
    }

    if (this.nomineeDetails.NomEmailID) {
      this.isEmailDisableBtn1 = false;
    } else {
      this.isEmailDisableBtn1 = true;
      return false;
    }

    return true;
  }
  validateEmail2() {
    var symbcount = this.checkAtSymbolCount(this.nomineeDetails2.NomEmailID);
    if (symbcount > 1) {
      this.emailmultiplesymb2 = true;
      return false;
    } else {
      this.emailmultiplesymb2 = false;
    }
    this.emailReq2 = this.nomineeDetails2.NomEmailID.length === 0;
    this.emailFormatVal2 =
      !this.emailReq2 && !this.isEmailValid(this.nomineeDetails2.NomEmailID);

    if (this.emailFormatVal2) {
      return false;
    }

    this.emailspecialchars2 = this.checkEmailSecialchars(
      this.nomineeDetails2.NomEmailID
    );

    if (this.emailspecialchars2) {
      return false;
    }

    if (this.nomineeDetails2.NomEmailID) {
      this.isEmailDisableBtn2 = false;
    } else {
      this.isEmailDisableBtn2 = true;
      return false;
    }

    return true;
  }
  validateGuarEmail2() {
    var symbcount = this.checkAtSymbolCount(
      this.nomineeDetails2.nomineeGuardianEmail
    );
    if (symbcount > 1) {
      this.emailmultiplesymbGuar2 = true;
      return false;
    } else {
      this.emailmultiplesymbGuar2 = false;
    }
    this.emailReqGuar2 = this.nomineeDetails2.nomineeGuardianEmail.length === 0;
    this.emailFormatValGuar2 =
      !this.emailReq1 &&
      !this.isEmailValid(this.nomineeDetails2.nomineeGuardianEmail);

    if (this.emailFormatValGuar2) {
      return false;
    }

    this.emailspecialcharsGuar2 = this.checkEmailSecialchars(
      this.nomineeDetails2.nomineeGuardianEmail
    );

    if (this.emailspecialcharsGuar2) {
      return false;
    }

    if (this.nomineeDetails2.nomineeGuardianEmail) {
      this.isEmailDisableBtnGuar2 = false;
    } else {
      this.isEmailDisableBtnGuar2 = true;
      return false;
    }

    return true;
  }

  validateEmail3() {
    var symbcount = this.checkAtSymbolCount(this.nomineeDetails3.NomEmailID);
    if (symbcount > 1) {
      this.emailmultiplesymb3 = true;
      return false;
    } else {
      this.emailmultiplesymb3 = false;
    }
    this.emailReq3 = this.nomineeDetails3.NomEmailID.length === 0;
    this.emailFormatVal3 =
      !this.emailReq3 && !this.isEmailValid(this.nomineeDetails3.NomEmailID);

    if (this.emailFormatVal3) {
      return false;
    }

    this.emailspecialchars3 = this.checkEmailSecialchars(
      this.nomineeDetails3.NomEmailID
    );

    if (this.emailspecialchars3) {
      return false;
    }

    if (this.nomineeDetails3.NomEmailID) {
      this.isEmailDisableBtn3 = false;
    } else {
      this.isEmailDisableBtn3 = true;
    }

    return true;
  }
  validateGuarEmail3() {
    var symbcount = this.checkAtSymbolCount(
      this.nomineeDetails3.nomineeGuardianEmail
    );
    if (symbcount > 1) {
      this.emailmultiplesymbGuar3 = true;
      return false;
    } else {
      this.emailmultiplesymbGuar3 = false;
    }
    this.emailReqGuar3 = this.nomineeDetails3.nomineeGuardianEmail.length === 0;
    this.emailFormatValGuar3 =
      !this.emailReq1 &&
      !this.isEmailValid(this.nomineeDetails3.nomineeGuardianEmail);

    if (this.emailFormatValGuar3) {
      return false;
    }

    this.emailspecialcharsGuar3 = this.checkEmailSecialchars(
      this.nomineeDetails3.nomineeGuardianEmail
    );

    if (this.emailspecialcharsGuar3) {
      return false;
    }

    if (this.nomineeDetails3.nomineeGuardianEmail) {
      this.isEmailDisableBtnGuar3 = false;
    } else {
      this.isEmailDisableBtnGuar3 = true;
      return false;
    }

    return true;
  }
  focusOutFunction1() {
    this.validateEmail1();
  }
  focusOutFunctionGuar1() {
    this.validateGuarEmail1();
  }
  focusOutFunction2() {
    this.validateEmail2();
  }
  focusOutFunctionGuar2() {
    this.validateGuarEmail2();
  }
  focusOutFunction3() {
    this.validateEmail3();
  }
  focusOutFunctionGuar3() {
    this.validateGuarEmail3();
  }
  nomineeprooftypeval1(event: any): void {
    const Nomineeproofvalue = event.target.value;
    if (Nomineeproofvalue == '') {
      this.Nominee1Prooftype = true;
    } else {
      this.Nominee1Prooftype = false;
    }
  }
  nomineeguarprooftypeval1(event: any): void {
    const Nomineeproofvalue = event.target.value;
    if (Nomineeproofvalue == '') {
      this.NomineeGuar1Prooftype = true;
    } else {
      this.NomineeGuar1Prooftype = false;
    }
  }
  nomineeprooftypeval2(event: any): void {
    const Nomineeproofvalue = event.target.value;
    if (Nomineeproofvalue == '') {
      this.Nominee2Prooftype = true;
    } else {
      this.Nominee2Prooftype = false;
    }
  }
  nomineeguarprooftypeval2(event: any): void {
    const Nomineeproofvalue = event.target.value;
    if (Nomineeproofvalue == '') {
      this.NomineeGuar2Prooftype = true;
    } else {
      this.NomineeGuar2Prooftype = false;
    }
  }

  nomineeprooftypeval3(event: any): void {
    const Nomineeproofvalue = event.target.value;
    if (Nomineeproofvalue == '') {
      this.Nominee3Prooftype = true;
    } else {
      this.Nominee3Prooftype = false;
    }
  }
  nomineeguarprooftypeval3(event: any): void {
    const Nomineeproofvalue = event.target.value;
    if (Nomineeproofvalue == '') {
      this.NomineeGuar3Prooftype = true;
    } else {
      this.NomineeGuar3Prooftype = false;
    }
  }

  nomineeidproofval1() {
    // const nomineproofregex1 = this.NomineeOneProofResponse[0].Regex_Validation;
    // const nomineproofregex2 = this.NomineeOneProofResponse[1].Regex_Validation;
    // const nomineproofregex3 = this.NomineeOneProofResponse[2].Regex_Validation;

    const nomineproofregex1 = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    // const nomineproofregex2 = /^[A-Za-z]{2}[0-9A-Za-z]{8}$/;
    const nomineproofregex2 =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    const nomineproofregex3 = /^[0-9]{4}$/;
    const nomineproofregex4 = /^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/;

    // console.log('voter id'+  typeof pattern +' test '+ typeof this.NomineeOneProofResponse[0].Regex_Validation)

    if (this.nomineeDetails.nomineeprooftype) {
      this.Nominee1Prooftype = false;
    } else {
      this.Nominee1Prooftype = true;
    }

    if (this.nomineeDetails.nomineeprooftype == 'Pan') {
      // this.Nominee1ProofIdNo = false
      this.Nominee1adharmsg = false;

      if (!nomineproofregex1.test(this.nomineeDetails.nomineeproofnumber)) {
        this.Nominee1ProofIdNo = true;
      } else {
        this.Nominee1ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails.nomineeprooftype == 'Valid Driving License') {
      // this.Nominee1ProofIdNo = false
      this.Nominee1adharmsg = false;

      if (!nomineproofregex2.test(this.nomineeDetails.nomineeproofnumber)) {
        this.Nominee1ProofIdNo = true;
      } else {
        this.Nominee1ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails.nomineeprooftype == 'Aadhaar') {
      // this.Nominee1adharmsg = true
      this.Nominee1ProofIdNo = false;

      if (!nomineproofregex3.test(this.nomineeDetails.nomineeproofnumber)) {
        // this.Nominee1ProofIdNo = true
        this.Nominee1adharmsg = true;
      } else {
        this.Nominee1adharmsg = false;
        return true;
      }
    }
    if (this.nomineeDetails.nomineeprooftype == 'Valid Passport') {
      this.Nominee1adharmsg = false;
      // this.Nominee1ProofIdNo = false
      if (!nomineproofregex4.test(this.nomineeDetails.nomineeproofnumber)) {
        // this.Nominee1ProofIdNo = true
        this.Nominee1ProofIdNo = true;
      } else {
        this.Nominee1ProofIdNo = false;
        return true;
      }
    }
    return false;
  }
  nomineeguaridproofval1() {
    // const nomineproofregex1 = this.NomineeOneProofResponse[0].Regex_Validation;
    // const nomineproofregex2 = this.NomineeOneProofResponse[1].Regex_Validation;
    // const nomineproofregex3 = this.NomineeOneProofResponse[2].Regex_Validation;

    const nomineproofregex1 = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    // const nomineproofregex2 = /^[A-Za-z]{2}[0-9A-Za-z]{8}$/;
    const nomineproofregex2 =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    const nomineproofregex3 = /^[0-9]{4}$/;
    const nomineproofregex4 = /^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/;

    // console.log('voter id'+  typeof pattern +' test '+ typeof this.NomineeOneProofResponse[0].Regex_Validation)

    if (this.nomineeDetails.nomineeGuardianProofType) {
      this.NomineeGuar1Prooftype = false;
    } else {
      this.NomineeGuar1Prooftype = true;
    }

    if (this.nomineeDetails.nomineeGuardianProofType == 'Pan') {
      this.NomineeGuar1adharmsg = false;
      if (
        !nomineproofregex1.test(this.nomineeDetails.nomineeGuardianProofnumber)
      ) {
        this.NomineeGuar1ProofIdNo = true;
      } else {
        this.NomineeGuar1ProofIdNo = false;
        return true;
      }
    }

    if (
      this.nomineeDetails.nomineeGuardianProofType == 'Valid Driving License'
    ) {
      this.NomineeGuar1adharmsg = false;

      if (
        !nomineproofregex2.test(this.nomineeDetails.nomineeGuardianProofnumber)
      ) {
        this.NomineeGuar1ProofIdNo = true;
      } else {
        this.NomineeGuar1ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails.nomineeGuardianProofType == 'Aadhaar') {
      // this.Nominee1adharmsg = true
      this.NomineeGuar1ProofIdNo = false;
      if (
        !nomineproofregex3.test(this.nomineeDetails.nomineeGuardianProofnumber)
      ) {
        // this.Nominee1ProofIdNo = true
        this.NomineeGuar1adharmsg = true;
      } else {
        this.NomineeGuar1adharmsg = false;
        return true;
      }
    }
    if (this.nomineeDetails.nomineeGuardianProofType == 'Valid Passport') {
      // this.Nominee1adharmsg = true
      this.NomineeGuar1adharmsg = false;
      if (
        !nomineproofregex4.test(this.nomineeDetails.nomineeGuardianProofnumber)
      ) {
        // this.Nominee1ProofIdNo = true
        this.NomineeGuar1ProofIdNo = true;
      } else {
        this.NomineeGuar1ProofIdNo = false;
        return true;
      }
    }
    return false;
  }
  nomineeidproofval2() {
    // const nomineproofregex1 = this.NomineeOneProofResponse[0].Regex_Validation;
    // const nomineproofregex2 = this.NomineeOneProofResponse[1].Regex_Validation;
    // const nomineproofregex3 = this.NomineeOneProofResponse[2].Regex_Validation;

    const nomineproofregex1 = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    // const nomineproofregex2 = /^[A-Za-z]{2}[0-9A-Za-z]{8}$/;
    const nomineproofregex2 =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    const nomineproofregex3 = /^[0-9]{4}$/;
    const nomineproofregex4 = /^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/;

    // console.log('voter id'+  typeof pattern +' test '+ typeof this.NomineeOneProofResponse[0].Regex_Validation)

    if (this.nomineeDetails2.nomineeprooftype) {
      this.Nominee2Prooftype = false;
    } else {
      this.Nominee2Prooftype = true;
    }

    if (this.nomineeDetails2.nomineeprooftype == 'Pan') {
      this.Nominee2adharmsg = false;
      if (!nomineproofregex1.test(this.nomineeDetails2.nomineeproofnumber)) {
        this.Nominee2ProofIdNo = true;
      } else {
        this.Nominee2ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails2.nomineeprooftype == 'Valid Driving License') {
      this.Nominee2adharmsg = false;
      if (!nomineproofregex2.test(this.nomineeDetails2.nomineeproofnumber)) {
        this.Nominee2ProofIdNo = true;
      } else {
        this.Nominee2ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails2.nomineeprooftype == 'Aadhaar') {
      // this.Nominee2adharmsg = true
      this.Nominee2ProofIdNo = false;
      if (!nomineproofregex3.test(this.nomineeDetails2.nomineeproofnumber)) {
        // this.Nominee2ProofIdNo = true
        this.Nominee2adharmsg = true;
      } else {
        this.Nominee2adharmsg = false;
        return true;
      }
    }
    // console.log("validpassrowrq")
    if (this.nomineeDetails2.nomineeprooftype == 'Valid Passport') {
      // this.Nominee1adharmsg = true
      this.Nominee1adharmsg = false;
      if (!nomineproofregex4.test(this.nomineeDetails2.nomineeproofnumber)) {
        // this.Nominee1ProofIdNo = true
        // console.log("validpasuuuuuu")

        this.Nominee2ProofIdNo = true;
      } else {
        this.Nominee2ProofIdNo = false;
        return true;
      }
    }

    return false;
  }
  nomineeguaridproofval2() {
    // const nomineproofregex1 = this.NomineeOneProofResponse[0].Regex_Validation;
    // const nomineproofregex2 = this.NomineeOneProofResponse[1].Regex_Validation;
    // const nomineproofregex3 = this.NomineeOneProofResponse[2].Regex_Validation;

    const nomineproofregex1 = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    // const nomineproofregex2 = /^[A-Za-z]{2}[0-9A-Za-z]{8}$/;
    const nomineproofregex2 =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    const nomineproofregex3 = /^[0-9]{4}$/;
    const nomineproofregex4 = /^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/;

    // console.log('voter id'+  typeof pattern +' test '+ typeof this.NomineeOneProofResponse[0].Regex_Validation)

    if (this.nomineeDetails2.nomineeGuardianProofType) {
      this.NomineeGuar2Prooftype = false;
    } else {
      this.NomineeGuar2Prooftype = true;
    }

    if (this.nomineeDetails2.nomineeGuardianProofType == 'Pan') {
      this.NomineeGuar2adharmsg = false;
      if (
        !nomineproofregex1.test(this.nomineeDetails2.nomineeGuardianProofnumber)
      ) {
        this.NomineeGuar2ProofIdNo = true;
      } else {
        this.NomineeGuar2ProofIdNo = false;
        return true;
      }
    }

    if (
      this.nomineeDetails2.nomineeGuardianProofType == 'Valid Driving License'
    ) {
      this.NomineeGuar2adharmsg = false;
      if (
        !nomineproofregex2.test(this.nomineeDetails2.nomineeGuardianProofnumber)
      ) {
        this.NomineeGuar2ProofIdNo = true;
      } else {
        this.NomineeGuar2ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails2.nomineeGuardianProofType == 'Aadhaar') {
      // this.Nominee1adharmsg = true
      this.NomineeGuar2ProofIdNo = false;
      if (
        !nomineproofregex3.test(this.nomineeDetails2.nomineeGuardianProofnumber)
      ) {
        // this.Nominee2ProofIdNo = true
        this.NomineeGuar2adharmsg = true;
      } else {
        this.NomineeGuar2adharmsg = false;
        return true;
      }
    }
    if (this.nomineeDetails2.nomineeGuardianProofType == 'Valid Passport') {
      // this.Nominee1adharmsg = true
      this.NomineeGuar2adharmsg = false;
      if (
        !nomineproofregex4.test(this.nomineeDetails2.nomineeGuardianProofnumber)
      ) {
        // this.Nominee2ProofIdNo = true
        this.NomineeGuar2ProofIdNo = true;
      } else {
        this.NomineeGuar2ProofIdNo = false;
        return true;
      }
    }
    return false;
  }
  nomineeidproofval3() {
    // const nomineproofregex1 = this.NomineeOneProofResponse[0].Regex_Validation;
    // const nomineproofregex2 = this.NomineeOneProofResponse[1].Regex_Validation;
    // const nomineproofregex3 = this.NomineeOneProofResponse[2].Regex_Validation;

    const nomineproofregex1 = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    // const nomineproofregex2 = /^[A-Za-z]{2}[0-9A-Za-z]{8}$/;
    const nomineproofregex2 =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    const nomineproofregex3 = /^[0-9]{4}$/;
    const nomineproofregex4 = /^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/;

    // console.log('voter id'+  typeof pattern +' test '+ typeof this.NomineeOneProofResponse[0].Regex_Validation)

    if (this.nomineeDetails3.nomineeprooftype) {
      this.Nominee3Prooftype = false;
    } else {
      this.Nominee3Prooftype = true;
    }

    if (this.nomineeDetails3.nomineeprooftype == 'Pan') {
      this.Nominee3adharmsg = false;
      if (!nomineproofregex1.test(this.nomineeDetails3.nomineeproofnumber)) {
        this.Nominee3ProofIdNo = true;
      } else {
        this.Nominee3ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails3.nomineeprooftype == 'Valid Driving License') {
      this.Nominee3adharmsg = false;
      if (!nomineproofregex2.test(this.nomineeDetails3.nomineeproofnumber)) {
        this.Nominee3ProofIdNo = true;
      } else {
        this.Nominee3ProofIdNo = false;
        return true;
      }
    }

    if (this.nomineeDetails3.nomineeprooftype == 'Aadhaar') {
      // this.Nominee3adharmsg = true
      this.Nominee3ProofIdNo = false;

      if (!nomineproofregex3.test(this.nomineeDetails3.nomineeproofnumber)) {
        // this.Nominee3ProofIdNo = true
        this.Nominee3adharmsg = true;
      } else {
        this.Nominee3adharmsg = false;
        return true;
      }
    }
    if (this.nomineeDetails3.nomineeprooftype == 'Valid Passport') {
      // this.Nominee1adharmsg = true
      this.Nominee3adharmsg = false;

      if (!nomineproofregex4.test(this.nomineeDetails3.nomineeproofnumber)) {
        // this.Nominee1ProofIdNo = true
        this.Nominee3ProofIdNo = true;
      } else {
        this.Nominee3ProofIdNo = false;
        return true;
      }
    }

    return false;
  }
  nomineeguaridproofval3() {
    // const nomineproofregex1 = this.NomineeOneProofResponse[0].Regex_Validation;
    // const nomineproofregex2 = this.NomineeOneProofResponse[1].Regex_Validation;
    // const nomineproofregex3 = this.NomineeOneProofResponse[2].Regex_Validation;
    const nomineproofregex1 = /^[A-Za-z]{5}[0-9]{4}[A-Za-z]$/;
    // const nomineproofregex2 = /^[A-Za-z]{2}[0-9A-Za-z]{8}$/;
    const nomineproofregex2 =
      /^(([A-Z]{2}[0-9]{2})( )|([A-Z]{2}-[0-9]{2}))((19|20)[0-9][0-9])[0-9]{7}$/;
    const nomineproofregex3 = /^[0-9]{4}$/;
    const nomineproofregex4 = /^[A-Za-z0-9](?:[A-Za-z0-9 -]*[A-Za-z0-9])?$/;

    // console.log('voter id'+  typeof pattern +' test '+ typeof this.NomineeOneProofResponse[0].Regex_Validation)

    if (this.nomineeDetails3.nomineeGuardianProofType) {
      this.NomineeGuar3Prooftype = false;
    } else {
      this.NomineeGuar3Prooftype = true;
    }

    if (this.nomineeDetails3.nomineeGuardianProofType == 'Pan') {
      this.NomineeGuar3adharmsg = false;
      if (
        !nomineproofregex1.test(this.nomineeDetails3.nomineeGuardianProofnumber)
      ) {
        this.NomineeGuar3ProofIdNo = true;
      } else {
        this.NomineeGuar3ProofIdNo = false;
        return true;
      }
    }

    if (
      this.nomineeDetails3.nomineeGuardianProofType == 'Valid Driving License'
    ) {
      this.NomineeGuar3adharmsg = false;
      // console.log("yaha aaya")
      if (
        !nomineproofregex2.test(this.nomineeDetails3.nomineeGuardianProofnumber)
      ) {
        this.NomineeGuar3ProofIdNo = true;
      } else {
        this.NomineeGuar3ProofIdNo = false;
        // console.log("yaha bhi aaya")

        return true;
      }
    }

    if (this.nomineeDetails3.nomineeGuardianProofType == 'Aadhaar') {
      // this.Nominee1adharmsg = true
      this.NomineeGuar3ProofIdNo = false;

      if (
        !nomineproofregex3.test(this.nomineeDetails3.nomineeGuardianProofnumber)
      ) {
        // this.Nominee3ProofIdNo = true
        this.NomineeGuar3adharmsg = true;
      } else {
        this.NomineeGuar3adharmsg = false;
        return true;
      }
    }
    if (this.nomineeDetails3.nomineeGuardianProofType == 'Valid Passport') {
      this.NomineeGuar3adharmsg = false;

      if (
        !nomineproofregex4.test(this.nomineeDetails3.nomineeGuardianProofnumber)
      ) {
        // this.Nominee3ProofIdNo = true
        this.NomineeGuar3ProofIdNo = true;
      } else {
        this.NomineeGuar3ProofIdNo = false;
        return true;
      }
    }
    return false;
  }
  //  Nominee new regulatory changes added by Nitesh S on 28022025 End

  Nominee1RelationValidation(event: any): void {
    const nom1Relation = event.target.value;
    if (nom1Relation == '') {
      this.Nominee1Relation = true;
    } else {
      this.Nominee1Relation = false;
    }
  }

  Nominee2RelationValidation(event: any): void {
    const nom2Relation = event.target.value;
    if (nom2Relation == '') {
      this.Nominee2Relation = true;
    } else {
      this.Nominee2Relation = false;
    }
  }

  Nominee3RelationValidation(event: any): void {
    const nom3Relation = event.target.value;
    if (nom3Relation == '') {
      this.Nominee3Relation = true;
    } else {
      this.Nominee3Relation = false;
    }
  }

  enteredAllocation(event: any, flag: string) {
    let inputValue = event.target.value;

    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    inputValue = inputValue.replace(emojiRegex, '');
    const pattern = /^[0-9]*$/;

    if (!pattern.test(inputValue)) {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }
    event.target.value = inputValue;
    const nom1Allocation = inputValue;
    const percent1 = parseInt(this.nomineeDetails.nomineeAllocationRange);

    if (percent1 > 100) {
      inputValue = '';

      this.nomineeDetails.nomineeAllocationRange = inputValue;
    }

    if (flag === 'fout') {
      if (nom1Allocation === '') {
        this.Nominee1Allocation = true;
      } else {
        this.Nominee1Allocation = false;
      }
    } else {
      this.Nominee1Allocation = false;
    }

    if (percent1 > 100) {
      this.Nominee1AllocationPer = true;
    } else if (isNaN(percent1)) {
      this.Nominee1AllocationPer = false;
    } else {
      this.Nominee1AllocationPer = false;
    }
  }

  enteredAllocation2(event: any, flag: string) {
    let inputValue = event.target.value;

    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    inputValue = inputValue.replace(emojiRegex, '');
    const pattern = /^[0-9]*$/;

    if (!pattern.test(inputValue)) {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }
    event.target.value = inputValue;
    const nom1Allocation = inputValue;
    const percent1 = parseInt(this.nomineeDetails2.nomineeAllocationRange);

    if (flag === 'fout') {
      if (nom1Allocation === '') {
        this.Nominee2Allocation = true;
      } else {
        this.Nominee2Allocation = false;
      }
    } else {
      this.Nominee2Allocation = false;
    }

    // if (percent1 > 100) {
    //   this.Nominee1AllocationPer = true;
    // } else {
    //   this.Nominee1AllocationPer = false;
    // }
  }

  enteredAllocation3(event: any, flag: string) {
    let inputValue = event.target.value;

    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    inputValue = inputValue.replace(emojiRegex, '');
    const pattern = /^[0-9]*$/;

    if (!pattern.test(inputValue)) {
      inputValue = inputValue.replace(/[^0-9]/g, '');
    }
    event.target.value = inputValue;
    const nom1Allocation = inputValue;
    const percent1 = parseInt(this.nomineeDetails3.nomineeAllocationRange);

    if (flag === 'fout') {
      if (nom1Allocation === '') {
        this.Nominee3Allocation = true;
      } else {
        this.Nominee3Allocation = false;
      }
    } else {
      this.Nominee3Allocation = false;
    }
    // if (percent1 > 100) {
    //   this.Nominee1AllocationPer = true;
    // } else {
    //   this.Nominee1AllocationPer = false;
    // }
  }

  // Nominee1AddLine1Validation(): void {
  //   const address1 = this.nomineeDetails.nomineeAddress1?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  //   const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

  //   this.Nominee1AddLine1Space = address1.length === 0;
  //   this.Nominee1AddLine1 = specialCharRegex.test(address1) || emojiRegex.test(address1);
  // }

  // Nominee1AddLine2Validation(): void {
  //   const address2 = this.nomineeDetails.nomineeAddress2?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   this.Nominee1AddLine2Space = address2.length === 0;
  //   this.nomineeDetails.nomineeAddress2 = address2.replace(emojiRegex, '');
  // }

  // Nominee1AddLine3Validation(): void {
  //   const address3 = this.nomineeDetails.nomineeAddress3?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   this.Nominee1AddLine3Space = address3.length === 0;
  //   this.nomineeDetails.nomineeAddress3 = address3.replace(emojiRegex, '');
  // }

  // ADDED BY NITESH FOR FUTURE IMPLIMNET
  NomineeAddressValidation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    //Nominee 1 Address
    const nom1address1 = this.nomineeDetails.nomineeAddress1?.trim() || '';
    const nom1address2 = this.nomineeDetails.nomineeAddress2?.trim() || '';
    const nom1address3 = this.nomineeDetails.nomineeAddress3?.trim() || '';

    if (nom1address1) {
      this.Nominee1AddLine1Space = nom1address1.length === 0;
      this.Nominee1AddLine1 =
        specialCharRegex.test(nom1address1) || emojiRegex.test(nom1address1);
    }

    if (nom1address2) {
      this.Nominee1AddLine2Space = nom1address2.length === 0;
      this.nomineeDetails.nomineeAddress2 = nom1address2.replace(
        emojiRegex,
        ''
      );
    }

    if (nom1address3) {
      this.Nominee1AddLine3Space = nom1address3.length === 0;
      this.nomineeDetails.nomineeAddress3 = nom1address3.replace(
        emojiRegex,
        ''
      );
    }

    //Nominee 2 Address
    const nom2address1 = this.nomineeDetails2.nomineeAddress1?.trim() || '';
    const nom2address2 = this.nomineeDetails2.nomineeAddress2?.trim() || '';
    const nom2address3 = this.nomineeDetails2.nomineeAddress3?.trim() || '';

    if (nom2address1) {
      this.Nominee1AddLine1Space = nom2address1.length === 0;
      this.Nominee2AddLine1 =
        specialCharRegex.test(nom2address1) || emojiRegex.test(nom2address1);
    }

    if (nom2address2) {
      this.Nominee1AddLine2Space = nom2address2.length === 0;
      this.nomineeDetails2.nomineeAddress2 = nom2address2.replace(
        emojiRegex,
        ''
      );
    }

    if (nom2address3) {
      this.Nominee1AddLine3Space = nom2address3.length === 0;
      this.nomineeDetails2.nomineeAddress3 = nom2address3.replace(
        emojiRegex,
        ''
      );
    }

    //Nominee 3 Address
    const nom3address1 = this.nomineeDetails3.nomineeAddress1?.trim() || '';
    const nom3address2 = this.nomineeDetails3.nomineeAddress2?.trim() || '';
    const nom3address3 = this.nomineeDetails3.nomineeAddress3?.trim() || '';

    if (nom3address1) {
      this.Nominee1AddLine1Space = nom3address1.length === 0;
      this.Nominee3AddLine1 =
        specialCharRegex.test(nom3address1) || emojiRegex.test(nom3address1);
    }

    if (nom3address2) {
      this.Nominee1AddLine2Space = nom3address2.length === 0;
      this.nomineeDetails3.nomineeAddress2 = nom3address2.replace(
        emojiRegex,
        ''
      );
    }

    if (nom3address3) {
      this.Nominee1AddLine3Space = nom3address3.length === 0;
      this.nomineeDetails3.nomineeAddress3 = nom3address3.replace(
        emojiRegex,
        ''
      );
    }
  }
  NomineeGuardianAddressValidation(): void {
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    //Nominee 1 Address
    const nom1address1 =
      this.nomineeDetails.nomineeGuardianAddress1?.trim() || '';
    const nom1address2 =
      this.nomineeDetails.nomineeGuardianAddress2?.trim() || '';
    const nom1address3 =
      this.nomineeDetails.nomineeGuardianAddress3?.trim() || '';

    if (nom1address1) {
      this.Nominee1GuardianAddLine1Space = nom1address1.length === 0;
      this.Nominee1GuardianAddLine1 =
        specialCharRegex.test(nom1address1) || emojiRegex.test(nom1address1);
      this.nomineeDetails.nomineeGuardianAddress1 = nom1address1.replace(
        emojiRegex,
        ''
      );
    }

    if (nom1address2) {
      this.Nominee1AddLine2Space = nom1address2.length === 0;
      this.Nominee1GuardianAddLine2 =
        specialCharRegex.test(nom1address2) || emojiRegex.test(nom1address2);
      this.nomineeDetails.nomineeGuardianAddress2 = nom1address2.replace(
        emojiRegex,
        ''
      );
    }

    if (nom1address3) {
      this.Nominee1AddLine3Space = nom1address3.length === 0;
      this.Nominee1GuardianAddLine3 =
        specialCharRegex.test(nom1address3) || emojiRegex.test(nom1address3);
      this.nomineeDetails.nomineeGuardianAddress3 = nom1address3.replace(
        emojiRegex,
        ''
      );
    }

    //Nominee 2 Address
    const nom2address1 =
      this.nomineeDetails2.nomineeGuardianAddress1?.trim() || '';
    const nom2address2 =
      this.nomineeDetails2.nomineeGuardianAddress2?.trim() || '';
    const nom2address3 =
      this.nomineeDetails2.nomineeGuardianAddress3?.trim() || '';

    if (nom2address1) {
      this.Nominee2GuardianAddLine1Space = nom2address1.length === 0;
      this.Nominee2GuardianAddLine1 =
        specialCharRegex.test(nom2address1) || emojiRegex.test(nom2address1);
      this.nomineeDetails2.nomineeGuardianAddress1 = nom2address1.replace(
        emojiRegex,
        ''
      );
    }

    if (nom2address2) {
      this.Nominee2GuardianAddLine2Space = nom2address2.length === 0;
      this.Nominee2GuardianAddLine2 =
        specialCharRegex.test(nom2address2) || emojiRegex.test(nom2address2);
      this.nomineeDetails2.nomineeGuardianAddress2 = nom2address2.replace(
        emojiRegex,
        ''
      );
    }

    if (nom2address3) {
      this.Nominee2GuardianAddLine3Space = nom2address3.length === 0;
      this.Nominee2GuardianAddLine3 =
        specialCharRegex.test(nom2address3) || emojiRegex.test(nom2address3);
      this.nomineeDetails2.nomineeGuardianAddress3 = nom2address3.replace(
        emojiRegex,
        ''
      );
    }

    //Nominee 3 Address
    const nom3address1 =
      this.nomineeDetails3.nomineeGuardianAddress1?.trim() || '';
    const nom3address2 =
      this.nomineeDetails3.nomineeGuardianAddress2?.trim() || '';
    const nom3address3 =
      this.nomineeDetails3.nomineeGuardianAddress3?.trim() || '';

    if (nom3address1) {
      this.Nominee3GuardianAddLine1Space = nom3address1.length === 0;
      this.Nominee3GuardianAddLine1 =
        specialCharRegex.test(nom3address1) || emojiRegex.test(nom3address1);
      this.nomineeDetails3.nomineeGuardianAddress1 = nom3address1.replace(
        emojiRegex,
        ''
      );
    }

    if (nom3address2) {
      this.Nominee1GuardianAddLine2Space = nom3address2.length === 0;
      this.Nominee3GuardianAddLine2 =
        specialCharRegex.test(nom3address2) || emojiRegex.test(nom3address2);
      this.nomineeDetails3.nomineeGuardianAddress2 = nom3address2.replace(
        emojiRegex,
        ''
      );
    }

    if (nom3address3) {
      this.Nominee1GuardianAddLine3Space = nom3address3.length === 0;
      this.Nominee3GuardianAddLine3 =
        specialCharRegex.test(nom3address3) || emojiRegex.test(nom3address3);
      this.nomineeDetails3.nomineeGuardianAddress3 = nom3address3.replace(
        emojiRegex,
        ''
      );
    }
  }

  NomineePincodeValidation(): void {
    const pincodePattern = /^[1-9][0-9]{5}$/;

    if (this.nomineeDetails.nomineePincode) {
      if (!pincodePattern.test(this.nomineeDetails.nomineePincode)) {
        this.Nominee1Pincode = true;
      } else {
        this.Nominee1Pincode = false;
      }
    }

    if (this.nomineeDetails2.nomineePincode) {
      if (!pincodePattern.test(this.nomineeDetails2.nomineePincode)) {
        this.Nominee2Pincode = true;
      } else {
        this.Nominee2Pincode = false;
      }
    }

    if (this.nomineeDetails3.nomineePincode) {
      if (!pincodePattern.test(this.nomineeDetails3.nomineePincode)) {
        this.Nominee3Pincode = true;
      } else {
        this.Nominee3Pincode = false;
      }
    }
  }

  NomineeCityValidation(event: any): void {
    const nomCity = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;

    if ((event.target.name = 'nomineeCity1')) {
      this.Nominee1City = nomCity.length === 0 || emojiRegex.test(nomCity);
      this.nomineeDetails.nomineeCity = value;
    }

    if ((event.target.name = 'nomineeCity2')) {
      this.Nominee1City = nomCity.length === 0 || emojiRegex.test(nomCity);
      this.nomineeDetails2.nomineeCity = value;
    }

    if ((event.target.name = 'nomineeCity3')) {
      this.Nominee1City = nomCity.length === 0 || emojiRegex.test(nomCity);
      this.nomineeDetails3.nomineeCity = value;
    }
  }

  //need to make it dynamic
  // updateNomineeCityName(value: string, flag: string): void {
  //   let trimmedValue = value.trim();
  //   trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
  //   const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
  //   this.City3ReqSpecial = specialCharRegex.test(trimmedValue);
  //   this.City3ReqDigit = /\d/.test(trimmedValue);
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  //   const containsEmoji = emojiRegex.test(trimmedValue);
  //   if (
  //     trimmedValue.length > 0 &&
  //     !this.City3ReqSpecial &&
  //     !this.City3ReqDigit &&
  //     !containsEmoji
  //   ) {
  //     if (flag === 'fout') {
  //       this.nomineeDetails3.nomineeCity = trimmedValue.toUpperCase();
  //     }
  //     this.Nominee3City = false;
  //   } else {
  //     this.Nominee3City = true;
  //   }
  // }

  Nominee1PincodeValidation(): void {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    if (!pincodePattern.test(this.nomineeDetails.nomineePincode)) {
      this.Nominee1Pincode = true;
    } else {
      this.Nominee1Pincode = false;
    }
  }

  // Nominee2AddLine1Validation(): void {
  //   const address1 = this.nomineeDetails2.nomineeAddress1?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  //   const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

  //   this.Nominee2AddLine1Space = address1.length === 0;
  //   this.Nominee2AddLine1 =
  //     specialCharRegex.test(address1) || emojiRegex.test(address1);
  // }

  // Nominee2AddLine2Validation(): void {
  //   const address2 = this.nomineeDetails2.nomineeAddress2?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   this.Nominee1AddLine2Space = address2.length === 0;
  //   this.nomineeDetails2.nomineeAddress2 = address2.replace(emojiRegex, '');
  // }

  // Nominee2AddLine3Validation(): void {
  //   const address3 = this.nomineeDetails2.nomineeAddress3?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   this.Nominee2AddLine3Space = address3.length === 0;
  //   this.nomineeDetails2.nomineeAddress3 = address3.replace(emojiRegex, '');
  // }

  Nominee2PincodeValidation(): void {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    if (!pincodePattern.test(this.nomineeDetails2.nomineePincode)) {
      this.Nominee2Pincode = true;
    } else {
      this.Nominee2Pincode = false;
    }
  }

  // Nominee3AddLine1Validation(): void {
  //   const address1 = this.nomineeDetails3.nomineeAddress1?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
  //   const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

  //   this.Nominee3AddLine1Space = address1.length === 0;
  //   this.Nominee3AddLine1 =
  //     specialCharRegex.test(address1) || emojiRegex.test(address1);
  // }

  // Nominee3AddLine2Validation(): void {
  //   const address2 = this.nomineeDetails3.nomineeAddress2?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   this.Nominee3AddLine2Space = address2.length === 0;
  //   this.nomineeDetails3.nomineeAddress2 = address2.replace(emojiRegex, '');
  // }

  // Nominee3AddLine3Validation(): void {
  //   const address3 = this.nomineeDetails3.nomineeAddress3?.trim() || '';
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   this.Nominee3AddLine3Space = address3.length === 0;
  //   this.nomineeDetails3.nomineeAddress3 = address3.replace(emojiRegex, '');
  // }

  Nominee3PincodeValidation(): void {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    if (!pincodePattern.test(this.nomineeDetails3.nomineePincode)) {
      this.Nominee3Pincode = true;
    } else {
      this.Nominee3Pincode = false;
    }
  }

  onPincodeInput(event: any, nomineeIndex: number): void {
    let input = event.target.value;
    if (input.startsWith('0')) {
      input = input.substring(1);
    }

    if (input.length > 6) {
      input = input.slice(0, 6);
    }

    event.target.value = input;

    // Update the corresponding nominee's pincode based on nomineeIndex
    if (nomineeIndex === 1) {
      this.nomineeDetails.nomineePincode = input;
    } else if (nomineeIndex === 2) {
      this.nomineeDetails2.nomineePincode = input;
    } else if (nomineeIndex === 3) {
      this.nomineeDetails3.nomineePincode = input;
    }

    this.validatePincode(this.nomineeDetails.nomineePincode, 1);
    this.validatePincode(this.nomineeDetails2.nomineePincode, 2);
    this.validatePincode(this.nomineeDetails3.nomineePincode, 3);
    var pincode1value = this.nomineeDetails.nomineePincode?.trim();
    if (pincode1value != '') {
      this.Nominee1Pincode = false;
    }

    var pincode2value = this.nomineeDetails2.nomineePincode?.trim();
    if (pincode2value != '') {
      this.Nominee2Pincode = false;
    }

    var pincode3value = this.nomineeDetails3.nomineePincode?.trim();
    if (pincode3value != '') {
      this.Nominee3Pincode = false;
    }
  }

  onPincodeGuarInput(event: any, nomineeIndex: number): void {
    let input = event.target.value;
    if (input.startsWith('0')) {
      input = input.substring(1);
    }

    if (input.length > 6) {
      input = input.slice(0, 6);
    }

    event.target.value = input;

    // Update the corresponding nominee's pincode based on nomineeIndex
    if (nomineeIndex === 1) {
      this.nomineeDetails.nomineeGuardianPincode = input;
    } else if (nomineeIndex === 2) {
      this.nomineeDetails2.nomineeGuardianPincode = input;
    } else if (nomineeIndex === 3) {
      this.nomineeDetails3.nomineeGuardianPincode = input;
    }

    this.validatePincode(this.nomineeDetails.nomineePincode, 1);
    this.validatePincode(this.nomineeDetails2.nomineePincode, 2);
    this.validatePincode(this.nomineeDetails3.nomineePincode, 3);
    var pincode1value = this.nomineeDetails.nomineeGuardianPincode?.trim();
    if (pincode1value != '') {
      this.Nominee1GuardianPincode = false;
    }

    var pincode2value = this.nomineeDetails2.nomineeGuardianPincode?.trim();
    if (pincode2value != '') {
      this.Nominee2GuardianPincode = false;
    }

    var pincode3value = this.nomineeDetails3.nomineeGuardianPincode?.trim();
    console.log('pincode3value:- ', pincode3value);
    if (pincode3value != '') {
      this.Nominee3GuardianPincode = false;
    }
  }

  validatePincode(pincode: string, nomineeIndex: number): void {
    const pincodePattern = /^[1-9][0-9]{5}$/;
    const isValid = pincodePattern.test(pincode);
    if (nomineeIndex === 1) {
      this.Nominee1Pincode = !isValid;
    } else if (nomineeIndex === 2) {
      this.Nominee2Pincode = !isValid;
    } else if (nomineeIndex === 3) {
      this.Nominee3Pincode = !isValid;
    }
  }

  // Nominee1StateValidation(event: any): void {
  //   const nom1State = event.target.value.trim();
  //   const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

  //   this.Nominee1State = nom1State.length === 0 || emojiRegex.test(nom1State);
  // }

  Nominee1CityValidation(event: any): void {
    const nom1City = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee1City = nom1City.length === 0 || emojiRegex.test(nom1City);
  }
  Nominee1GuardianCityValidation(event: any): void {
    const nom1City = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee1GuardianCity =
      nom1City.length === 0 || emojiRegex.test(nom1City);
  }

  updateCityName1(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.CityReqSpecial = specialCharRegex.test(trimmedValue);
    this.CityReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);
    if (
      trimmedValue.length > 0 &&
      !this.CityReqSpecial &&
      !this.CityReqDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.nomineeDetails.nomineeCity = trimmedValue.toUpperCase();
      }
      this.Nominee1City = false;
    } else {
      this.Nominee1City = true;
    }
  }
  updateGuardianCityName1(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.CityReqSpecial = specialCharRegex.test(trimmedValue);
    this.CityReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);
    if (
      trimmedValue.length > 0 &&
      !this.CityReqSpecial &&
      !this.CityReqDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.nomineeDetails.nomineeGuardianCity = trimmedValue.toUpperCase();
      }
      this.Nominee1GuardianCity = false;
    } else {
      this.Nominee1GuardianCity = true;
    }
  }
  checkCityInput1(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.nomineeDetails.nomineeCity = value;
  }
  checkGuardianCityInput1(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.nomineeDetails.nomineeGuardianCity = value;
  }
  Nominee2CityValidation(event: any): void {
    const nom2City = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee2City = nom2City.length === 0 || emojiRegex.test(nom2City);
  }
  Nominee2GuardianCityValidation(event: any): void {
    const nom2City = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee2GuardianCity =
      nom2City.length === 0 || emojiRegex.test(nom2City);
  }
  updateCityName2(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.City2ReqSpecial = specialCharRegex.test(trimmedValue);
    this.City2ReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);
    if (
      trimmedValue.length > 0 &&
      !this.City2ReqSpecial &&
      !this.City2ReqDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.nomineeDetails2.nomineeCity = trimmedValue.toUpperCase();
      }
      this.Nominee2City = false;
    } else {
      this.Nominee2City = true;
    }
  }
  updateGuardianCityName2(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.City2ReqSpecial = specialCharRegex.test(trimmedValue);
    this.City2ReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);
    if (
      trimmedValue.length > 0 &&
      !this.City2ReqSpecial &&
      !this.City2ReqDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.nomineeDetails2.nomineeGuardianCity = trimmedValue.toUpperCase();
      }
      this.Nominee2GuardianCity = false;
    } else {
      this.Nominee2GuardianCity = true;
    }
  }

  checkCityInput2(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.nomineeDetails2.nomineeCity = value;
  }
  checkGuardianCityInput2(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.nomineeDetails2.nomineeGuardianCity = value;
  }
  Nominee3CityValidation(event: any): void {
    const nom3City = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee3City = nom3City.length === 0 || emojiRegex.test(nom3City);
  }
  Nominee3GuardianCityValidation(event: any): void {
    const nom3City = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee3GuardianCity =
      nom3City.length === 0 || emojiRegex.test(nom3City);
  }

  updateCityName3(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.City3ReqSpecial = specialCharRegex.test(trimmedValue);
    this.City3ReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);
    if (
      trimmedValue.length > 0 &&
      !this.City3ReqSpecial &&
      !this.City3ReqDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.nomineeDetails3.nomineeCity = trimmedValue.toUpperCase();
      }
      this.Nominee3City = false;
    } else {
      this.Nominee3City = true;
    }
  }
  updateGuardianCityName3(value: string, flag: string): void {
    let trimmedValue = value.trim();
    trimmedValue = trimmedValue.replace(/\s{2,}/g, ' ');
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;
    this.City3ReqSpecial = specialCharRegex.test(trimmedValue);
    this.City3ReqDigit = /\d/.test(trimmedValue);
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const containsEmoji = emojiRegex.test(trimmedValue);
    if (
      trimmedValue.length > 0 &&
      !this.City3ReqSpecial &&
      !this.City3ReqDigit &&
      !containsEmoji
    ) {
      if (flag === 'fout') {
        this.nomineeDetails3.nomineeGuardianCity = trimmedValue.toUpperCase();
      }
      this.Nominee3GuardianCity = false;
    } else {
      this.Nominee3GuardianCity = true;
    }
  }

  checkCityInput3(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.nomineeDetails3.nomineeCity = value;
  }
  checkGuardianCityInput3(event: any): void {
    let value = event.target.value;
    if (/^\s/.test(value)) {
      value = value.trimStart();
    }
    value = value.replace(/\s{2,}/g, ' ');
    // Remove any digits or special characters
    value = value.replace(/[^a-zA-Z\s]/g, '');
    event.target.value = value;
    this.nomineeDetails3.nomineeGuardianCity = value;
  }
  // Nominee1 Guardian
  Nominee1GuardianValidation(): void {
    const guardianFirstName =
      this.nomineeDetails.nomineeGuardianFirstName?.trim() || '';
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    this.Nominee1FGuardianSpecial = specialCharRegex.test(guardianFirstName);
    this.Nominee1FGuardianDigit = /\d/.test(guardianFirstName);
    this.Nominee1FGuardianSpace = guardianFirstName.length === 0;
    this.Nominee1FGuardianName =
      this.Nominee1FGuardianSpace ||
      this.Nominee1FGuardianSpecial ||
      this.Nominee1FGuardianDigit;
  }

  Nominee1LastGuardianValidation(): void {
    const guardianLastName =
      this.nomineeDetails.nomineeGuardianLastName?.trim() || '';
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    this.Nominee1LGuardianSpecial = specialCharRegex.test(guardianLastName);
    this.Nominee1LGuardianDigit = /\d/.test(guardianLastName);
    this.Nominee1LGuardianSpace = guardianLastName.length === 0;
    this.Nominee1LGuardianName =
      this.Nominee1LGuardianSpace ||
      this.Nominee1LGuardianSpecial ||
      this.Nominee1LGuardianDigit;
  }

  Nominee1RelationGuardianValidation(event: any): void {
    const nom1GuardianRelation = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    this.Nominee1GuardianRelation =
      nom1GuardianRelation.length === 0 ||
      emojiRegex.test(nom1GuardianRelation);
  }

  Nominee2GuardianValidation(): void {
    const guardianFirstName =
      this.nomineeDetails2.nomineeGuardianFirstName?.trim() || '';
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    this.Nominee2FGuardianSpecial = specialCharRegex.test(guardianFirstName);
    this.Nominee2FGuardianDigit = /\d/.test(guardianFirstName);
    this.Nominee2FGuardianSpace = guardianFirstName.length === 0;
    this.Nominee2FGuardianName =
      this.Nominee2FGuardianSpace ||
      this.Nominee2FGuardianSpecial ||
      this.Nominee2FGuardianDigit;
  }

  Nominee2LastGuardianValidation(): void {
    const guardianLastName =
      this.nomineeDetails2.nomineeGuardianLastName?.trim() || '';
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    this.Nominee2LGuardianSpecial = specialCharRegex.test(guardianLastName);
    this.Nominee2LGuardianDigit = /\d/.test(guardianLastName);
    this.Nominee2LGuardianSpace = guardianLastName.length === 0;
    this.Nominee2LGuardianName =
      this.Nominee2LGuardianSpace ||
      this.Nominee2LGuardianSpecial ||
      this.Nominee2LGuardianDigit;
  }

  Nominee2RelationGuardianValidation(event: any): void {
    const nom1GuardianRelation = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee2GuardianRelation =
      nom1GuardianRelation.length === 0 ||
      emojiRegex.test(nom1GuardianRelation);
  }

  Nominee3GuardianValidation(): void {
    const guardianFirstName =
      this.nomineeDetails3.nomineeGuardianFirstName?.trim() || '';
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    this.Nominee3FGuardianSpecial = specialCharRegex.test(guardianFirstName);
    this.Nominee3FGuardianDigit = /\d/.test(guardianFirstName);
    this.Nominee3FGuardianSpace = guardianFirstName.length === 0;
    this.Nominee3FGuardianName =
      this.Nominee3FGuardianSpace ||
      this.Nominee3FGuardianSpecial ||
      this.Nominee3FGuardianDigit;
  }

  Nominee3LastGuardianValidation(): void {
    const guardianLastName =
      this.nomineeDetails3.nomineeGuardianLastName?.trim() || '';

    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;
    const specialCharRegex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    this.Nominee3LGuardianSpecial = specialCharRegex.test(guardianLastName);
    this.Nominee3LGuardianDigit = /\d/.test(guardianLastName);
    this.Nominee3LGuardianSpace = guardianLastName.length === 0;
    this.Nominee3LGuardianName =
      this.Nominee3LGuardianSpace ||
      this.Nominee3LGuardianSpecial ||
      this.Nominee3LGuardianDigit;
  }

  Nominee3RelationGuardianValidation(event: any): void {
    const nom1GuardianRelation = event.target.value.trim();
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee3GuardianRelation =
      nom1GuardianRelation.length === 0 ||
      emojiRegex.test(nom1GuardianRelation);
  }

  Nominee1DOBGuardianValidation(event: any): void {
    const nom1GuardianDOB = event;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee1GuardianDOB =
      nom1GuardianDOB.length === 0 || emojiRegex.test(nom1GuardianDOB);
  }

  Nominee2DOBGuardianValidation(event: any): void {
    const nom1GuardianDOB = event;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee2GuardianDOB =
      nom1GuardianDOB.length === 0 || emojiRegex.test(nom1GuardianDOB);
  }

  Nominee3DOBGuardianValidation(event: any): void {
    const nom1GuardianDOB = event;
    const emojiRegex = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

    this.Nominee3GuardianDOB =
      nom1GuardianDOB.length === 0 || emojiRegex.test(nom1GuardianDOB);
  }

  // added by Nitesh S on 20/01/2025 for Nomination additional validation
  checkallnomineename() {
    const nom1fullname = concat(
      this.nomineeDetails.nomineefname.toUpperCase(),
      ' ',
      this.nomineeDetails.nomineelname.toUpperCase()
    );
    const nom2fullname = concat(
      this.nomineeDetails2.nomineefname.toUpperCase(),
      ' ',
      this.nomineeDetails2.nomineelname.toUpperCase()
    );
    const nom3fullname = concat(
      this.nomineeDetails3.nomineefname.toUpperCase(),
      ' ',
      this.nomineeDetails3.nomineelname.toUpperCase()
    );

    //start nominee 1 and 2
    if (nom2fullname) {
      if (nom2fullname == nom1fullname) {
        this.toastr.warning(
          'Nominee 2 Firstname and Nominee 1 Firstname cannot be the same. Please enter a valid nominee name or opt out from nomination',
          'Nominee 2',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          }
        );
        this.SaveNominee = true;

        return;
      } else {
        this.SaveNominee = false;
      }
    }

    //start nominee 3 and 2
    if (nom3fullname) {
      if (nom3fullname == nom2fullname) {
        this.toastr.warning(
          'Nominee 3 Firstname and Nominee 2 Firstname cannot be the same. Please enter a valid nominee name or opt out from nomination',
          'Nominee 3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          }
        );
        this.SaveNominee = true;
        return;
      }

      //start nominee 3 and 1
      else if (nom3fullname == nom1fullname) {
        this.toastr.warning(
          'Nominee 3 Firstname and Nominee 1 Firstname cannot be the same. Please enter a valid nominee name or opt out from nomination',
          'Nominee 3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          }
        );
        this.SaveNominee = true;

        return;
      } else {
        this.SaveNominee = false;
      }
    }
  }

  checkNomineeName() {
    if (
      this.nomineeDetails.nomineefname.toUpperCase().trim() ===
        this.nomineeDetails.nomineelname.toUpperCase().trim() &&
      this.nomineeDetails.nomineefname != '' &&
      this.nomineeDetails.nomineelname != ''
    ) {
      this.toastr.warning(
        'Nominee Firstname and Lastname cannot be the same. Please enter a valid nominee name or opt out from nomination',
        'Nominee 1',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        }
      );

      this.SaveNominee = true;

      return;
    } else {
      this.SaveNominee = false;
    }

    if (
      this.nomineeDetails2.nomineefname.toUpperCase().trim() ===
        this.nomineeDetails2.nomineelname.toUpperCase().trim() &&
      this.nomineeDetails2.nomineefname != '' &&
      this.nomineeDetails2.nomineelname != ''
    ) {
      this.toastr.warning(
        'Nominee Firstname and Lastname cannot be the same. Please enter a valid nominee name or opt out from nomination',
        'Nominee 2',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        }
      );
      this.SaveNominee = true;

      return;
    } else {
      this.SaveNominee = false;
    }

    if (
      this.nomineeDetails3.nomineefname.toUpperCase().trim() ===
        this.nomineeDetails3.nomineelname.toUpperCase().trim() &&
      this.nomineeDetails3.nomineefname != '' &&
      this.nomineeDetails3.nomineelname != ''
    ) {
      this.toastr.warning(
        'Nominee Firstname and Lastname cannot be the same. Please enter a valid nominee name or opt out from nomination',
        'Nominee 3',
        {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        }
      );
      this.SaveNominee = true;

      return;
    } else {
      this.SaveNominee = false;
    }

    this.checkallnomineename();
  }

  GetStateandCity() {
    if (String(this.nomineeDetails.nomineePincode).length == 6) {
      this.spinner.show();

      const reqData = {
        Pincode: this.nomineeDetails.nomineePincode,
      };

      this._http
        .postRequest('api/v1/personalDetail/getStateCity', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          if (response.status === true && response.message === 'Data found') {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            this.nomineeDetails.nomineeState = response.Table[0].STATE_NAME;
            //this.nomineeDetails.nomineeCity = response.Table[0].DISTRICT_NAME;

            this.spinner.hide();
          } else if (
            response.status === false &&
            response.message === 'No Data found'
          ) {
            this.spinner.hide();

            this.toastr.warning('Invalid Pin Code', 'Nominee 1', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails.nomineePincode = null;
            this.nomineeDetails.nomineeState = null;
            this.nomineeDetails.nomineeCity = null;
            return;
          } else {
            this.spinner.hide();

            this.toastr.error(response.message, 'Nominee 1', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails.nomineePincode = null;
            this.nomineeDetails.nomineeState = null;
            this.nomineeDetails.nomineeCity = null;

            return;
          }
        });
    } else if (String(this.nomineeDetails.nomineePincode).length > 6) {
      this.nomineeDetails.nomineePincode = null;
      this.nomineeDetails.nomineeState = null;
      this.nomineeDetails.nomineeCity = null;

      return;
    }
  }

  GetStateandCity2() {
    if (String(this.nomineeDetails2.nomineePincode).length == 6) {
      this.spinner.show();

      const reqData = {
        Pincode: this.nomineeDetails2.nomineePincode,
      };

      this._http
        .postRequest('api/v1/personalDetail/getStateCity', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          if (response.status === true && response.message === 'Data found') {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            this.nomineeDetails2.nomineeState = response.Table[0].STATE_NAME;
            //this.nomineeDetails2.nomineeCity = response.Table[0].DISTRICT_NAME;

            this.spinner.hide();
          } else if (
            response.status === false &&
            response.message === 'No Data found'
          ) {
            this.spinner.hide();

            this.toastr.warning('Invalid PinCode', 'Nominee 2', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails2.nomineePincode = null;
            this.nomineeDetails2.nomineeState = null;
            //this.nomineeDetails2.nomineeCity = null;

            return;
          } else {
            this.spinner.hide();

            this.toastr.error(response.message, 'Nominee 2', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails2.nomineePincode = null;
            this.nomineeDetails2.nomineeState = null;
            //this.nomineeDetails2.nomineeCity = null;

            return;
          }
        });
    } else if (String(this.nomineeDetails2.nomineePincode).length > 6) {
      this.nomineeDetails2.nomineePincode = null;
      this.nomineeDetails2.nomineeState = null;
      //this.nomineeDetails2.nomineeCity = null;

      return;
    }
  }

  GetStateandCity3() {
    if (String(this.nomineeDetails3.nomineePincode).length == 6) {
      this.spinner.show();

      const reqData = {
        Pincode: this.nomineeDetails3.nomineePincode,
      };

      this._http
        .postRequest('api/v1/personalDetail/getStateCity', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          if (response.status === true && response.message === 'Data found') {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            this.nomineeDetails3.nomineeState = response.Table[0].STATE_NAME;
            //this.nomineeDetails3.nomineeCity = response.Table[0].DISTRICT_NAME;

            this.spinner.hide();
          } else if (
            response.status === false &&
            response.message === 'No Data found'
          ) {
            this.spinner.hide();

            this.toastr.warning('Invalid PinCode', 'Nominee 3', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails3.nomineePincode = null;
            this.nomineeDetails3.nomineeState = null;
            //this.nomineeDetails3.nomineeCity = null;

            return;
          } else {
            this.spinner.hide();

            this.toastr.error(response.message, 'Nominee 3', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails3.nomineePincode = null;
            this.nomineeDetails3.nomineeState = null;
            // this.nomineeDetails3.nomineeCity = null;

            return;
          }
        });
    } else if (String(this.nomineeDetails3.nomineePincode).length > 6) {
      this.nomineeDetails3.nomineePincode = null;
      this.nomineeDetails3.nomineeState = null;
      //this.nomineeDetails3.nomineeCity = null;

      return;
    }
  }
  GetStateandCityGuar() {
    if (String(this.nomineeDetails.nomineeGuardianPincode).length == 6) {
      this.spinner.show();

      const reqData = {
        Pincode: this.nomineeDetails.nomineeGuardianPincode,
      };

      this._http
        .postRequest('api/v1/personalDetail/getStateCity', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          if (response.status === true && response.message === 'Data found') {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            this.nomineeDetails.nomineeGuardianState =
              response.Table[0].STATE_NAME;
            //this.nomineeDetails.nomineeCity = response.Table[0].DISTRICT_NAME;

            this.spinner.hide();
          } else if (
            response.status === false &&
            response.message === 'No Data found'
          ) {
            this.spinner.hide();

            this.toastr.warning('Invalid Pin Code', 'Nominee 1', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails.nomineeGuardianPincode = null;
            this.nomineeDetails.nomineeGuardianState = null;
            this.nomineeDetails.nomineeGuardianCity = null;
            return;
          } else {
            this.spinner.hide();

            this.toastr.error(response.message, 'Nominee 1', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails.nomineeGuardianPincode = null;
            this.nomineeDetails.nomineeGuardianState = null;
            this.nomineeDetails.nomineeGuardianCity = null;

            return;
          }
        });
    } else if (String(this.nomineeDetails.nomineeGuardianPincode).length > 6) {
      this.nomineeDetails.nomineeGuardianPincode = null;
      this.nomineeDetails.nomineeGuardianState = null;
      this.nomineeDetails.nomineeGuardianCity = null;

      return;
    }
  }

  GetStateandCityGuar2() {
    if (String(this.nomineeDetails2.nomineeGuardianPincode).length == 6) {
      this.spinner.show();

      const reqData = {
        Pincode: this.nomineeDetails2.nomineeGuardianPincode,
      };

      this._http
        .postRequest('api/v1/personalDetail/getStateCity', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          if (response.status === true && response.message === 'Data found') {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            this.nomineeDetails2.nomineeGuardianState =
              response.Table[0].STATE_NAME;
            //this.nomineeDetails2.nomineeCity = response.Table[0].DISTRICT_NAME;

            this.spinner.hide();
          } else if (
            response.status === false &&
            response.message === 'No Data found'
          ) {
            this.spinner.hide();

            this.toastr.warning('Invalid PinCode', 'Nominee 2', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails2.nomineeGuardianPincode = null;
            this.nomineeDetails2.nomineeGuardianState = null;
            //this.nomineeDetails2.nomineeCity = null;

            return;
          } else {
            this.spinner.hide();

            this.toastr.error(response.message, 'Nominee 2', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails2.nomineeGuardianPincode = null;
            this.nomineeDetails2.nomineeGuardianState = null;
            //this.nomineeDetails2.nomineeCity = null;

            return;
          }
        });
    } else if (String(this.nomineeDetails2.nomineeGuardianPincode).length > 6) {
      this.nomineeDetails2.nomineeGuardianPincode = null;
      this.nomineeDetails2.nomineeGuardianState = null;
      //this.nomineeDetails2.nomineeCity = null;

      return;
    }
  }

  GetStateandCityGuar3() {
    if (String(this.nomineeDetails3.nomineeGuardianPincode).length == 6) {
      this.spinner.show();

      const reqData = {
        Pincode: this.nomineeDetails3.nomineeGuardianPincode,
      };

      this._http
        .postRequest('api/v1/personalDetail/getStateCity', reqData)
        .subscribe((resp) => {
          let response: any = resp.body;
          if (response.status === true && response.message === 'Data found') {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                this.clientid,
                this.clientid
              )
            );
            this.nomineeDetails3.nomineeGuardianState =
              response.Table[0].STATE_NAME;
            //this.nomineeDetails3.nomineeCity = response.Table[0].DISTRICT_NAME;

            this.spinner.hide();
          } else if (
            response.status === false &&
            response.message === 'No Data found'
          ) {
            this.spinner.hide();

            this.toastr.warning('Invalid PinCode', 'Nominee 3', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails3.nomineeGuardianPincode = null;
            this.nomineeDetails3.nomineeGuardianState = null;
            //this.nomineeDetails3.nomineeCity = null;

            return;
          } else {
            this.spinner.hide();

            this.toastr.error(response.message, 'Nominee 3', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.nomineeDetails3.nomineeGuardianPincode = null;
            this.nomineeDetails3.nomineeGuardianState = null;
            // this.nomineeDetails3.nomineeCity = null;

            return;
          }
        });
    } else if (String(this.nomineeDetails3.nomineeGuardianPincode).length > 6) {
      this.nomineeDetails3.nomineeGuardianPincode = null;
      this.nomineeDetails3.nomineeGuardianState = null;
      //this.nomineeDetails3.nomineeCity = null;

      return;
    }
  }
  IsNomineeMinor() {
    debugger;
    this.Nominee1DOBisMinor = this.nomineeDetails.nomineeisMinorCheck;
    this.Nominee2DOBisMinor = this.nomineeDetails2.nomineeisMinorCheck;
    this.Nominee3DOBisMinor = this.nomineeDetails3.nomineeisMinorCheck;

    //Nomine 1 Minor Check
    if (
      this.nomineeDetails.nomineeisMinorCheck &&
      this.nomineeDetails.nomineeOnedob == ''
    ) {
      this.toastr.warning('Please Enter the Date of Birth', 'Nominee 1', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });
      return false;
    }

    if (this.Nominee1DOBisMinor === true) {
      this.nomineeOneGuardian = true;
    } else {
      this.nomineeDetails.nomineeOnedob = '';
      this.nomineeDetails.nomineeGuardianFirstName = '';
      this.nomineeDetails.nomineeGuardianLastName = '';
      // this.nomineeDetails.nomineeGuardiandob = '';
      this.nomineeDetails.nom_guard_relation = '';
      this.nomineeOneGuardian = false;
    }

    //Nomine 2 Minor Check
    if (
      this.nomineeDetails2.nomineeisMinorCheck &&
      this.nomineeDetails2.nomineeOnedob == ''
    ) {
      this.toastr.warning('Please Enter the Date of Birth', 'Nominee 2', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });
      return false;
    }

    if (this.Nominee2DOBisMinor === true) {
      this.nomineeTwoGuardian = true;
    } else {
      this.nomineeDetails2.nomineeOnedob = '';
      this.nomineeDetails2.nomineeGuardianFirstName = '';
      this.nomineeDetails2.nomineeGuardianLastName = '';
      // this.nomineeDetails2.nomineeGuardiandob = '';
      this.nomineeDetails2.nom_guard_relation = '';
      this.nomineeTwoGuardian = false;
    }

    //Nomine 3 Minor Check
    if (
      this.nomineeDetails3.nomineeisMinorCheck &&
      this.nomineeDetails3.nomineeOnedob == ''
    ) {
      this.toastr.warning('Please Enter the Date of Birth', 'Nominee 3', {
        positionClass: 'toast-bottom-center',
        timeOut: 2000,
      });
      return false;
    }

    if (this.Nominee3DOBisMinor === true) {
      this.nomineeThreeGuardian = true;
    } else {
      this.nomineeDetails3.nomineeOnedob = '';
      this.nomineeDetails3.nomineeGuardianFirstName = '';
      this.nomineeDetails3.nomineeGuardianLastName = '';
      // this.nomineeDetails3.nomineeGuardiandob = '';
      this.nomineeDetails3.nom_guard_relation = '';
      this.nomineeThreeGuardian = false;
    }

    return true;
  }

  onNomineeIsMinorCheck() {
    this.Nominee1DOBisMinor = this.nomineeDetails.nomineeisMinorCheck;
    if (this.Nominee1DOBisMinor === true) {
      // console.log(this.Nominee1DOBisMinor)
      this.nomineeOneGuardian = true;
      this.nomineeDetails.nomineeOnedob = '';
      this.nomineeDetails.nomineeGuardianFirstName = '';
      this.nomineeDetails.nomineeGuardianLastName = '';
      this.nomineeDetails.nomineeGuardiandob = '';
      this.nomineeDetails.nom_guard_relation = '';
      this.nomineeDetails.nomineeGuardianApplicantCheck = true;
    } else {
      // console.log(this.Nominee1DOBisMinor)

      this.nomineeOneGuardian = false;
      this.nomineeDetails.nomineeOnedob = '';
      this.nomineeDetails.nomineeGuardianFirstName = '';
      this.nomineeDetails.nomineeGuardianLastName = '';
      this.nomineeDetails.nomineeGuardiandob = '';
      this.nomineeDetails.nom_guard_relation = '';
      this.nomineeDetails.nomineeGuardianApplicantCheck = false;
    }
  }
  onNominee2IsMinorCheck() {
    this.Nominee2DOBisMinor = this.nomineeDetails2.nomineeisMinorCheck;
    if (this.Nominee2DOBisMinor === true) {
      this.nomineeTwoGuardian = true;
      this.nomineeDetails2.nomineeOnedob = '';
      this.nomineeDetails2.nomineeGuardianFirstName = '';
      this.nomineeDetails2.nomineeGuardianLastName = '';
      this.nomineeDetails2.nomineeGuardiandob = '';
      this.nomineeDetails2.nom_guard_relation = '';
      this.nomineeDetails2.nomineeGuardianApplicantCheck = true;
    } else {
      this.nomineeTwoGuardian = false;
      this.nomineeDetails2.nomineeOnedob = '';
      this.nomineeDetails2.nomineeGuardianFirstName = '';
      this.nomineeDetails2.nomineeGuardianLastName = '';
      this.nomineeDetails2.nomineeGuardiandob = '';
      this.nomineeDetails2.nom_guard_relation = '';
      this.nomineeDetails2.nomineeGuardianApplicantCheck = false;
    }
  }
  onNominee3IsMinorCheck() {
    this.Nominee3DOBisMinor = this.nomineeDetails3.nomineeisMinorCheck;
    if (this.Nominee3DOBisMinor === true) {
      this.nomineeThreeGuardian = true;
      this.nomineeDetails3.nomineeOnedob = '';
      this.nomineeDetails3.nomineeGuardianFirstName = '';
      this.nomineeDetails3.nomineeGuardianLastName = '';
      this.nomineeDetails3.nomineeGuardiandob = '';
      this.nomineeDetails3.nom_guard_relation = '';
      // this.nomineeDetails3.nomineeGuardianApplicantCheck = true;
    } else {
      this.nomineeThreeGuardian = false;
      this.nomineeDetails3.nomineeOnedob = '';
      this.nomineeDetails3.nomineeGuardianFirstName = '';
      this.nomineeDetails3.nomineeGuardianLastName = '';
      this.nomineeDetails3.nomineeGuardiandob = '';
      this.nomineeDetails3.nom_guard_relation = '';
      // this.nomineeDetails3.nomineeGuardianApplicantCheck = false;
    }
  }

  save_allnomineedetails(count: number) {
    window.sessionStorage.removeItem('NomineeOptOut');

    const regex = /[!@#$%^&*()\-+={}[\]:;"'<>,.?\/|\\]/;

    const normalizeName = (fname: string, lname: string) =>
      (fname + lname).trim().toLowerCase();

    if (!this.IsNomineeMinor()) {
      return;
    }

    if (count >= 1) {
      const nominee1FullName = normalizeName(
        this.nomineeDetails.nomineefname,
        this.nomineeDetails.nomineelname
      );
      if (!nominee1FullName) {
        //console.log('');

        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg: 'Nominee 1 details are missing',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning('Nominee 1 details are missing', 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        return;
      }
    }

    if (count >= 2) {
      const nominee1FullName = normalizeName(
        this.nomineeDetails.nomineefname,
        this.nomineeDetails.nomineelname
      );
      const nominee2FullName = normalizeName(
        this.nomineeDetails2.nomineefname,
        this.nomineeDetails2.nomineelname
      );

      if (!nominee2FullName) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg: 'Nominee 2 details are missing',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning('Nominee 2 details are missing', 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        return;
      }

      // Check if nominee 1 and nominee 2 have the same name
      // if (nominee1FullName === nominee2FullName) {
      //   this.toastr.error(
      //     'Name of nominee 1 and 2 cannot be the same. Please enter a valid nominee name or opt out from nomination',
      //     '',
      //     {
      //       positionClass: 'toast-bottom-center',
      //       timeOut: 2000,
      //     }
      //   );
      //   return;
      // }
    }

    if (count >= 3) {
      const nominee1FullName = normalizeName(
        this.nomineeDetails.nomineefname,
        this.nomineeDetails.nomineelname
      );
      const nominee2FullName = normalizeName(
        this.nomineeDetails2.nomineefname,
        this.nomineeDetails2.nomineelname
      );
      const nominee3FullName = normalizeName(
        this.nomineeDetails3.nomineefname,
        this.nomineeDetails3.nomineelname
      );

      if (!nominee3FullName) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg: 'Nominee 3 details are missing',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning('Nominee 3 details are missing', 'Warning', {
          positionClass: 'toast-bottom-center',
          timeOut: 2000,
        });
        return;
      }

      if (
        nominee1FullName === nominee2FullName &&
        nominee2FullName === nominee3FullName &&
        nominee3FullName === nominee1FullName
      ) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Name of nominee 1, 2, and 3 cannot be the same. Please enter a valid nominee name or opt out from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.error(
          'Oops! Name of nominee 1, 2, and 3 cannot be the same. Please enter a valid nominee name or opt out from nomination',
          'Nominee 1,2,3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          }
        );
        return;
      }

      // if (
      //   this.nomineeDetails2.nomineefname.toUpperCase() ==
      //   this.nomineeDetails3.nomineefname.toUpperCase() &&
      //   this.nomineeDetails2.nomineelname.toUpperCase() ==
      //   this.nomineeDetails3.nomineelname.toUpperCase()
      // ) {
      //   this.toastr.warning(
      //     'Oops! Name of nominee 2 and 3 cannot be same. Please enter a valid nominee name or optout from nomination',
      //     'Nominee 2,3',
      //     {
      //       positionClass: 'toast-bottom-center',
      //       timeOut: 5000,
      //     }
      //   );
      //   return;
      // }

      // if (
      //   this.nomineeDetails.nomineefname.toUpperCase() ==
      //   this.nomineeDetails3.nomineefname.toUpperCase() &&
      //   this.nomineeDetails.nomineelname.toUpperCase() ==
      //   this.nomineeDetails3.nomineelname.toUpperCase()
      // ) {
      //   this.toastr.warning(
      //     'Oops! Name of nominee 1 and 3 cannot be same. Please enter a valid nominee name or optout from nomination',
      //     'Nominee 1,3',
      //     {
      //       positionClass: 'toast-bottom-center',
      //       timeOut: 5000,
      //     }
      //   );
      //   return;
      // }
    }

    if (count === 2) {
      var percent1 =
        parseInt(this.nomineeDetails.nomineeAllocationRange) +
        parseInt(this.nomineeDetails2.nomineeAllocationRange);

      if (percent1 != 100) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        //this.toastr.warning('Total Allocation should be 100%', 'Nominee 1,2', {
        this.toastr.warning(
          'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination',
          'Nominee 1,2',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          }
        );
        return;
      }

      if (
        this.nomineeDetails.nomineefname.toUpperCase().trim() ==
          this.nomineeDetails2.nomineefname.toUpperCase().trim() &&
        this.nomineeDetails.nomineelname.toUpperCase().trim() ==
          this.nomineeDetails2.nomineelname.toUpperCase().trim()
      ) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Name of nominee 1 and 2 cannot be same. Please enter a valid nominee name or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning(
          'Oops! Name of nominee 1 and 2 cannot be same. Please enter a valid nominee name or optout from nomination',
          'Nominee 1,2',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          }
        );
        return;
      }

      if (
        this.nomineeDetails.nomineeproofnumber ==
        this.nomineeDetails2.nomineeproofnumber
      ) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Proof of nominee 1 and 2 cannot be same. Please enter a valid nominee proof or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning(
          'Oops! Proof of nominee 1 and 2 cannot be same. Please enter a valid nominee proof or optout from nomination',
          'Nominee 1,2',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          }
        );
        return;
      }
    }

    if (count === 3) {
      var percent1 =
        parseInt(this.nomineeDetails.nomineeAllocationRange) +
        parseInt(this.nomineeDetails2.nomineeAllocationRange) +
        parseInt(this.nomineeDetails3.nomineeAllocationRange);

      if (percent1 != 100) {
        //this.toastr.warning('Total Allocation should be 100%', 'Nominee 1,2', {

        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning(
          'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination',
          'Nominee 1,2,3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          }
        );
        return;
      }

      if (
        this.nomineeDetails.nomineefname.toUpperCase().trim() ==
          this.nomineeDetails3.nomineefname.toUpperCase().trim() &&
        this.nomineeDetails.nomineelname.toUpperCase().trim() ==
          this.nomineeDetails3.nomineelname.toUpperCase().trim()
      ) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Name of nominee 1 and 3 cannot be same. Please enter a valid nominee name or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning(
          'Oops! Name of nominee 1 and 3 cannot be same. Please enter a valid nominee name or optout from nomination',
          'Nominee 1,3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          }
        );
        return;
      }

      if (
        this.nomineeDetails2.nomineefname.toUpperCase().trim() ==
          this.nomineeDetails3.nomineefname.toUpperCase().trim() &&
        this.nomineeDetails2.nomineelname.toUpperCase().trim() ==
          this.nomineeDetails3.nomineelname.toUpperCase().trim()
      ) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Name of nominee 2 and 3 cannot be same. Please enter a valid nominee name or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning(
          'Oops! Name of nominee 2 and 3 cannot be same. Please enter a valid nominee name or optout from nomination',
          'Nominee 2,3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          }
        );
        return;
      }

      if (
        this.nomineeDetails.nomineeproofnumber ==
        this.nomineeDetails3.nomineeproofnumber
      ) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Proof of nominee 1 and 3 cannot be same. Please enter a valid nominee proof or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning(
          'Oops! Proof of nominee 1 and 3 cannot be same. Please enter a valid nominee proof or optout from nomination',
          'Nominee 1,3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          }
        );
        return;
      }

      if (
        this.nomineeDetails2.nomineeproofnumber ==
        this.nomineeDetails3.nomineeproofnumber
      ) {
        this.MoengageService.trackEvent('Nominee Submission Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          Noof_NomineeAdded: count,
          ErrorMsg:
            'Oops! Proof of nominee 2 and 3 cannot be same. Please enter a valid nominee proof or optout from nomination',
          product_name: 'Onboarding DIY',
          category: 'Nominee',
        });

        this.toastr.warning(
          'Oops! Proof of nominee 2 and 3 cannot be same. Please enter a valid nominee proof or optout from nomination',
          'Nominee 2,3',
          {
            positionClass: 'toast-bottom-center',
            timeOut: 5000,
          }
        );
        return;
      }
    }

    if (count >= 1) {
      if (this.nomineeDetails.nomineefname?.trim().length == 0) {
        this.Nominee1FName = true;
        return;
      }
      if (regex.test(this.nomineeDetails.nomineefname)) {
        this.Nominee1FSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails.nomineefname)) {
        this.Nominee1FDigit = true;
        return;
      }
      if (this.nomineeDetails.nomineefname?.trim().length == 0) {
        this.Nominee1FSpace = true;
        return;
      }

      // Last name validation
      if (this.nomineeDetails.nomineelname.trim().length == 0) {
        this.Nominee1LName = true;
        return;
      }
      if (regex.test(this.nomineeDetails.nomineelname)) {
        this.Nominee1LSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails.nomineelname)) {
        this.Nominee1LDigit = true;
        return;
      }
      if (this.nomineeDetails.nomineelname?.trim().length == 0) {
        this.Nominee1LSpace = false;
        return;
      }

      // added by nitesh on 28022025 start

      if (!this.NomMobVal1()) {
        return;
      }

      if (!this.validateEmail1()) {
        return;
      }

      if (!this.nomineeidproofval1()) {
        return;
      }

      if (this.nomineeDetails.nomineeprooftype == '') {
        this.Nominee1Prooftype = true;
        return;
      }

      // if (this.nomineeDetails.nomineeproofnumber == '') {
      //   this.Nominee1ProofIdNo = true;
      //   return
      // }

      // added by nitesh mitesh on 28022025 end

      // Relation ship
      if (this.nomineeDetails.nom_relation == '') {
        this.Nominee1Relation = true;
        return;
      }

      // if (this.nomineeDetails.nomineeOnedob == '') {
      //   this.Nominee1DOB = true;
      //   return;
      // }

      if (this.nomineeDetails.nomineeAllocationRange == '') {
        this.Nominee1Allocation = true;
        return;
      }
    }

    if (count >= 2) {
      if (this.nomineeDetails2.nomineefname.trim().length == 0) {
        this.Nominee2FName = true;
        return;
      }
      if (regex.test(this.nomineeDetails2.nomineefname)) {
        this.Nominee2FSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails2.nomineefname)) {
        this.Nominee2FDigit = true;
        return;
      }
      if (this.nomineeDetails2.nomineefname?.trim().length == 0) {
        this.Nominee2FSpace = true;
        return;
      }

      // Last name validation
      if (this.nomineeDetails2.nomineelname.trim().length == 0) {
        this.Nominee2LName = true;
        return;
      }
      if (regex.test(this.nomineeDetails2.nomineelname)) {
        this.Nominee2LSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails2.nomineelname)) {
        this.Nominee2LDigit = true;
        return;
      }
      if (this.nomineeDetails2.nomineelname?.trim().length == 0) {
        this.Nominee2LSpace = false;
        return;
      }

      // added by nitesh mitesh on 28022025 start

      if (!this.NomMobVal2()) {
        return;
      }

      if (!this.validateEmail2()) {
        return;
      }

      if (!this.nomineeidproofval2()) {
        return;
      }

      if (this.nomineeDetails2.nomineeprooftype == '') {
        this.Nominee2Prooftype = true;
        return;
      }
      // added by nitesh mitesh on 28022025 end

      // Relation ship
      if (this.nomineeDetails2.nom_relation == '') {
        this.Nominee2Relation = true;
        return;
      }

      // if (this.nomineeDetails2.nomineeOnedob == '') {
      //   this.Nominee2DOB = true;
      //   return;
      // }

      if (this.nomineeDetails2.nomineeAllocationRange == '') {
        this.Nominee2Allocation = true;
        return;
      }
    }

    if (count >= 3) {
      if (this.nomineeDetails3.nomineefname.trim().length == 0) {
        this.Nominee3FName = true;
        return;
      }
      if (regex.test(this.nomineeDetails3.nomineefname)) {
        this.Nominee3FSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails3.nomineefname)) {
        this.Nominee3FDigit = true;
        return;
      }
      if (this.nomineeDetails3.nomineefname?.trim().length == 0) {
        this.Nominee3FSpace = true;
        return;
      }

      // Last name validation
      if (this.nomineeDetails3.nomineelname.trim().length == 0) {
        this.Nominee3LName = true;
        return;
      }
      if (regex.test(this.nomineeDetails3.nomineelname)) {
        this.Nominee3LSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails3.nomineelname)) {
        this.Nominee3LDigit = true;
        return;
      }
      if (this.nomineeDetails3.nomineelname?.trim().length == 0) {
        this.Nominee3LSpace = false;
        return;
      }

      // added by nitesh mitesh on 28022025 start
      if (!this.NomMobVal3()) {
        return;
      }

      if (!this.validateEmail3()) {
        return;
      }

      if (!this.nomineeidproofval3()) {
        return;
      }

      if (this.nomineeDetails3.nomineeprooftype == '') {
        this.Nominee3Prooftype = true;
        return;
      }
      // added by nitesh mitesh on 28022025 end

      // Relation ship
      if (this.nomineeDetails3.nom_relation == '') {
        this.Nominee3Relation = true;
        return;
      }

      // if (this.nomineeDetails3.nomineeOnedob == '') {
      //   this.Nominee3DOB = true;
      //   return;
      // }

      if (this.nomineeDetails3.nomineeAllocationRange == '') {
        this.Nominee3Allocation = true;
        return;
      }
    }

    // nominee address line 1
    if (this.nomineeDetails.nomineeApplicantCheck === false) {
      if (this.nomineeDetails.nomineeAddress1.trim().length == 0) {
        this.Nominee1AddLine1 = true;
        return;
      }
      if (this.nomineeDetails.nomineeAddress1.trim().length == 0) {
        this.Nominee1AddLine1Space = false;

        return;
      }

      // nominee 1 pincode
      if (this.nomineeDetails.nomineePincode == '') {
        this.Nominee1AddLine2Space = false;
        this.Nominee1AddLine3Space = false;
        this.Nominee1Pincode = true;
        return;
      }
      if (String(this.nomineeDetails.nomineePincode).length != 6) {
        this.Nominee1PincodeLength = true;
        return;
      }
    }

    if (
      this.visibleAccordions === 1 &&
      this.nomineeDetails.nomineeApplicantCheck === false
    ) {
      // nominee 1 State

      // if (
      //   this.nomineeDetails.nomineeState == '' ||
      //   this.nomineeDetails.nomineeState == 'Select State'
      // ) {
      //   this.Nominee1State = true;
      //   return;
      // }

      // nominee 1 city
      if (
        this.nomineeDetails.nomineeCity == '' ||
        this.nomineeDetails.nomineeCity == 'Select City'
      ) {
        this.Nominee1City = true;
        return;
      }
    }
    // console.log("sasd",this.nomineeDetails)
    // console.log("sdada",this.nomineeOneGuardian)

    if (
      this.nomineeOneGuardian == true
      //   && (this.nomineeDetails.nomineeGuardianFirstName
      //   || this.nomineeDetails.nomineeGuardianLastName
      //   || this.nomineeDetails.nom_guard_relation
      //   || this.nomineeDetails.nomineeGuardianAddress1
      //   || this.nomineeDetails.nomineeGuardianAddress2
      //   || this.nomineeDetails.nomineeGuardianAddress3
      //   || this.nomineeDetails.nomineeGuardianCity
      //   || this.nomineeDetails.nomineeGuardianState
      //   || this.nomineeDetails.nomineeGuardianEmail
      //   || this.nomineeDetails.nomineeGuardianMobile
      //   || this.nomineeDetails.nomineeGuardianProofType
      //   || this.nomineeDetails.nomineeGuardianProofnumber

      // )
    ) {
      // console.log("IDHAR AAYA")
      // console.log("DSAFAFA",this.nomineeDetails.nomineeGuardianAddress1)

      // Guardian1 First name
      if (this.nomineeDetails.nomineeGuardianFirstName.trim().length == 0) {
        this.Nominee1FGuardianName = true;
        return;
      }
      if (regex.test(this.nomineeDetails.nomineeGuardianFirstName)) {
        this.Nominee1FGuardianSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails.nomineeGuardianFirstName)) {
        this.Nominee1FGuardianDigit = true;
        return;
      }
      if (this.nomineeDetails.nomineeGuardianFirstName.trim().length == 0) {
        this.Nominee1FGuardianSpace = false;
        return;
      }

      // Guardian1 Last name
      if (this.nomineeDetails.nomineeGuardianLastName.trim().length == 0) {
        this.Nominee1LGuardianName = true;
        return;
      }
      if (regex.test(this.nomineeDetails.nomineeGuardianLastName)) {
        this.Nominee1LGuardianSpecial = true;
      }
      if (/\d/.test(this.nomineeDetails.nomineeGuardianLastName)) {
        this.Nominee1LGuardianDigit = true;
      }
      if (this.nomineeDetails.nomineeGuardianLastName.trim().length == 0) {
        this.Nominee1LGuardianSpace = false;
      }
      if (this.nomineeDetails.nomineeGuardianMobile.trim() == '') {
        this.Nominee1GuarMobilerror = true;
        return;
      }

      if (this.nomineeDetails.nomineeGuardianEmail.trim() == '') {
        this.isEmailDisableBtnGuar1 = true;
        return;
      }

      if (this.nomineeDetails.nomineeGuardianProofType.trim() == '') {
        this.NomineeGuar1Prooftype = true;
        this.NomineeGuar1ProofIdNo = true;
        return;
      }
      // Guardian1 Relationship
      if (this.nomineeDetails.nom_guard_relation.trim() == '') {
        this.Nominee1GuardianRelation = true;
        return;
      }
      if (this.nomineeDetails.nomineeGuardianApplicantCheck == false) {
        if (this.nomineeDetails.nomineeGuardianAddress1.trim() == '') {
          this.Nominee1GuardianAddLine1 = true;
          return;
        }
        if (this.nomineeDetails.nomineeGuardianAddress2.trim() == '') {
          this.Nominee1GuardianAddLine2 = true;
          return;
        }
        if (this.nomineeDetails.nomineeGuardianAddress3.trim() == '') {
          this.Nominee1GuardianAddLine3 = true;
          return;
        }
        if (this.nomineeDetails.nomineeGuardianPincode.trim() == '') {
          this.Nominee1GuardianPincode = true;
          return;
        }
        if (this.nomineeDetails.nomineeGuardianState.trim() == '') {
          this.Nominee1GuardianPincode = true;
          return;
        }

        if (this.nomineeDetails.nomineeGuardianCity.trim() == '') {
          this.Nominee1GuardianCity = true;
          return;
        }
      }
    }
    if (this.nomineeDetails2.nomineeApplicantCheck === false) {
      // nominee address line 1
      if (this.nomineeDetails2.nomineeAddress1.trim().length == 0) {
        this.Nominee2AddLine1 = true;
        return;
      }
      if (this.nomineeDetails2.nomineeAddress1.trim().length == 0) {
        this.Nominee2AddLine1Space = false;
        return;
      }
      // nominee 1 pincode
      if (this.nomineeDetails2.nomineePincode == '') {
        this.Nominee2AddLine2Space = false;
        this.Nominee2AddLine3Space = false;
        this.Nominee2Pincode = true;
        return;
      }
      if (String(this.nomineeDetails2.nomineePincode).length != 6) {
        this.Nominee2PincodeLength = true;
        return;
      }
    }

    if (
      this.visibleAccordions === 2 &&
      this.nomineeDetails2.nomineeApplicantCheck === false
    ) {
      // nominee 2 State

      // if (
      //   this.nomineeDetails2.nomineeState == '' ||
      //   this.nomineeDetails2.nomineeState == 'Select State'
      // ) {
      //   this.Nominee2State = true;
      //   return;
      // }

      // nominee 1 city
      if (
        this.nomineeDetails2.nomineeCity == '' ||
        this.nomineeDetails2.nomineeCity == 'Select City'
      ) {
        this.Nominee2City = true;
        return;
      }
    }

    if (
      this.nomineeTwoGuardian == true
      //   && (this.nomineeDetails2.nomineeGuardianFirstName
      //   || this.nomineeDetails2.nomineeGuardianFirstName
      //   || this.nomineeDetails2.nomineeGuardianLastName
      //   || this.nomineeDetails2.nom_guard_relation
      //   || this.nomineeDetails2.nomineeGuardianAddress1
      //   || this.nomineeDetails2.nomineeGuardianAddress2
      //   || this.nomineeDetails2.nomineeGuardianCity
      //   || this.nomineeDetails2.nomineeGuardianState
      //   || this.nomineeDetails2.nomineeGuardianEmail
      //   || this.nomineeDetails2.nomineeGuardianMobile
      //   || this.nomineeDetails2.nomineeGuardianProofType
      //   || this.nomineeDetails2.nomineeGuardianProofnumber
      // )
    ) {
      // Guardian1 First name
      if (this.nomineeDetails2.nomineeGuardianFirstName.trim().length == 0) {
        this.Nominee2FGuardianName = true;
        return;
      }
      if (regex.test(this.nomineeDetails2.nomineeGuardianFirstName)) {
        this.Nominee2FGuardianSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails2.nomineeGuardianFirstName)) {
        this.Nominee2FGuardianDigit = true;
        return;
      }
      if (this.nomineeDetails2.nomineeGuardianFirstName.trim().length == 0) {
        this.Nominee2FGuardianSpace = false;
        return;
      }

      // Guardian1 Last name
      if (this.nomineeDetails2.nomineeGuardianLastName.trim().length == 0) {
        this.Nominee2LGuardianName = true;
        return;
      }
      if (regex.test(this.nomineeDetails2.nomineeGuardianLastName)) {
        this.Nominee2LGuardianSpecial = true;
      }
      if (/\d/.test(this.nomineeDetails2.nomineeGuardianLastName)) {
        this.Nominee2LGuardianDigit = true;
      }
      if (this.nomineeDetails2.nomineeGuardianLastName.trim().length == 0) {
        this.Nominee1LGuardianSpace = false;
      }
      if (this.nomineeDetails2.nomineeGuardianMobile.trim() == '') {
        this.Nominee2GuarMobilerror = true;
        return;
      }
      if (this.nomineeDetails2.nomineeGuardianEmail.trim() == '') {
        this.isEmailDisableBtnGuar2 = true;
        return;
      }

      if (this.nomineeDetails2.nomineeGuardianProofType.trim() == '') {
        this.NomineeGuar2Prooftype = true;
        this.NomineeGuar2ProofIdNo = true;
        return;
      }
      // Guardian1 Relationship
      if (this.nomineeDetails2.nom_guard_relation.trim() == '') {
        this.Nominee2GuardianRelation = true;
        return;
      }
      if (this.nomineeDetails2.nomineeGuardianApplicantCheck == false) {
        if (this.nomineeDetails2.nomineeGuardianAddress1.trim() == '') {
          this.Nominee2GuardianAddLine1 = true;
          return;
        }
        if (this.nomineeDetails2.nomineeGuardianAddress2.trim() == '') {
          this.Nominee2GuardianAddLine2 = true;
          return;
        }
        if (this.nomineeDetails2.nomineeGuardianAddress3.trim() == '') {
          this.Nominee2GuardianAddLine3 = true;
          return;
        }
        if (this.nomineeDetails2.nomineeGuardianPincode.trim() == '') {
          this.Nominee2GuardianPincode = true;
          return;
        }
        if (this.nomineeDetails2.nomineeGuardianState.trim() == '') {
          this.Nominee2GuardianPincode = true;
          return;
        }

        if (this.nomineeDetails2.nomineeGuardianCity.trim() == '') {
          this.Nominee2GuardianCity = true;
          return;
        }
      }
    }
    // if (count == 3) {
    //   var percent1 =
    //     parseInt(this.nomineeDetails.nomineeAllocationRange) +
    //     parseInt(this.nomineeDetails2.nomineeAllocationRange) +
    //     parseInt(this.nomineeDetails3.nomineeAllocationRange);

    //   if (percent1 < 100 || percent1 != 100 || percent1 > 100) {
    //     this.toastr.warning(
    //       // 'Total Allocation should be 100%',
    //       'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination',
    //       'Nominee 1,2,3',
    //       {
    //         positionClass: 'toast-bottom-center',
    //         timeOut: 2000,
    //       }
    //     );
    //     return;
    //   }
    // }

    if (this.nomineeDetails3.nomineeApplicantCheck === false) {
      // nominee address line 1
      if (this.nomineeDetails3.nomineeAddress1.trim().length == 0) {
        this.Nominee3AddLine1 = true;
        return;
      }
      if (this.nomineeDetails3.nomineeAddress1.trim().length == 0) {
        this.Nominee3AddLine1Space = false;

        return;
      }
      // nominee 1 pincode
      if (this.nomineeDetails3.nomineePincode.trim() == '') {
        this.Nominee3AddLine2Space = false;
        this.Nominee3AddLine3Space = false;
        this.Nominee3Pincode = true;
        return;
      }
      if (String(this.nomineeDetails3.nomineePincode).length != 6) {
        this.Nominee3PincodeLength = true;
        return;
      }
    }

    if (
      this.visibleAccordions === 3 &&
      this.nomineeDetails3.nomineeApplicantCheck === false
    ) {
      // nominee 1 State

      // if (
      //   this.nomineeDetails3.nomineeState == '' ||
      //   this.nomineeDetails3.nomineeState == 'Select State'
      // ) {
      //   this.Nominee3State = true;
      //   return;
      // }

      // nominee 1 city
      if (
        this.nomineeDetails3.nomineeCity == '' ||
        this.nomineeDetails3.nomineeCity == 'Select City'
      ) {
        this.Nominee3City = true;
        return;
      }
    }

    if (
      this.nomineeThreeGuardian === true
      //   && (this.nomineeDetails3.nomineeGuardianFirstName
      //   || this.nomineeDetails3.nomineeGuardianFirstName
      //   || this.nomineeDetails3.nomineeGuardianLastName
      //   || this.nomineeDetails3.nom_guard_relation
      //   || this.nomineeDetails3.nomineeGuardianAddress1
      //   || this.nomineeDetails3.nomineeGuardianAddress2
      //   || this.nomineeDetails3.nomineeGuardianCity
      //   || this.nomineeDetails3.nomineeGuardianState
      //   || this.nomineeDetails3.nomineeGuardianEmail
      //   || this.nomineeDetails3.nomineeGuardianMobile
      //   || this.nomineeDetails3.nomineeGuardianProofType
      //   || this.nomineeDetails3.nomineeGuardianProofnumber
      // )
    ) {
      // Guardian1 First name
      if (this.nomineeDetails3.nomineeGuardianFirstName.trim().length == 0) {
        this.Nominee3FGuardianName = true;
        return;
      }
      if (regex.test(this.nomineeDetails3.nomineeGuardianFirstName)) {
        this.Nominee3FGuardianSpecial = true;
        return;
      }
      if (/\d/.test(this.nomineeDetails3.nomineeGuardianFirstName)) {
        this.Nominee3FGuardianDigit = true;
        return;
      }
      if (this.nomineeDetails3.nomineeGuardianFirstName.trim().length == 0) {
        this.Nominee3FGuardianSpace = false;
        return;
      }

      // Guardian1 Last name
      if (this.nomineeDetails3.nomineeGuardianLastName.trim().length == 0) {
        this.Nominee3LGuardianName = true;
        return;
      }
      if (regex.test(this.nomineeDetails3.nomineeGuardianLastName)) {
        this.Nominee3LGuardianSpecial = true;
      }
      if (/\d/.test(this.nomineeDetails3.nomineeGuardianLastName)) {
        this.Nominee3LGuardianDigit = true;
      }
      if (this.nomineeDetails3.nomineeGuardianLastName.trim().length == 0) {
        this.Nominee3LGuardianSpace = false;
      }
      if (this.nomineeDetails3.nomineeGuardianMobile.trim() == '') {
        this.Nominee3GuarMobilerror = true;
        return;
      }
      if (this.nomineeDetails3.nomineeGuardianEmail.trim() == '') {
        this.isEmailDisableBtnGuar3 = true;
        return;
      }

      if (this.nomineeDetails3.nomineeGuardianProofType.trim() == '') {
        this.NomineeGuar3Prooftype = true;
        this.NomineeGuar3ProofIdNo = true;
        return;
      }
      // Guardian1 Relationship
      if (this.nomineeDetails3.nom_guard_relation.trim() == '') {
        this.Nominee3GuardianRelation = true;
        return;
      }
      if (this.nomineeDetails3.nomineeGuardianApplicantCheck == false) {
        if (this.nomineeDetails3.nomineeGuardianAddress1 == '') {
          this.Nominee3GuardianAddLine1 = true;
          return;
        }
        if (this.nomineeDetails3.nomineeGuardianAddress2.trim() == '') {
          this.Nominee3GuardianAddLine2 = true;
          return;
        }
        if (this.nomineeDetails3.nomineeGuardianAddress3.trim() == '') {
          this.Nominee3GuardianAddLine3 = true;
          return;
        }
        console.log(
          'nominee3 guardian pincode:- ',
          this.nomineeDetails3.nomineeGuardianPincode
        );
        if (this.nomineeDetails3.nomineeGuardianPincode.trim() == '') {
          this.Nominee3GuardianPincode = true;
          return;
        }
        if (this.nomineeDetails3.nomineeGuardianState.trim() == '') {
          this.Nominee3GuardianPincode = true;
          return;
        }

        if (this.nomineeDetails3.nomineeGuardianCity.trim() == '') {
          this.Nominee3GuardianCity = true;
          return;
        }
      }
    }

    // if (count != 0) {
    //   var percent1 = parseInt(this.nomineeDetails.nomineeAllocationRange);
    //   var percent2 = parseInt(this.nomineeDetails2.nomineeAllocationRange);
    //   var percent3 = parseInt(this.nomineeDetails3.nomineeAllocationRange);

    //   if (percent1 === 0 || percent2 === 0 || percent3 === 0) {
    //     // this.toastr.warning('Allocation cannot be 0%', 'Nominees', {
    //     this.toastr.warning(
    //       'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination',
    //       'Nominees',
    //       {
    //         positionClass: 'toast-bottom-center',
    //         timeOut: 2000,
    //       }
    //     );
    //     return;
    //   }
    // }

    let reqData = [];
    if (count >= 1) {
      this.nomineeDetails.nomineeOnedob = this.NomineeOneDob;

      const nomineeGuardiandob = this.nomineeDetails.nomineeGuardiandob;

      if (nomineeGuardiandob instanceof Date) {
        this.nomineeDetails.nomineeGuardiandob = this.datePipe.transform(
          this.nomineeDetails.nomineeGuardiandob,
          'dd/MM/yyyy'
        );
      } else {
        this.nomineeDetails.nomineeGuardiandob =
          this.nomineeDetails.nomineeGuardiandob;
      }

      reqData.push(this.nomineeDetails);
    }
    if (count >= 2) {
      this.nomineeDetails2.nomineeOnedob = this.NomineeTwoDob;

      const nomineeGuardiandob = this.nomineeDetails2.nomineeGuardiandob;

      if (nomineeGuardiandob instanceof Date) {
        this.nomineeDetails2.nomineeGuardiandob = this.datePipe.transform(
          this.nomineeDetails2.nomineeGuardiandob,
          'dd/MM/yyyy'
        );
      } else {
        this.nomineeDetails2.nomineeGuardiandob =
          this.nomineeDetails2.nomineeGuardiandob;
      }

      reqData.push(this.nomineeDetails2);
    }
    if (count === 3) {
      this.nomineeDetails3.nomineeOnedob = this.NomineeThreeDob;

      const nomineeGuardiandob = this.nomineeDetails3.nomineeGuardiandob;

      if (nomineeGuardiandob instanceof Date) {
        this.nomineeDetails3.nomineeGuardiandob = this.datePipe.transform(
          this.nomineeDetails3.nomineeGuardiandob,
          'dd/MM/yyyy'
        );
      } else {
        this.nomineeDetails3.nomineeGuardiandob =
          this.nomineeDetails3.nomineeGuardiandob;
      }

      reqData.push(this.nomineeDetails3);
    }
    // console.log("REQES",reqData)
    this.spinner.show();

    this._http
      .postRequest('api/v1/personalDetail/nomineesave', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        this.spinner.hide();
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          if (response[0].Msg === 'Data Save Sucessfully') {
            // this.toastr.success('Data Saved Successfully', 'Nominees', {
            //   positionClass: 'toast-bottom-center',
            //   timeOut: 2000,
            // });

            this.MoengageService.trackEvent('Nominee Submission', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Noof_NomineeAdded: count,
              product_name: 'Onboarding DIY',
              category: 'Nominee',
            });

            setTimeout(() => {
              this.router.navigate(['/esign']);
              this.spinner.hide();
            }, 200);
          } else if (
            response[0].Msg ===
            'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination'
          ) {
            this.MoengageService.trackEvent('Nominee Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Noof_NomineeAdded: count,
              ErrorMsg: response[0].Msg,
              product_name: 'Onboarding DIY',
              category: 'Nominee',
            });

            this.toastr.success(response[0].Msg, 'Nominees', {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            });

            //this.router.navigate(['/esign']);

            this.spinner.hide();
          } else {
            this.MoengageService.trackEvent('Nominee Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Noof_NomineeAdded: count,
              ErrorMsg: response.message,
              product_name: 'Onboarding DIY',
              category: 'Nominee',
            });

            this.toastr.error('Something went wrong...', 'Nominees', {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            });

            this.spinner.hide();

            return;
          }
        } else {
          if (
            response.message ===
            'Oops! Total percentage of share cannot be more or less than 100%. Please check the share of nominee and continue or optout from nomination'
          ) {
            this.MoengageService.trackEvent('Nominee Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Noof_NomineeAdded: count,
              ErrorMsg: response.message,
              product_name: 'Onboarding DIY',
              category: 'Nominee',
            });

            this.toastr.success(response.message, 'Nominees', {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            });

            //this.router.navigate(['/esign']);

            this.spinner.hide();
          } else {
            this.MoengageService.trackEvent('Nominee Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Noof_NomineeAdded: count,
              ErrorMsg: response.message,
              product_name: 'Onboarding DIY',
              category: 'Nominee',
            });

            this.toastr.error(response.message, 'Nominees', {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            });
          }
        }
      });
  }

  save_optoutstatus(data: string) {
    this.spinner.show();
    window.sessionStorage.setItem('NomineeOptOut', 'NomineeOptOut');

    const reqData = {
      formnumber: window.sessionStorage.getItem('FormNumber'),
      flag: 'NomineeOptOut',
      nomineeOptOut: data,
      utm_source: this.utm_source,
      utm_medium: this.utm_medium,
      utm_campaign: this.utm_campaign,
    };

    this._http
      .postRequest('api/v1/personalDetail/nomineeoptstatus', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (response[0].Msg === 'Data Updated') {
            // this.toastr.success('Data Saved Successfully', 'NomineesOptOut', {
            //   positionClass: 'toast-bottom-center',
            //   timeOut: 2000,
            // });

            this.MoengageService.trackEvent('Nominee Submission', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Action: 'Nominee Opt Out',
              product_name: 'Onboarding DIY',
              category: 'Nominee',
            });

            setTimeout(() => {
              // this.spinner.hide();
              // return
              this.router.navigate(['/esign']);
              this.spinner.hide();
            }, 200);
          } else {
            this.MoengageService.trackEvent('Nominee Submission Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              Action: 'Nominee Opt Out',
              ErrorMsg: response.message,
              product_name: 'Onboarding DIY',
              category: 'Nominee',
            });

            this.toastr.error('Something went Wrong..', 'NomineesOptOut', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });

            this.spinner.hide();
          }
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

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName
    )}`;
  }
}
