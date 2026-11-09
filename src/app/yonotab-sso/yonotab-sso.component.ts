import { Component } from '@angular/core';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AesService } from '../aes.service';
import { APIService } from '../api.service';
import { MoengagesdkService } from '../moengagesdk.service';
import { NavigationService } from '../navigation.service';

@Component({
    selector: 'app-yonotab-sso',
    templateUrl: './yonotab-sso.component.html',
    styleUrls: ['./yonotab-sso.component.css'],
    standalone: false
})
export class YonotabSsoComponent {
  clientid: string = '';

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
    private navService: NavigationService,
    private MoengageService: MoengagesdkService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const refno = params['refno'];
      this.callyonoapi(refno);
    });
  }

  callyonoapi(refno: any) {
    this.spinner.show();

    window.localStorage.clear();
    window.sessionStorage.clear();

    var reqData = {
      flag: 'GetTabDetails',
      code: refno,
    };

    this._http
      .postRequest('api/v1/Yono/verifylead', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response.data = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          this.MoengageService.MoeInit();

          window.sessionStorage.setItem(
            'token',
            response.data.Table[0].token ?? ''
          );

          window.sessionStorage.setItem(
            'clientid',
            response.data.Table1[0].Formnumber ?? ''
          );

          // window.sessionStorage.setItem(
          //   'token',3
          //   response.data.Table1[0].token ?? ''
          // );

          this.clientid = window.sessionStorage.getItem('clientid') ?? '';

          window.sessionStorage.setItem(
            'UTMSOURCE',
            response.data.Table1[0].UTMSOURCE ?? 'NA'
          );

          window.sessionStorage.setItem(
            'UTM_MEDIUM',
            response.data.Table1[0].UTM_MEDIUM ?? 'NA'
          );

          setTimeout(() => {
            this.MoengageService.setUserAttributes(
              response.data.Table1[0].Formnumber ?? '',
              response.data.Table1[0].MobileNumber ?? '',
              response.data.Table4[0].emailid ?? '',
              '',
              ''
            );
          }, 500);

          this.MoengageService.trackEvent('YONO Redirection', {
            product_id: response.data.Table1[0].Formnumber,
            Yono_Ref_No: refno,
            product_name: 'Onboarding DIY',
            category: 'YONO',
          });

          if (response.data.Table1[0].MobileStatus === 'UNIQUE') {
            window.sessionStorage.setItem(
              'FormNumber',
              response.data.Table1[0].Formnumber
            );
            window.sessionStorage.setItem(
              'mobile',
              response.data.Table1[0].MobileNumber
            );
            window.sessionStorage.setItem(
              'yonobank',
              response.data.Table3[0].bankStatus
            );
            window.sessionStorage.setItem(
              'IsYono',
              response.data.Table1[0].UTMSOURCE ?? 'NA'
            );
            window.sessionStorage.setItem(
              'YonoClient',
              response.data.Table1[0].UTMSOURCE ?? 'NA'
            );
            window.sessionStorage.setItem(
              'yonoEmail',
              response.data.Table4[0].emailid
            );

            setTimeout(() => {
              this.router.navigate(['yono-email']);

              this.spinner.hide();
            }, 200);
          } else if (response.data.Table1[0].MobileStatus === 'EXISTING') {
            window.sessionStorage.setItem(
              'FormNumber',
              response.data.Table1[0].Formnumber
            );
            window.sessionStorage.setItem(
              'yono_reference_number',
              response.data.Table1[0].yono_reference_number
            );
            window.sessionStorage.setItem(
              'ExistingMobile',
              response.data.Table1[0].MobileNumber
            );
            window.sessionStorage.setItem(
              'yonobank',
              response.data.Table3[0].bankStatus
            );
            window.sessionStorage.setItem(
              'IsYono',
              response.data.Table1[0].UTMSOURCE ?? 'NA'
            );
            window.sessionStorage.setItem(
              'YonoClient',
              response.data.Table1[0].UTMSOURCE ?? 'NA'
            );

            window.sessionStorage.setItem(
              'mobile',
              response.data.Table1[0].MobileNumber
            );

            this.MoengageService.trackEvent('YONO Redirection', {
              product_id: response.data.Table1[0].Formnumber,
              product_name: 'Onboarding DIY',
              Yono_Ref_No: refno,
              category: 'YONO',
              client_type: 'UNIQUE',
            });

            window.sessionStorage.setItem(
              'yonoEmail',
              response.data.Table4[0].emailid
            );

            setTimeout(() => {
              this.router.navigate(['yono-mobile']);

              this.spinner.hide();
            }, 200);
          } else if (
            response.data.Table1[0].MobileStatus === 'EXISTING IN DIY'
          ) {
            // window.localStorage.clear();
            // window.sessionStorage.clear();

            // this.MoengageService.MoeInit();

            if (response.data.Table1[0].dsw_StageUrl === '/email') {
              window.sessionStorage.setItem(
                'FormNumber',
                response.data.Table1[0].Formnumber
              );
              window.sessionStorage.setItem(
                'mobile',
                response.data.Table1[0].MobileNumber
              );
              window.sessionStorage.setItem(
                'yonobank',
                response.data.Table3[0].bankStatus
              );
              window.sessionStorage.setItem(
                'IsYono',
                response.data.Table1[0].UTMSOURCE ?? 'NA'
              );
              window.sessionStorage.setItem(
                'YonoClient',
                response.data.Table1[0].UTMSOURCE ?? 'NA'
              );
              window.sessionStorage.setItem(
                'yonoEmail',
                response.data.Table4[0].emailid
              );

              setTimeout(() => {
                this.router.navigate(['yono-email']);

                this.spinner.hide();
              }, 200);
            } else {
              window.sessionStorage.setItem(
                'FormNumber',
                response.data.Table1[0].Formnumber
              );
              window.sessionStorage.setItem(
                'mobile',
                response.data.Table1[0].MobileNumber
              );
              window.sessionStorage.setItem(
                'yonobank',
                response.data.Table3[0].bankStatus
              );
              window.sessionStorage.setItem(
                'IsYono',
                response.data.Table1[0].UTMSOURCE ?? 'NA'
              );
              window.sessionStorage.setItem(
                'YonoClient',
                response.data.Table1[0].UTMSOURCE ?? 'NA'
              );
              window.sessionStorage.setItem(
                'yonoEmail',
                response.data.Table4[0].emailid
              );

              setTimeout(() => {
                this.router.navigate([response.data.Table1[0].dsw_StageUrl]);

                this.spinner.hide();
              }, 200);
            }
          }
        } else {
          window.localStorage.clear();
          window.sessionStorage.clear();

          this.MoengageService.MoeInit();

          this.MoengageService.trackEvent('YONO Redirection', {
            product_id: refno,
            Yono_Ref_No: refno,
            product_name: 'Onboarding DIY',
            category: 'YONO',
            ErrorMsg: response.message,
          });

          this.toastr.error(response.message, 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 2500,
          });

          this.spinner.hide();
        }
      });
  }
}
