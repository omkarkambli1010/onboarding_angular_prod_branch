import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { interval, take } from 'rxjs';
import { AesService } from '../aes.service';
import { APIService } from '../api.service';
import { Meta, Title } from '@angular/platform-browser';
import * as bootstrap from 'bootstrap';

declare var $ : any;

@Component({
    selector: 'app-rpd',
    templateUrl: './rpd.component.html',
    styleUrls: ['./rpd.component.css'],
    standalone: false
})
export class RpdComponent {
  personalFormNumber: any;
  clientid: any;
  guid: any;

  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  IsIos: any;

  enteredIFSCNumber: string = '';
  accountNumber: string = '';

  Apistart: any;
  rpdWebHookInterval: any;
  upiPayLink: any;
  rpdData: any;

  RevPennyDropFormOne: boolean = false;
  RevPennyDropFormTwo: boolean = false;
  RevPennyDropFormThree: boolean = false;

  RejectStatus = window.sessionStorage.getItem('RejectStatus')

  requestID:any
  remainingTime: number = 15; // 5 minutes = 300 seconds
  minutes: number = 0;
  seconds: number = 0;

  constructor(
    private _http: APIService,
    private aesService: AesService,
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.sendVerifyBank();
    
    this.getUPIMasterDetails();

    this.IsIos = window.sessionStorage.getItem('isIos');

    this.title.setTitle('Personal Details - Onboarding-DIY-PWA');
    this.meta.updateTag({
      name: 'description',
      content: 'Capturing Personal Details of the customer.',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';

    this.route.params.subscribe((params) => {
      const formNumber = params['formNumber'];
      // this.setFormVisibility(formNumber);
    });
  }

  setFormVisibility(formNumber: string) {

    this.RevPennyDropFormOne = false;
    this.RevPennyDropFormTwo = false;
    this.RevPennyDropFormThree = false;

    switch (formNumber) {
      case '1':
        this.RevPennyDropFormOne = true;
        this.getUPIMasterDetails();
        break;
      case '2':
        this.RevPennyDropFormTwo = true;
        this.getPennyDropFormTwo();
        break;
      case '3':
        this.RevPennyDropFormThree = true;
        break;
      default:
        break;
    }
  }

  async sendVerifyBank() {
    // this.spinner.show();
    try {
      this.getApiStarttime();
      this.rpdWebHookInterval = setInterval(() => {
        this.getVerifyBankDetailsStatus();
      }, 5000);
    } catch (error) {
      console.error('Error launching UPI link:', error);
      // this.showSpinnerWithFallback();
    }
  }

  showSpinnerWithFallback() {
    this.spinner.show();
    setTimeout(() => {
      this.RevPennyDropFormOne = true;
      this.spinner.hide();
    }, 1000);
  }

  getApiStarttime() {
    this.Apistart = Date.now();

    //console.log('Apistart', this.Apistart);

    return;
  }

  startCountdown(): void {
    const countdown$ = interval(1000).pipe(take(this.remainingTime));
    countdown$.subscribe({
      next: () => {
        this.remainingTime--;
        this.updateDisplay();
      },
      complete: () => {
        //console.log('Countdown completed!');
        var btn=document.getElementsByClassName("hidden")
        $("#btn").removeClass("hidden")
        // this.router.navigate(['/personalDetailsForm/',6])
        // You can call additional functions here when the timer ends
      },
    });
  }

  updateDisplay(): void {
    this.minutes = Math.floor(this.remainingTime / 60);
    this.seconds = this.remainingTime % 60;
  }

  getUPIMasterDetails() {
    //console.log("getUPIMasterDetails")
    // this.spinner.show();
    this.personalFormNumber = window.sessionStorage.getItem('FormNumber');
    var reqData = {
      flag: 'GetUPIMasterdetls',
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    this._http
      .postRequest('api/v1/BankDetails/CreateRPDService', reqData)
      .subscribe((resp: any) => {
        //console.log('Response', resp);
        let response: any = resp.body;
        if (
          response.status == true &&
          response.message != 'Bank Account Already Verified'
        ) {
          response = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );
          //console.log('DECRYPTED RESP', response);
          this.requestID = response[3].requestId
          //console.log("3rd Resp",response[3]);
          if (response[3].UpiName == 'Others') {
            this.upiPayLink = response[3].upiLink;
            //console.log('upiLink- ', this.upiPayLink);
            this.startCountdown();
          }

          // this.indianUPIBanksList = this.filterUPIOptions(response);
          // if (this.indianUPIBanksList.length > 0) {
          //   this.requestID = this.indianUPIBanksList[0].requestId;
          // }

          // setTimeout(() => {
          //   this.spinner.hide();
          // }, 300);
        } else {
          this.router.navigate(['/reversePennyDrop', 2]);

          this.spinner.hide();

          this.toastr.success(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });
        }
      });
  }

  getVerifyBankDetailsStatus() {
    var reqData = {
      flag: 'getrpdewebhookdetls',
      formNumber: window.sessionStorage.getItem('FormNumber'),
    };
    //console.log(reqData);

    // this.spinner.show();

    this._http
      .postRequest('api/v1/BankDetails/getwehbookrpdDetails', reqData)
      .subscribe((resp) => {
        const ApitimeOut = 1000 * 60 * 5;

        //console.log('ApitimeOut', ApitimeOut);

        let response: any = resp.body;

        //console.log('Response: ', response);

        if (response.status == true) {
          response.data = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          //console.log('Response Decrypted: ', response);

          //console.log('RPD: ', response.data);

          //clearInterval(this.rpdWebHookInterval);

          if (response.message != 'Name Mismatch-MiddleRange') {
            clearInterval(this.rpdWebHookInterval);

            window.sessionStorage.setItem('mode', 'RevPennyDrop');

            this.enteredIFSCNumber = response.data[0].acc_holder_ifsc;

            this.accountNumber = response.data[0].acc_number;

            this.rpdData = response.data[0].bankname_address;

            setTimeout(() => {
              this.router.navigate(['/reversePennyDrop', 2]);

              this.spinner.hide();
            }, 200);
          } else if (response.message === 'Name Mismatch-MiddleRange') {
            clearInterval(this.rpdWebHookInterval);

            window.sessionStorage.setItem('mode', 'RevPennyDrop');

            this.enteredIFSCNumber = response.data[0].acc_holder_ifsc;

            this.accountNumber = response.data[0].acc_number;

            this.rpdData = response.data[0].bankname_address;

            this.spinner.hide();

            this.openSameNamePopupModal();
          } else {
            this.toastr.error('Please Try Again', '', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            this.spinner.hide();
          }
        } else if (response.message === 'Name Mismatch') {
          clearInterval(this.rpdWebHookInterval);

          this.toastr.error(
            'Oops! This bank account seems to belonging to someone else as per bank record. Please change the bank details to continue.',
            '',
            {
              positionClass: 'toast-bottom-center',
              timeOut: 5000,
            }
          );

          this.spinner.hide();
        } else {
          const timeElapsed = Date.now() - this.Apistart;

          //console.log('timeElapsed', timeElapsed);

          if (timeElapsed > ApitimeOut) {
            clearInterval(this.rpdWebHookInterval);
            //console.log("else")
            this.toastr.error('Please Try Again', '', {
              positionClass: 'toast-bottom-center',
              timeOut: 3000,
            });

            this.spinner.hide();
          }
        }
      });
  }

  openSameNamePopupModal() {
    const bankSameNamepopupModel = document.getElementById('myModal');
    if (bankSameNamepopupModel) {
      const myModall = new bootstrap.Modal(bankSameNamepopupModel);
      myModall.show();
    } else {
      this.removeModal();
    }
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    if (modalBackdrops) {
      modalBackdrops.forEach((backdrop) => {
        if (backdrop instanceof HTMLElement) {
          backdrop.classList.remove('show');
          backdrop.remove();
        }
      });
    }
  }

  getPennyDropFormTwo() {
    //console.log("this.requestID",this.requestID)
    var reqData = {
      flag: 'Bank',
      formnumber: window.sessionStorage.getItem('FormNumber'),
      requestId:this.requestID 
    };

    clearInterval(this.rpdWebHookInterval);

    this._http
      .postRequest('api/v1/WorkflowDetails/getworkflowdata', reqData)
      .subscribe((resp) => {
        let response: any = resp.body;
        if (response.status == true) {
          response.data = JSON.parse(
            this.aesService.decrypt(response.data, this.clientid, this.clientid)
          );

          if (resp.body.message === 'Data found') {
            //console.log(response);

            if (this.RejectStatus != 'R') {

              this.enteredIFSCNumber = response.data[0].acc_holder_ifsc;

              this.accountNumber = response.data[0].acc_number;

              this.rpdData = response.data[0].bankname_address;

              this.spinner.hide();

              window.sessionStorage.setItem('mode', 'RevPennyDrop');

            }
          }
        }
        else {
          this.spinner.hide();
        }
      });
  }

  redirect(){
    // //console.log("redirect")
    // var reqData = {
    //   flag: 'Bank',
    //   formnumber: window.sessionStorage.getItem('FormNumber'),
    //   Mode: 'RPD'
    // };
    
    var reqData = {
      flag: 'GetRPDdetls',
      formnumber: window.sessionStorage.getItem('FormNumber'),
      requestId:this.requestID 
    };
    //console.log("this.requestID",this.requestID)
    this._http
    .postRequest('api/v1/BankDetails/CheckRPDDetails', reqData)
    .subscribe((resp) => {
      let response: any = resp.body;
      //console.log("RESPONSE------>: ",response)
      if (response.status == true) {
        response.data = JSON.parse(
          this.aesService.decrypt(response.data, this.clientid, this.clientid)
        );
        if (response.message =='Data found'){
          this.router.navigate(['/reversePennyDrop', 2]);

          this.spinner.hide();

          this.toastr.success(response.message, '', {
            positionClass: 'toast-bottom-center',
            timeOut: 2000,
          });
        }

        
      } else if (response.status == false&&response.message.includes("PENNY DROP NOT SUCCESSFULL")){
        alert("PENNY DROP VERIFICATION NOT SUCCESSFULL")
        
      }
      else {
        this.spinner.hide();
      }
    });
  }

  BackToSix() {
    this.spinner.show();
    setTimeout(() => {
      this.router.navigate(['/personalDetailsForm', 6]);
      this.spinner.hide();
    }, 200);
  }


}
