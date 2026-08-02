import { Component } from '@angular/core';
import { APIService } from '../api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { Meta, Title } from '@angular/platform-browser';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
  selector: 'app-esign',
  templateUrl: './esign.component.html',
  styleUrls: ['./esign.component.css'],
})
export class EsignComponent {
  PersonalFormOne: boolean = true;
  PersonalFormTwo: boolean = false;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  isYono = window.sessionStorage.getItem('IsYono');
  isRGB: string = '';
  RGBValue: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  clientid: any;
  isActiveProeedBtn: boolean = true;
  NomineeRedirection: any;

  RejectStatus = window.sessionStorage.getItem('RejectStatus');
  btnReviewApplication: boolean = false;
  RmCode:any = '';
  RmName:any = '';
  IsRm:boolean = false;
  IsRgbRm:boolean = false;

  constructor(
    private _http: APIService,
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private aesService: AesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private MoengageService: MoengagesdkService
  )
  {
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
    this.title.setTitle('Esign Verification - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Esign Verification during the onboarding process journey',
    });

    this.NomineeRedirection = sessionStorage.getItem('NomineeOptOut') ?? '';

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';
    this.GetRM();
    this.getRGBDetails();
  }

  redirectAddNominee() {
    this.spinner.show();

    if (this.NomineeRedirection === 'NomineeOptOut') {
      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.router.navigate(['/addNominee', 1]);
        this.spinner.hide();
      }, 200);
    } else {
      setTimeout(() => {
        const modalBackdrops = document.querySelectorAll('.modal-backdrop');
        modalBackdrops.forEach((backdrop) => {
          if (backdrop instanceof HTMLElement) {
            backdrop.remove();
          }
        });
        this.router.navigate(['/addNominee', 2]);
        this.spinner.hide();
      }, 200);
    }
  }

  ReviewApplication() {
    const reqData = {
      FormNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/esign/getEsignPDFData', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          if (response.AOFurl != '') {
            fetch(response.AOFurl)
              .then((response) => response.blob())
              .then((blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                window.open(link.toString());

                this.MoengageService.trackEvent('Esign PDF Preview', {
                  product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                  Preview_URL: link.toString(),
                  product_name: 'Onboarding DIY',
                  category: 'Esign',
                });
              })
              .catch((error) => console.error(error));

            this.spinner.hide();
          } else {
            this.MoengageService.trackEvent('Esign PDF Preview Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              ErrorMsg: response.messsage,
              product_name: 'Onboarding DIY',
              category: 'Esign',
            });

            this.spinner.hide();

            this.toastr.error('Something went Wrong...', '', {
              positionClass: 'toast-bottom-center',
              timeOut: 2000,
            });
          }
        } else {
          this.MoengageService.trackEvent('Esign PDF Preview Error', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            ErrorMsg: response.messsage,
            product_name: 'Onboarding DIY',
            category: 'Esign',
          });

          this.spinner.hide();

          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        }
      });
  }

  proceedToEsign() {
    this.isActiveProeedBtn = false;

    this.btnReviewApplication = true;

    this.spinner.show();

    const reqData = {
      FormNumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/esign/getEsignPDFData', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.btnReviewApplication = true;

          if (response.esignURL != '') {
            this.spinner.show();

            this.MoengageService.trackEvent('Esign Redirection', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              EsignURL: response.esignURL,
              product_name: 'Onboarding DIY',
              category: 'Esign',
            });

            window.location.href = response.esignURL;

            // setTimeout(() => {
            //   this.spinner.hide();
            // }, 4000);
          } else {
            this.isActiveProeedBtn = true;

            this.btnReviewApplication = false;

            this.MoengageService.trackEvent('Esign Redirection Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              ErrorMsg: response.messsage,
              product_name: 'Onboarding DIY',
              category: 'Esign',
            });

            this.spinner.hide();
            this.toastr.error('Something went Wrong..', '', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });
            // return;
          }
        } else {
          this.isActiveProeedBtn = true;

          this.btnReviewApplication = false;

          this.MoengageService.trackEvent('Esign Redirection', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            ErrorMsg: response.messsage,
            product_name: 'Onboarding DIY',
            category: 'Esign',
          });

          this.spinner.hide();
          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
          // return;
        }
      });
  }

  faqHelpBtn(stageName: string) {
    const encodedStageName = btoa(stageName);
    window.location.href = `faq?stageName=${encodeURIComponent(
      encodedStageName
    )}`;
  }




    onKeyPressRMCode(event: KeyboardEvent): void {
    const char = event.key;
    const regExp = /^[a-zA-Z0-9\s]*$/;

    if (!regExp.test(char)) {
      event.preventDefault();
    }
  }


  //   GetYonoRM() {
  //   const reqData = {
  //     formnumber: window.sessionStorage.getItem('FormNumber'),
  //   };
  //   this.spinner.show();
  //   this._http
  //     .postRequest('api/v1/Yono/get-yono-rm', reqData)
  //     .subscribe((resp) => {
  //       let response: any = resp.body;
  //       if (response.status == true) {
  //         response = JSON.parse(
  //           this.aesService.decrypt(response.data, this.clientid, this.clientid)
  //         );
  //         console.log("GetYonoRM response: ",response)
  //         console.log("GetYonoRM response: ",response[0].rm_name)
  //         // this.RmName = response[0].rm_name
  //         this.RmCode = response[0].rm_code

  //         // this.IsRm = true
  //         this.spinner.hide();

  //       } else {


  //         this.spinner.hide();
  //         // this.IsRm = false

  //         this.toastr.error(response.message, '', {
  //           positionClass: 'toast-bottom-center',
  //           timeOut: 3000,
  //         });
  //       }
  //     });
  // }

    GetRM() {
    const reqData = {
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };
    this.spinner.show();

    this._http
      .postRequest('api/v1/Yono/get-rm', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          console.log("GetYonoRM response: ",response)
          console.log("GetYonoRM response: ",response[0].rm_name)
          
          // this.RmName = response[0].rm_name
          // this.RmCode = response[0].yono_ern
          // YonoRM = response[0].yono_ern
          // RM = response[0].rm_code

          const YonoRM = response[0]?.yono_ern;
          const RM = response[0]?.rm_code;
          console.log("dsa",YonoRM,RM)
          if (RM !== null && RM !== undefined && RM !== '') {
            this.RmCode = RM;
            this.RmName = response[0].WorkforceName
            this.IsRm = true;
          } else if (YonoRM !== null && YonoRM !== undefined && YonoRM !== '') {
            this.RmCode = YonoRM;
            this.IsRm = false; // optional, set as per your requirement
          }
          else{
            this.RmCode = '';
            this.RmCode = '';
            this.IsRm = false; 
          }
          

          // this.IsRm = true
          this.spinner.hide();

        } else {


          this.spinner.hide();
          // this.IsRm = false

          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        }
      });
  }

    SaveRM() {
      if (this.RmCode==null || this.RmCode == ''){
          this.toastr.error('Please enter the RM code.', '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        return
      }
    const reqData = {
      formnumber: window.sessionStorage.getItem('FormNumber'),
      RmCode: this.RmCode,

    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/Yono/save-rm', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          console.log("GetYonoRM response: ",response)
          console.log("GetYonoRM response: ",response[0].rm_name)
          console.log("GetYonoRM response: ",response[0].rm_code)

          this.RmName = response[0].rm_name
          this.RmCode = response[0].rm_code

          this.IsRm = true
          this.spinner.hide();

        } else {


          this.spinner.hide();
          this.IsRm = false

          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        }
      });
  }
    SaveRGBRM() {
      if (this.RGBValue==null || this.RGBValue == ''){
          this.toastr.error('Please enter the RM code.', '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        return
      }
    const reqData = {
      formnumber: window.sessionStorage.getItem('FormNumber'),
      RmCode: this.RGBValue,

    };
    this.spinner.show();
    this._http
      .postRequest('api/v1/masters/save-rgb-rm', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {  
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          console.log("GetYonoRM response: ",response)
          console.log("GetYonoRM response: ",response[0].rm_code)

          this.RmCode = response[0].RGBValue
          this.IsRgbRm = true

          this.spinner.hide();
          this.toastr.success('RM has been assigned.', '', {
          positionClass: 'toast-bottom-center',
          timeOut: 3000,
          });

        } else {


          this.spinner.hide();
          this.IsRgbRm = false

          this.toastr.error(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 3000,
          });
        }
      });
  }
  toggleDisabled(){
    this.IsRm=false;
  }
    toggleDisabled1(){
    this.IsRgbRm = false;
  }

    getRGBDetails() {
    var reqData = {
      flag: 'GETRGBDETAILS',
      formnumber: window.sessionStorage.getItem('FormNumber')
    };
    this.spinner.show();
    this._http.postRequest('api/v1/masters/get', reqData).subscribe((resp) => {
      let response: any = resp.body;
      var RGB_RM='';
      // this.guid = response.request_id;

      if (response.status == true) {
        response = JSON.parse(
          this.aesService.decrypt(response.data, this.clientid, this.clientid)
        );
        this.isRGB = response.data[0].source;
        console.log("rgb response: ",response.data[0].source)
        // console.log("isRGB: ",this.isRGB)

        RGB_RM = response.data[0].RGB_RM;
        console.log("RGB_RM: ",RGB_RM)
        if (RGB_RM !== null && RGB_RM !== undefined && RGB_RM !== ''){

          this.IsRgbRm=true;
          this.RGBValue = RGB_RM;
        }else{
          this.IsRgbRm = false;
          this.RGBValue = '';
        }
        // const RM = response[0]?.rm_code;
      }
      this.spinner.hide();
    });
  }
}
