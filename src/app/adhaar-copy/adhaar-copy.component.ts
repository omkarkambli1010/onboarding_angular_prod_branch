import { Component, OnInit } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { AesService } from '../aes.service';
import { APIService } from '../api.service';
import { ToastrService } from 'ngx-toastr';
import { Location } from '@angular/common';
import { NavigationService } from '../navigation.service';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
  selector: 'app-adhaar-copy',
  templateUrl: './adhaar-copy.component.html',
  styleUrls: ['./adhaar-copy.component.css'],
})
export class AdhaarCopyComponent {
  clientid: any;
  guid: any;
  personalFormNumber: any;
  aadharResponse: any;
  aadharPhotoSrc: any;
  aadharAddress: any;
  errorValue: any;
  isKraBenefit: boolean = false;
  isDigiLockerSuccess = false;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  redirectFlag: any = false;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private _http: APIService,
    private aesService: AesService,
    private toastr: ToastrService,
    private route: ActivatedRoute,
    private _location: Location,
    private navService: NavigationService,
    private MoengageService: MoengagesdkService,
  ) {
    this.MoengageService.MoeInit();

    setTimeout(() => {
      this.MoengageService.setUserAttributes(
        window.sessionStorage.getItem('FormNumber') ?? '',
        '',
        '',
        '',
        '',
      );
    }, 500);
  }

  ngOnInit(): void {
    this.title.setTitle('Aadhar Page - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Uploading the details of the customer.',
    });
    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.route.queryParams.subscribe((params) => {
      this.MoengageService.setUserAttributes(
        window.sessionStorage.getItem('FormNumber') ?? '',
        '',
        '',
        '',
        '',
      );

      if (params['error'] === 'user_cancelled' || params['error']) {
        window.sessionStorage.setItem('AadharPage', 'Please try Again');

        this.toastr.error('Please try Again!!', 'Aadhar', {
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
        });

        this.MoengageService.trackEvent('Aadhaar Verification Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          product_name: 'Onboarding DIY',
          category: 'Aadhaar Verification',
          ErrorMsg: params['error'],
        });

        setTimeout(() => {
          // this.router.navigate(['/uploadProcess', 1]);
          this.router.navigate(['/digilocker-screen']);
        }, 200);
      } else {
        const urlParams = new URLSearchParams(window.location.search);
        if (urlParams.get('code') === null) {
          this.fetchAadharData();
        } else {
          this.getAadharDetails();
        }
      }
    });
  }

  redirecPersonalDetails() {
    this.spinner.show();

    if (this.RejectStatus != 'R') {
      if (this.redirectFlag == true) {
        setTimeout(() => {
          this.router.navigate(['/personalDetailsForm', 1]);
        }, 200);

        this.spinner.hide();

        window.sessionStorage.removeItem('AadharPage');
      } else {
        this.MoengageService.trackEvent('Aadhaar Verification Error', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          product_name: 'Onboarding DIY',
          category: 'Aadhaar Verification',
          ErrorMsg:
            'Oops! We could not fetch all the required details from DigiLocker. Please retry to continue. For more support, please contact us',
        });

        setTimeout(() => {
          // this.router.navigate(['/uploadProcess', 1]);
          this.router.navigate(['/digilocker-screen']);

          this.toastr.error(
            'Oops! We could not fetch all the required details from DigiLocker. Please retry to continue. For more support, please contact us',
            'Error',
            {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            },
          );

          this.spinner.hide();
        }, 200);
      }
    } else {
      this.navService.navigateToNextStep();
    }
  }

  getAadharDetails() {
    this.spinner.show();
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    var reqData = {
      code: code,
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/Digilocker/getAadhaarDetails', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        debugger;
        if (response.status == true) {
          // this.toastr.success(response.message, '', {
          //   positionClass: 'toast-bottom-center',
          //   timeOut: 2000,
          // });
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
          this.redirectFlag = true;
          //let adhaarResp = JSON.parse(response);

          //console.log("Aadhar Response", response);
          let adhaarResp = JSON.parse(response.Table[0].data);
          //let table2 = JSON.parse(response.Table1[0])

          const rejectedRoutes = response.Table1.map(
            (entry: { dsw_StageUrl: any }) => entry.dsw_StageUrl,
          );

          this.navService.fetchRejectedRoutes(rejectedRoutes, 'Aadhar');

          //console.log('adhaarResp.data', adhaarResp);

          this.aadharResponse = adhaarResp.data;
          //console.log('this.aadharResponsea', this.aadharResponse);
          this.aadharPhotoSrc =
            'data:image/jpeg;base64,' + this.aadharResponse.photo;
          this.aadharAddress =
            this.aadharResponse.house +
            ',' +
            this.aadharResponse.street +
            ',' +
            this.aadharResponse.loc +
            ',' +
            this.aadharResponse.lm +
            ',' +
            this.aadharResponse.vtc +
            ',' +
            this.aadharResponse.dist +
            ',' +
            this.aadharResponse.pc +
            ',' +
            this.aadharResponse.state +
            ',' +
            this.aadharResponse.country;

          this.isDigiLockerSuccess = false;

          this.MoengageService.trackEvent('Aadhaar Verified', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            NameasperAadhaar: this.aadharResponse?.name,
            //DoBasperAadhaar: this.aadharResponse?.dob,
            GenderasperAadhaar: this.aadharResponse?.gender,
            //AddressasperAadhaar: this.aadharAddress,
            Last_4_digitofAadhaar:
              this.aadharResponse?.aadhaarNumber || this.aadharResponse?.uid,
            isKRAclient: adhaarResp.isKraBenefit ?? 'N',
            product_name: 'Onboarding DIY',
            category: 'Aadhaar Verification',
          });

          // this.MoengageService.setUserAttributes(
          //   window.sessionStorage.getItem('FormNumber') ?? '',
          //   '',
          //   '',
          //   '',
          //   ''
          // );

          window.sessionStorage.removeItem('AadharPage');

          this.spinner.hide();

          this._location.go('aadhar/');

          // if (code != null) {

          // if(this.RejectStatus === 'R')
          // {
          //   window.location.reload();
          // }
          //}
        } else {
          this.isDigiLockerSuccess = true;

          window.sessionStorage.setItem('AadharPage', response.message);

          this.MoengageService.trackEvent('Aadhaar Verification Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Aadhaar Verification',
            ErrorMsg: response.message,
          });

          setTimeout(() => {
            // this.router.navigate(['/uploadProcess', 1]);
            this.router.navigate(['/digilocker-screen']);
            this.spinner.hide();

            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            });
          }, 200);

          this.redirectFlag = false;
        }
      });
  }

  fetchAadharData() {
    this.spinner.show();
    var reqData = {
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/Digilocker/fetchAadhaarData', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          // this.toastr.success(response.message, '', {
          //   positionClass: 'toast-bottom-center',
          //   timeOut: 2000,
          // });
          response = JSON.parse(
            this.aesService.decrypt(
              response.data,
              this.clientid,
              this.clientid,
            ),
          );
          this.redirectFlag = true;
          let adhaarResp = response.Table[0];

          this.aadharResponse = adhaarResp;
          this.aadharPhotoSrc = this.aadharResponse?.photo;
          this.aadharAddress =
            this.aadharResponse?.house +
            ',' +
            this.aadharResponse?.street +
            ',' +
            this.aadharResponse?.location +
            ',' +
            this.aadharResponse?.landMark +
            ',' +
            this.aadharResponse?.vtc +
            ',' +
            this.aadharResponse?.dist +
            ',' +
            this.aadharResponse?.pincode +
            ',' +
            this.aadharResponse?.state +
            ',' +
            this.aadharResponse?.country;

          this.isDigiLockerSuccess = false;

          const rejectedRoutes = response.Table1.map(
            (entry: { dsw_StageUrl: any }) => entry.dsw_StageUrl,
          );

          this.navService.fetchRejectedRoutes(rejectedRoutes, 'Aadhar');

          if (adhaarResp.isKraBenefit == 'Y') {
            this.isKraBenefit = true;

            this.MoengageService.trackEvent('KRA Benefits', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              NameasperKRA: this.aadharResponse?.name,
              //DoBasperKRA: this.aadharResponse?.dob,
              GenderasperKRA: this.aadharResponse?.gender,
              //AddressasperKRA: this.aadharAddress,
              isKRAclient: adhaarResp.isKraBenefit,
              product_name: 'Onboarding DIY',
              category: 'KRA Verification',
            });

            // this.MoengageService.setUserAttributes(
            //   window.sessionStorage.getItem('FormNumber') ?? '',
            //   '',
            //   '',
            //   '',
            //   ''
            // );
          } else {
            this.MoengageService.trackEvent('Aadhaar Verified', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              NameasperAadhaar: this.aadharResponse?.name,
              //DoBasperAadhaar: this.aadharResponse?.dob,
              GenderasperAadhaar: this.aadharResponse?.gender,
              //AddressasperAadhaar: this.aadharAddress,
              Last_4_digitofAadhaar:
                this.aadharResponse?.aadhaarNumber || this.aadharResponse?.uid,
              isKRAclient: adhaarResp.isKraBenefit ?? 'N',
              product_name: 'Onboarding DIY',
              category: 'Aadhaar Verification',
            });
          }

          window.sessionStorage.removeItem('AadharPage');
          this.spinner.hide();
          this._location.go('aadhar/');
        } else {
          this.isDigiLockerSuccess = true;

          this.MoengageService.trackEvent('Aadhaar Verification Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Aadhaar Verification',
            ErrorMsg: response.message,
          });

          setTimeout(() => {
            this.router.navigate(['/uploadProcess', 1]);

            this.spinner.hide();

            this.toastr.warning(response.message, 'Warning', {
              positionClass: 'toast-bottom-center',
              timeOut: 4000,
            });
          }, 200);

          this.redirectFlag = false;
        }
      });
  }
}
