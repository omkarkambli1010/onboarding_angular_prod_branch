import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { DiymainpwaComponent } from './diymainpwa/diymainpwa.component';
import { UploadProcessComponent } from './upload-process/upload-process.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi, withXhr } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { PersonalDetailsFormComponent } from './personal-details-form/personal-details-form.component';
import { PlanPreferenceComponent } from './plan-preference/plan-preference.component';
import { AddNomineeComponent } from './add-nominee/add-nominee.component';
import { UploadSignatureComponent } from './upload-signature/upload-signature.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgxSpinnerModule } from "ngx-spinner";
import { WebcamModule } from 'ngx-webcam';
import { ToastrModule } from 'ngx-toastr';
import { ImageCropperComponent } from 'ngx-image-cropper';
import { AdhaarCopyComponent } from './adhaar-copy/adhaar-copy.component';
import { EsignComponent } from './esign/esign.component';
import { ThankyouComponent } from './thankyou/thankyou.component';
import { DatePipe } from '@angular/common';
import { DatePickerModule } from 'primeng/datepicker';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { InputOtpModule } from 'primeng/inputotp';
import { NgOtpInputModule } from 'ng-otp-input';
import { TradingExpComponent } from './trading-exp/trading-exp.component';
import { AnnualIncomeComponent } from './annual-income/annual-income.component';
import { OccupDetailsComponent } from './occup-details/occup-details.component';
import { FatherSpouseNameComponent } from './father-spouse-name/father-spouse-name.component';
import { ReversePennyDropComponent } from './reverse-penny-drop/reverse-penny-drop.component';
import { PennyDropComponent } from './penny-drop/penny-drop.component';
import { LinkBankAccountComponent } from './link-bank-account/link-bank-account.component';
import { DeclarationComponent } from './declaration/declaration.component';
import { SegmentPreferenceComponent } from './segment-preference/segment-preference.component';
import { SelfieComponent } from './selfie/selfie.component';
import { NavigationService } from './navigation.service';
import { APIService } from './api.service';
import { BackButtonDisableModule } from 'angular-disable-browser-back-button';
import { EmojiBlockerDirective } from './emoji-blocker.directive';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { QRCodeComponent } from 'angularx-qrcode';
import { RpdComponent } from './rpd/rpd.component';
import { HomeComponent } from './home/home.component';
import { NameChangeComponent } from './name-change/name-change.component';
import { UploadPanComponent } from './upload-pan/upload-pan.component';
import { YonoEmailComponent } from './yono-email/yono-email.component';
import { YonoMobileComponent } from './yono-mobile/yono-mobile.component';
import { YonoSsoComponent } from './yono-sso/yono-sso.component';
import { MsfSsoComponent } from './msf-sso/msf-sso.component';
import { UploadAdditionalComponent } from './upload-additional/upload-additional.component';
import { UploadAadhaarFrontComponent } from './upload-aadhaar-front/upload-aadhaar-front.component';
import { UploadAadhaarBackComponent } from './upload-aadhaar-back/upload-aadhaar-back.component';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { CarouselModule } from 'primeng/carousel';
import { MoengagesdkService } from './moengagesdk.service';
import { AuthService } from './auth.service';
import { ExtensionService } from './extension.service';
import { FaqNeedHelpComponent } from './faq-need-help/faq-need-help.component';
import { AggregatorCallbackComponent } from './aggregator-callback/aggregator-callback.component';
import { FnothankyouComponent } from './fnothankyou/fnothankyou.component';
import { FnoesignComponent } from './fnoesign/fnoesign.component';
import { SafeUrlPipe } from './safe-url.pipe';
import { BpSsoComponent } from './bp-sso/bp-sso.component';
import { UploadSupportingComponent } from './upload-supporting/upload-supporting.component';
import { MobileHomeOtpScreenComponent } from './mobile-home-otp-screen/mobile-home-otp-screen.component';
import { EmailHomeScreenComponent } from './email-home-screen/email-home-screen.component';
import { EmailHomeOtpScreenComponent } from './email-home-otp-screen/email-home-otp-screen.component';
import { EmailHomePageComponent } from './email-home-page/email-home-page.component';
import { NomineeComponent } from './nominee/nominee.component';
import { NomineeOptoutComponent } from './nominee-optout/nominee-optout.component';
import { NomineeCallbackComponent } from './nominee-callback/nominee-callback.component';
import { DigilockerScreenComponent } from './digilocker-screen/digilocker-screen.component';
import { YonotabSsoComponent } from './yonotab-sso/yonotab-sso.component';


@NgModule({ declarations: [
        AppComponent,
        UploadProcessComponent,
        HeaderComponent,
        PersonalDetailsFormComponent,
        PlanPreferenceComponent,
        AddNomineeComponent,
        UploadSignatureComponent,
        PageNotFoundComponent,
        AdhaarCopyComponent,
        EsignComponent,
        ThankyouComponent,
        TradingExpComponent,
        AnnualIncomeComponent,
        OccupDetailsComponent,
        FatherSpouseNameComponent,
        ReversePennyDropComponent,
        PennyDropComponent,
        LinkBankAccountComponent,
        DeclarationComponent,
        SegmentPreferenceComponent,
        SelfieComponent,
        EmojiBlockerDirective,
        RpdComponent,
        HomeComponent,
        NameChangeComponent,
        UploadPanComponent,
        YonoEmailComponent,
        YonoMobileComponent,
        YonoSsoComponent,
        MsfSsoComponent,
        UploadAdditionalComponent,
        UploadAadhaarFrontComponent,
        UploadAadhaarBackComponent,
        FaqNeedHelpComponent,
        AggregatorCallbackComponent,
        FnothankyouComponent,
        FnoesignComponent,
        SafeUrlPipe,
        BpSsoComponent,
        UploadSupportingComponent,
        MobileHomeOtpScreenComponent,
        EmailHomeScreenComponent,
        EmailHomeOtpScreenComponent,
        EmailHomePageComponent,
        NomineeComponent,
        NomineeOptoutComponent,
        NomineeCallbackComponent,
        DigilockerScreenComponent,
        YonotabSsoComponent
    ],
    schemas: [CUSTOM_ELEMENTS_SCHEMA],
    bootstrap: [AppComponent], imports: [BrowserModule,
        InputOtpModule,
        NgOtpInputModule,
        AppRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        ImageCropperComponent,
        BrowserAnimationsModule,
        NgxSpinnerModule,
        WebcamModule,
        DatePickerModule,
        PdfViewerModule,
        ToastrModule.forRoot(),
        QRCodeComponent,
        AutoCompleteModule,
        CarouselModule,
        BackButtonDisableModule.forRoot({
            preserveScroll: true
        })], providers: [DatePipe, NavigationService, APIService, MoengagesdkService, AuthService, ExtensionService, provideHttpClient(withXhr(), withInterceptorsFromDi()), providePrimeNG({ theme: { preset: Lara, options: { darkModeSelector: false } } })] })
export class AppModule { }
