import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UploadProcessComponent } from './upload-process/upload-process.component';
// import { DiymainpwaComponent } from './diymainpwa/diymainpwa.component';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';
import { PlanPreferenceComponent } from './plan-preference/plan-preference.component';
import { AddNomineeComponent } from './add-nominee/add-nominee.component';
import { UploadSignatureComponent } from './upload-signature/upload-signature.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AdhaarCopyComponent } from './adhaar-copy/adhaar-copy.component';
import { EsignComponent } from './esign/esign.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { AuthGuard } from './auth.service';
import { TradingExpComponent } from './trading-exp/trading-exp.component';
import { AnnualIncomeComponent } from './annual-income/annual-income.component';
import { OccupDetailsComponent } from './occup-details/occup-details.component';
import { FatherSpouseNameComponent } from './father-spouse-name/father-spouse-name.component';
import { LinkBankAccountComponent } from './link-bank-account/link-bank-account.component';
import { PennyDropComponent } from './penny-drop/penny-drop.component';
import { ReversePennyDropComponent } from './reverse-penny-drop/reverse-penny-drop.component';
import { DeclarationComponent } from './declaration/declaration.component';
import { SegmentPreferenceComponent } from './segment-preference/segment-preference.component';
import { SelfieComponent } from './selfie/selfie.component';
import { RpdComponent } from './rpd/rpd.component';
import { HomeComponent } from './home/home.component';
import { UploadPanComponent } from './upload-pan/upload-pan.component';
import { NameChangeComponent } from './name-change/name-change.component';
import { YonoEmailComponent } from './yono-email/yono-email.component';
import { YonoSsoComponent } from './yono-sso/yono-sso.component';
import { YonoMobileComponent } from './yono-mobile/yono-mobile.component';
import { MsfSsoComponent } from './msf-sso/msf-sso.component';
import { UploadAdditionalComponent } from './upload-additional/upload-additional.component';
import { UploadAadhaarFrontComponent } from './upload-aadhaar-front/upload-aadhaar-front.component';
import { UploadAadhaarBackComponent } from './upload-aadhaar-back/upload-aadhaar-back.component';
import { FaqNeedHelpComponent } from './faq-need-help/faq-need-help.component';
import { FnoesignComponent } from './fnoesign/fnoesign.component';
import { AggregatorCallbackComponent } from './aggregator-callback/aggregator-callback.component';
import { BpSsoComponent } from './bp-sso/bp-sso.component';
import { FnothankyouComponent } from './fnothankyou/fnothankyou.component';
import { UploadSupportingComponent } from './upload-supporting/upload-supporting.component';
import { MobileHomeOtpScreenComponent } from './mobile-home-otp-screen/mobile-home-otp-screen.component';
import { EmailHomeScreenComponent } from './email-home-screen/email-home-screen.component';
import { EmailHomeOtpScreenComponent } from './email-home-otp-screen/email-home-otp-screen.component';
import { EmailHomePageComponent } from './email-home-page/email-home-page.component';
// import { NomineeOptoutComponent } from './nominee-optout/nominee-optout.component';
// import { NomineeComponent } from './nominee/nominee.component';
// import { NomineeCallbackComponent } from './nominee-callback/nominee-callback.component';
import { DigilockerScreenComponent } from './digilocker-screen/digilocker-screen.component';
import { YonotabSsoComponent } from './yonotab-sso/yonotab-sso.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: '' },
  // { path: '', component: DiymainpwaComponent },
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'mobile-home-otp', component: MobileHomeOtpScreenComponent },
  { path: 'email', component: EmailHomeScreenComponent },
  { path: 'email-home-textpage', component: EmailHomePageComponent },
  { path: 'email-home-otp', component: EmailHomeOtpScreenComponent },
  { path: 'digilocker-screen', component: DigilockerScreenComponent },
  { path: 'msf-sso/:refno', component: MsfSsoComponent },
  { path: 'yono-sso/:refno', component: YonoSsoComponent },
  { path: 'yonotab-sso/:refno', component: YonotabSsoComponent },
  { path: 'yono-mobile', component: YonoMobileComponent },
  { path: 'yono-email', component: YonoEmailComponent },
  { path: 'uploadProcess/:formNumber', component: UploadProcessComponent },
  { path: 'aadhar', component: AdhaarCopyComponent },
  { path: 'personalDetailsForm/1', component: PersonalDetailsFormComponent },
  { path: 'personalDetailsForm/2', component: TradingExpComponent },
  { path: 'personalDetailsForm/3', component: AnnualIncomeComponent },
  { path: 'personalDetailsForm/4', component: OccupDetailsComponent },
  { path: 'personalDetailsForm/5', component: FatherSpouseNameComponent },
  // { path: 'personalDetailsForm/6', component: LinkBankAccountComponent },
  { path: 'PennyDrop/:formNumber', component: PennyDropComponent },
  {
    path: 'reversePennyDrop/:formNumber',
    component: ReversePennyDropComponent,
  },
  { path: 'reversePennyDropRpd/:formNumber', component: RpdComponent },
  { path: 'planprocess/1', component: DeclarationComponent },
  { path: 'planprocess/2', component: PlanPreferenceComponent },
  { path: 'planprocess/3', component: SegmentPreferenceComponent },
  { path: 'CaptureSelfie/:formNumber', component: SelfieComponent },
  // { path: 'nominee-optout/:formNumber', component: NomineeOptoutComponent },
  { path: 'uploadSignature', component: UploadSignatureComponent },
  { path: 'uploadPan', component: UploadPanComponent },

  { path: 'nameChange', component: NameChangeComponent },
  { path: 'support-document', component: UploadSupportingComponent },

  { path: 'additional-document', component: UploadAdditionalComponent },
  { path: 'aadhaar-front', component: UploadAadhaarFrontComponent },
  { path: 'aadhaar-back', component: UploadAadhaarBackComponent },

  { path: 'addNominee/:formNumber', component: AddNomineeComponent },
  // { path: 'nominee/:formNumber', component: NomineeComponent },
  //{ path: 'addNominee/:formNumber', component: NomineeComponent },

  { path: 'esign', component: EsignComponent },
  { path: 'fnoesign', component: FnoesignComponent },
  { path: 'aacallback', component: AggregatorCallbackComponent },
  // { path: 'nominee-callback', component: NomineeCallbackComponent },

  { path: 'bp-sso/:formNumber', component: BpSsoComponent },

  { path: 'thankyou', component: ThankyouComponent },
  { path: 'fno-thankyou', component: FnothankyouComponent },

  { path: 'faq', component: FaqNeedHelpComponent },
  { path: 'page-not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
