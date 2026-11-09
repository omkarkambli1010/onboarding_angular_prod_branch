import { Component, OnInit } from '@angular/core';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { Router, ActivatedRoute } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { AesService } from '../aes.service';
import { APIService } from '../api.service';
import { NavigationService } from '../navigation.service';
import { MoengagesdkService } from '../moengagesdk.service';

@Component({
    selector: 'app-msf-sso',
    templateUrl: './msf-sso.component.html',
    styleUrls: ['./msf-sso.component.css'],
    standalone: false
})
export class MsfSsoComponent implements OnInit {
  clientid: string = '';
  otpFieldMobile: any;

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

      const formnumber = this.aesService.decrypt(
        refno,
        'm22225y1a9xanbr7yog7p9lr0s4qzcmz',
        'm22225y1a9xanbr7'
      );
      this.callmsfapi(formnumber.replaceAll('\\', '').trim());
    });
  }

  callmsfapi(refno: any) {
    this.spinner.show();

    var reqData = {
      flag: 'getredirectmsflead',
      formnumber: refno,
    };

    window.localStorage.clear();
    window.sessionStorage.clear();

    this._http
      .postRequestMSF('api/v1/oauth/service/msf/redirectlead', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;

        try {
          if (response.status == true) {
            response = JSON.parse(
              this.aesService.decrypt(
                response.data,
                'm22225y1a9xanbr7yog7p9lr0s4qzcmz',
                'm22225y1a9xanbr7'
              )
            );

            // if (
            //   response.Table[0].PhoneNumberVerify !=
            //   sessionStorage.getItem('mobile') ||
            //   response.Table[0].VerifyOtp != this.otpFieldMobile
            // ) {
            //   this.toastr.error('Unauthorized', 'Error', {
            //     positionClass: 'toast-bottom-center',
            //     timeOut: 2000,
            //   });
            // }

            if (
              response.Table1[0].dsw_StageId != '' &&
              response.Table1[0].dsw_StageId != null &&
              response.Table1[0].dsw_StageId != '26' &&
              response.Table1[0].stagestaus != 'R'
            ) {
              // window.localStorage.clear();
              // window.sessionStorage.clear();
              window.sessionStorage.setItem('SSLAPP','Y');

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

              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              window.sessionStorage.setItem(
                'token',
                response.Table[0].token ?? ''
              );

              window.sessionStorage.setItem(
                'clientid',
                response.Table[0].FormNumber ?? ''
              );
              window.sessionStorage.setItem(
              'yonobank',
              response.Table3[0].bankStatus
              );
              window.sessionStorage.setItem(
              'IsYono',
              response.Table[0].UTMSOURCE ?? 'NA'
              );
              window.sessionStorage.setItem(
              'YonoClient',
              response.Table[0].UTMSOURCE ?? 'NA'
              );

              this.clientid = window.sessionStorage.getItem('clientid') ?? '';

              window.sessionStorage.setItem(
                'UTMSOURCE',
                response.Table[0].UTMSOURCE ?? 'NA'
              );


              if (response.Table2.length > 0) {
                window.sessionStorage.setItem('mode', response.Table2[0].mode);
                window.sessionStorage.setItem('selectedBankPrefix', response.Table2[0].selectedBankPrefix);
              }

              if (response.Table3.length > 0) {
                if (response.Table3[0].nomineeOptOut === 'Yes') {
                  window.sessionStorage.setItem(
                    'NomineeOptOut',
                    'NomineeOptOut'
                  );
                } else {
                  window.sessionStorage.removeItem('NomineeOptOut');
                }
              }

              setTimeout(() => {
                this.router.navigate([response.Table1[0].dsw_StageUrl]);
                this.spinner.hide();
              }, 200);
            } else if (
              response.Table1[0].dsw_StageId === '26' &&
              response.Table1[0].stagestaus != 'R'
            ) {
              // window.localStorage.clear();
              // window.sessionStorage.clear();
              window.sessionStorage.setItem('SSLAPP','Y');

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

              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              window.sessionStorage.setItem(
                'token',
                response.Table[0].token ?? ''
              );

              window.sessionStorage.setItem(
                'clientid',
                response.Table[0].FormNumber ?? ''
              );
              window.sessionStorage.setItem(
              'yonobank',
              response.Table3[0].bankStatus
              );
              window.sessionStorage.setItem(
              'IsYono',
              response.Table[0].UTMSOURCE ?? 'NA'
              );
              window.sessionStorage.setItem(
              'YonoClient',
              response.Table[0].UTMSOURCE ?? 'NA'
              );
              this.clientid = window.sessionStorage.getItem('clientid') ?? '';

              setTimeout(() => {
                this.router.navigate([response.Table1[0].dsw_StageUrl]);
                this.spinner.hide();
              }, 200);
            } else if (response.Table1[0].stagestaus === 'R') {
              // window.localStorage.clear();
              // window.sessionStorage.clear();
              window.sessionStorage.setItem('SSLAPP','Y');

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

              window.sessionStorage.setItem(
                'FormNumber',
                response.Table[0].FormNumber
              );

              window.sessionStorage.setItem(
                'token',
                response.Table[0].token ?? ''
              );

              window.sessionStorage.setItem(
                'clientid',
                response.Table[0].FormNumber ?? ''
              );
              window.sessionStorage.setItem(
              'yonobank',
              response.Table3[0].bankStatus
              );
              window.sessionStorage.setItem(
              'IsYono',
              response.Table[0].UTMSOURCE ?? 'NA'
              );
              window.sessionStorage.setItem(
              'YonoClient',
              response.Table[0].UTMSOURCE ?? 'NA'
              );
              this.clientid = window.sessionStorage.getItem('clientid') ?? '';

              window.sessionStorage.setItem(
                'RejectStatus',
                response.Table1[0].stagestaus
              );
              const rejectedRoutes = response.Table1.map(
                (entry: { dsw_StageUrl: any }) => entry.dsw_StageUrl
              );

              this.navService.fetchRejectedRoutes(rejectedRoutes, 'home');
            }
          } else {
            this.toastr.error(response.message, 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 2500,
            });

            this.spinner.hide();
          }
        } catch (error) {
          this.toastr.error('Invalid Request...', 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 2500,
          });

          this.spinner.hide();
          console.error('MSF Error', error);
        }
      });
  }
}
