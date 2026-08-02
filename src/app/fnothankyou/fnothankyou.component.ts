import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { APIService } from '../api.service';
import { AesService } from '../aes.service';
import { ToastrService } from 'ngx-toastr';
import { MoengagesdkService } from '../moengagesdk.service';


@Component({
  selector: 'app-fnothankyou',
  templateUrl: './fnothankyou.component.html',
  styleUrls: ['./fnothankyou.component.css']
})
export class FnothankyouComponent {
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';
  clientid: any;

  personalFormNumber: any;
  PersonalFormOne: boolean = true;
  PersonalFormTwo: boolean = false;
  errorValue: any;

  AofLink: string = '';
  FnoLink: string = '';

  paidPlanText: any;
  paidPlanTextCheck: any;

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
  ) { }

  ngOnInit(): void {
    this.title.setTitle('Thank You - Onboarding-DIY-PWA');
    this.personalFormNumber = window.sessionStorage.getItem('FormNumber');

    this.meta.updateTag({
      name: 'description',
      content: 'Thank You on the onboarding process journey',
    });
    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.route.queryParams.subscribe((params) => {
      if (params['esign'] === 'n') {
        this.spinner.show();

        this.PersonalFormOne = false;
        this.PersonalFormTwo = true;

        this.route.queryParams.subscribe((params) => {
          this.errorValue = params['error'];
          if (!this.errorValue.includes('is not matched')) {
            this.MoengageService.trackEvent('Esign Completion Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              EsignGateway: 'NSDL',
              Valid_Esign_Flag: params['esign'] ?? 'N',
              EsignResponse: this.errorValue,
              ErrorMsg:
                'Looks like the e-sign couldn’t be completed. Please try again. Contact us on 022 6854 5555/ 022 4001 4155',
              product_name: 'Onboarding DIY',
              category: 'Esign',
            });

            setTimeout(() => {
              //this.toastr.error('Oops! We are facing trouble to e-sign your digital application form. Please retry to continue. For more support, please contact us', 'Error', {
              this.toastr.error(
                'Looks like the e-sign couldn’t be completed. Please try again. Contact us on 022 6854 5555/ 022 4001 4155',
                'Error',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 5000,
                }
              );
              this.spinner.hide();
            }, 1000);
          } else if (this.errorValue.includes('is not matched')) {
            this.MoengageService.trackEvent('Esign Completion Error', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              EsignGateway: 'NSDL',
              Valid_Esign_Flag: params['esign'] ?? 'N',
              EsignResponse: this.errorValue,
              ErrorMsg:
                'Please e-Sign this application using your own Aadhaar details',
              product_name: 'Onboarding DIY',
              category: 'Esign',
            });

            setTimeout(() => {
              //this.toastr.error('Oops! We are facing trouble to e-sign your digital application form. Please retry to continue. For more support, please contact us', 'Error', {
              this.toastr.error(
                'Please e-Sign this application using your own Aadhaar details',
                'Error',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 5000,
                }
              );
              this.spinner.hide();
            }, 1000);
          }
        });
      } else {
        this.MoengageService.trackEvent('Esign Completion', {
          product_id: window.sessionStorage.getItem('FormNumber') ?? '',
          EsignGateway: 'NSDL',
          Valid_Esign_Flag: params['esign'] ?? 'Y',
          product_name: 'Onboarding DIY',
          category: 'Esign',
        });
        this.getEsignDetails();
        this.getPaidPlanText();
        this.PersonalFormOne = true;
        this.PersonalFormTwo = false;
        // this.MoengageService.logoutUser();
        window.localStorage.clear();
        window.sessionStorage.clear();
      }
    });
  }

  getEsignDetails() {
    var reqData = {
      flag: 'fnoesign',
      formnumber: window.sessionStorage.getItem("FormNumber")
    };
    this._http.postRequest('api/v1/masters/get', reqData).subscribe((resp) => {
      let response: any = resp.body;
      if (response.status == true) {
        response = JSON.parse(
          this.aesService.decrypt(response.data, this.clientid, this.clientid)
        );
      }
      console.log("esign res", response)
      this.AofLink = response.data[0].AofPath;
      this.FnoLink = response.data[0].FnoPath;


    });
  }
  ReviewApplication() {
    console.log(this.AofLink)
    fetch(this.AofLink)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        window.open(link.toString());

      })
  }

  ReviewFnoApplication() {
    console.log(this.FnoLink)
    fetch(this.FnoLink)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        window.open(link.toString());

      })
  }
  redirectesign() {
    this.spinner.show();
    setTimeout(() => {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
      this.router.navigate(['/fnoesign']);
      this.spinner.hide();
    }, 200);
  }

  redirectLogin() {
    this.spinner.show();
    setTimeout(() => {
      const modalBackdrops = document.querySelectorAll('.modal-backdrop');
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.remove();
        }
      });
      this.router.navigate(['/']);
      this.spinner.hide();
    }, 200);
  }

  getPaidPlanText() {
    this.spinner.show();
    const reqData = {
      flag: 'atom_textshow',
      formnumber: window.sessionStorage.getItem('FormNumber'),
    };

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        this.spinner.hide();
        let response: any = resp.body;
        console.log("RESP", response);

        if (response.status === true) {
          const decrypted = this.aesService.decrypt(response.data, this.clientid, this.clientid);
          const parsed = JSON.parse(decrypted);
          this.paidPlanTextCheck = parsed;
          console.log("this.paidPlanText", this.paidPlanTextCheck);
          if (this.paidPlanTextCheck[0].flag == "true") {
            this.paidPlanTextCheck[0].Paidplantextshow;
          } else {
            this.paidPlanTextCheck[0].Paidplantextshow = "";
          }

        }
      });
  }

}
