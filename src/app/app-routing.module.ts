import { NgModule } from '@angular/core';
import { RouterModule, Routes, TitleStrategy } from '@angular/router';
import { PageTitleStrategy } from './page-title.strategy';
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
  { path: '', component: HomeComponent, title: '' },
  { path: 'home', component: HomeComponent, title: '' },
  { path: 'mobile-home-otp', component: MobileHomeOtpScreenComponent, title: 'OTP Verification for Demat Account Opening' },
  { path: 'email', component: EmailHomeScreenComponent, title: 'Email Verification' },
  { path: 'email-home-textpage', component: EmailHomePageComponent, title: 'Email ID' },
  { path: 'email-home-otp', component: EmailHomeOtpScreenComponent, title: 'Email OTP Verification' },
  { path: 'digilocker-screen', component: DigilockerScreenComponent, title: 'DigiLocker Verification' },
  { path: 'msf-sso/:refno', component: MsfSsoComponent },
  { path: 'yono-sso/:refno', component: YonoSsoComponent },
  { path: 'yonotab-sso/:refno', component: YonotabSsoComponent, title: 'Signing In' },
  { path: 'yono-mobile', component: YonoMobileComponent, title: 'Mobile Verification' },
  { path: 'yono-email', component: YonoEmailComponent, title: 'Email Verification' },
  { path: 'uploadProcess/:formNumber', component: UploadProcessComponent, title: 'Upload Documents' },
  { path: 'aadhar', component: AdhaarCopyComponent, title: 'Aadhaar Verification' },
  { path: 'personalDetailsForm/1', component: PersonalDetailsFormComponent, title: 'Marital Status' },
  { path: 'personalDetailsForm/2', component: TradingExpComponent, title: 'Trading Experience' },
  { path: 'personalDetailsForm/3', component: AnnualIncomeComponent, title: 'Annual Income' },
  { path: 'personalDetailsForm/4', component: OccupDetailsComponent, title: 'Occupation Details' },
  { path: 'personalDetailsForm/5', component: FatherSpouseNameComponent, title: 'Personal Details' },
  { path: 'personalDetailsForm/6', component: LinkBankAccountComponent, title: 'Link Bank Account' },
  { path: 'PennyDrop/:formNumber', component: PennyDropComponent, title: 'Verify your Bank Account' },
  {
    path: 'reversePennyDrop/:formNumber',
    component: ReversePennyDropComponent,
    title: 'Verify your Bank Account',
  },
  { path: 'reversePennyDropRpd/:formNumber', component: RpdComponent, title: 'Verify your Bank Account' },
  { path: 'planprocess/1', component: DeclarationComponent, title: 'Declaration' },
  { path: 'planprocess/2', component: PlanPreferenceComponent, title: 'Plan Preference' },
  { path: 'planprocess/3', component: SegmentPreferenceComponent, title: 'Segment Preference' },
  { path: 'CaptureSelfie/:formNumber', component: SelfieComponent, title: 'Upload Selfie' },
  // { path: 'nominee-optout/:formNumber', component: NomineeOptoutComponent },
  { path: 'uploadSignature', component: UploadSignatureComponent, title: 'Upload Signature' },
  { path: 'uploadPan', component: UploadPanComponent, title: 'Upload PAN' },

  { path: 'nameChange', component: NameChangeComponent, title: 'Name Change' },
  { path: 'support-document', component: UploadSupportingComponent, title: 'Upload Supporting Document' },

  { path: 'additional-document', component: UploadAdditionalComponent, title: 'Upload Additional Document' },
  { path: 'aadhaar-front', component: UploadAadhaarFrontComponent, title: 'Upload Aadhaar Front' },
  { path: 'aadhaar-back', component: UploadAadhaarBackComponent, title: 'Upload Aadhaar Back' },

  { path: 'addNominee/:formNumber', component: AddNomineeComponent, title: 'Add Nominee' },
  // { path: 'nominee/:formNumber', component: NomineeComponent },
  //{ path: 'addNominee/:formNumber', component: NomineeComponent },

  { path: 'esign', component: EsignComponent, title: 'Esign Verification' },
  { path: 'fnoesign', component: FnoesignComponent, title: 'Derivatives Esign Verification' },
  { path: 'aacallback', component: AggregatorCallbackComponent },
  // { path: 'nominee-callback', component: NomineeCallbackComponent },

  { path: 'bp-sso/:formNumber', component: BpSsoComponent },

  { path: 'thankyou', component: ThankyouComponent, title: 'Thank You' },
  { path: 'fno-thankyou', component: FnothankyouComponent, title: 'Thank You' },

  { path: 'faq', component: FaqNeedHelpComponent, title: 'Frequently Asked Questions' },
  { path: 'page-not-found', component: PageNotFoundComponent, title: 'Page Not Found' },
  { path: '**', redirectTo: 'page-not-found' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [{ provide: TitleStrategy, useClass: PageTitleStrategy }],
})
export class AppRoutingModule {}
