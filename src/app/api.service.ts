import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AesService } from './aes.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { MoengagesdkService } from './moengagesdk.service';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  constructor(
    private _http: HttpClient,
    private aesService: AesService,
    private spinner: NgxSpinnerService,
    private toastr: ToastrService,
    private router: Router,
    private MoengageService: MoengagesdkService
  ) {}

  api: string = 'https://diy.sbisecurities.in/diypwaapi/';

  //api: string = 'https://diy.sbisecurities.in/diypwaapicug/';

  //api: string = 'https://localhost:44360/';

  //api: string = 'https://udn.sbisecurities.in/diypwaapi/';

  // esignapi: string =
  //   'https://udn.sbisecurities.in/EsignService/api/v1/esignstamp/getEsignPDFData';

  esignapi: string =
    'https://diy.sbisecurities.in/EsignService/api/v1/esignstamp/getEsignPDFData';

  //msfapi: string = 'https://udn.sbisecurities.in/msfpwaapi/';

  msfapi: string = 'https://diy.sbisecurities.in/msfpwaapi/';

  postRequest(controller: string, data: any) {
    let _api = this.api + controller;

    let client_id = window.sessionStorage.getItem('clientid') ?? '';
    let token = window.sessionStorage.getItem('token');

    let tokenValue = '';

    if (token != null) {
      tokenValue = 'Bearer ' + token;
    }
    let headers = new HttpHeaders({
      client_id: client_id == null ? 'no-client' : client_id,
      Authorization: tokenValue,
    });

    let options = {
      headers: headers,
      observe: 'response',
    };

    return this._http
      .post<any>(
        _api,
        {
          request: this.aesService.encrypt(
            JSON.stringify(data),
            client_id,
            client_id
          ),
        },
        { headers, observe: 'response' }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            //alert(error.error.Message);

            this.spinner.hide();
            // let msg =
            //   error.error.message === undefined || null || ''
            //     ? error.error['Message']
            //     : error.error.message ?? error.error;

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });

            this.removeModal();
          } else if (error.status === 401) {
            // alert(error.error.Message);

            if (
              error.error == null ||
              error.error.ReasonPhrase == 'Unauthorized'
            ) {
              let msg = 'Session Expired...';

              if (
                window.sessionStorage.getItem('Unauthorized') == '' ||
                window.sessionStorage.getItem('Unauthorized') == null
              ) {
                this.toastr.error(msg, 'Error', {
                  positionClass: 'toast-bottom-center',
                  timeOut: 4500,
                });
              }

              this.MoengageService.trackEvent('General Errors', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'Errors',
                ErrorMsg: msg,
                ErrorCode: error.status,
              });

              window.sessionStorage.setItem(
                'Unauthorized',
                'Error Message Shown'
              );

              setTimeout(() => {
                //window.location.href = 'https://udn.sbisecurities.in/diy';

                window.location.href =
                  'https://diy.sbisecurities.in/open-demat-account';

                //window.sessionStorage.removeItem('Unauthorized');

                this.MoengageService.logoutUser();

                window.localStorage.clear();
                window.sessionStorage.clear();

                this.spinner.hide();
              }, 200);
            } else {
              let msg =
                (error.error.message ?? '') ||
                (error.error['Message'] ?? '') ||
                (error.error instanceof ProgressEvent ? '' : error.error);

              this.spinner.hide();

              if (msg === null || msg === '' || msg === undefined) {
                this.toastr.error(
                  'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                  '',
                  {
                    positionClass: 'toast-bottom-center',
                    timeOut: 3500,
                  }
                );
              } else {
                this.toastr.error(msg, '', {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                });
              }

              this.MoengageService.trackEvent('General Errors', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'Errors',
                ErrorMsg: msg,
                ErrorCode: error.status,
              });
            }
            this.removeModal();
          } else if (error.status === 404) {
            // alert(error.error.Message);

            this.toastr.error('Details Not Found...', 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3500,
            });

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: 'Details Not Found...',
              ErrorCode: error.status,
            });

            this.removeModal();
            this.spinner.hide();
          } else {
            // alert(error.error.Message || 'Server Error');

            this.spinner.hide();
            // let msg =
            //   error.error.message === undefined || null || ''
            //     ? error.error['Message']
            //     : error.error.message ?? error.error;

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });

            this.removeModal();
            // return throwError(error);
          }
          return throwError(error);
        })
      );
  }

  postRequestEsign(controller: string, data: any) {
    // let _api = this.api + controller;
    let _api = this.esignapi;

    let client_id = sessionStorage.getItem('clientid') ?? '';
    let token = sessionStorage.getItem('token');
    let tokenValue = '';

    if (token != null) {
      tokenValue = 'Bearer ' + token;
    }
    // let headers = new HttpHeaders({
    //   client_id: client_id == null ? 'no-client' : client_id,
    //   Authorization: tokenValue,
    // });

    let options = {
      observe: 'response',
    };

    return this._http
      .post<any>(
        _api,
        {
          request: this.aesService.encrypt(
            JSON.stringify(data),
            client_id,
            client_id
          ),
        },
        { observe: 'response' }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            //alert(error.error.Message);

            this.spinner.hide();
            // let msg =
            //   error.error.message === undefined || null || ''
            //     ? error.error['Message']
            //     : error.error.message ?? error.error;

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });

            this.removeModal();
          } else if (error.status === 401) {
            // alert(error.error.Message);
            this.spinner.hide();

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }
            this.removeModal();
          } else if (error.status === 404) {
            // alert(error.error.Message);

            this.toastr.error('Details Not Found...', 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3500,
            });

            this.removeModal();
            this.spinner.hide();
          } else {
            // alert(error.error.Message || 'Server Error');

            this.spinner.hide();
            // let msg =
            //   error.error.message === undefined || null || ''
            //     ? error.error['Message']
            //     : error.error.message ?? error.error;

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }
            this.removeModal();
            // return throwError(error);
          }
          return throwError(error);
        })
      );
  }

  postFilerequest(controller: string, data: any) {
    let _api = this.api + controller;

    let client_id = window.sessionStorage.getItem('clientid') ?? '';
    let token = window.sessionStorage.getItem('token');

    let tokenValue = '';

    if (token != null) {
      tokenValue = 'Bearer ' + token;
    }

    let headers = new HttpHeaders({
      client_id: client_id == null ? 'no-client' : client_id,
      Authorization: tokenValue,
    });

    return this._http
      .post(_api, data, {
        headers: headers,
        observe: 'events',
      })
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            // alert(error.error.Message);
            this.spinner.hide();

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });

            this.removeModal();
          } else if (error.status === 401) {
            // alert(error.error.Message);

            if (
              error.error == null ||
              error.error.ReasonPhrase == 'Unauthorized'
            ) {
              let msg = 'Session Expired...';

              if (
                window.sessionStorage.getItem('Unauthorized') == '' ||
                window.sessionStorage.getItem('Unauthorized') == null
              ) {
                this.toastr.error(msg, 'Error', {
                  positionClass: 'toast-bottom-center',
                  timeOut: 4500,
                });
              }

              window.sessionStorage.setItem(
                'Unauthorized',
                'Error Message Shown'
              );

              this.MoengageService.trackEvent('General Errors', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'Errors',
                ErrorMsg: msg,
                ErrorCode: error.status,
              });

              setTimeout(() => {
                //window.location.href = 'https://udn.sbisecurities.in/diy';

                window.location.href =
                  'https://diy.sbisecurities.in/open-demat-account';

                //window.sessionStorage.removeItem('Unauthorized');

                this.MoengageService.logoutUser();

                window.localStorage.clear();
                window.sessionStorage.clear();

                this.spinner.hide();
              }, 200);
            } else {
              let msg =
                (error.error.message ?? '') ||
                (error.error['Message'] ?? '') ||
                (error.error instanceof ProgressEvent ? '' : error.error);

              this.spinner.hide();

              if (msg === null || msg === '' || msg === undefined) {
                this.toastr.error(
                  'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                  '',
                  {
                    positionClass: 'toast-bottom-center',
                    timeOut: 3500,
                  }
                );
              } else {
                this.toastr.error(msg, '', {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                });
              }

              this.MoengageService.trackEvent('General Errors', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'Errors',
                ErrorMsg: msg,
                ErrorCode: error.status,
              });
            }
            this.removeModal();
          } else if (error.status === 404) {
            // alert(error.error.Message);

            this.toastr.error('Details Not Found...', 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3500,
            });

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: 'Details Not Found...',
              ErrorCode: error.status,
            });

            this.removeModal();
            this.spinner.hide();
          } else {
            // alert(error.error.Message || 'Server Error');
            this.spinner.hide();

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });
          }
          return throwError(error);
        })
      );
  }

  fileUploadRequest(controller: string, data: any) {
    let _api = this.api + controller;

    var httpReq = data;

    return this._http.post(_api, httpReq).pipe(
      catchError((error) => {
        if (error.status === 400) {
          // alert(error.error.Message);
          this.spinner.hide();

          let msg =
            (error.error.message ?? '') ||
            (error.error['Message'] ?? '') ||
            (error.error instanceof ProgressEvent ? '' : error.error);

          if (msg === null || msg === '' || msg === undefined) {
            this.toastr.error(
              'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
              '',
              {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              }
            );
          } else {
            this.toastr.error(msg, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 3500,
            });
          }

          this.removeModal();
        } else if (error.status === 401) {
          // alert(error.error.Message);

          if (
            error.error == null ||
            error.error.ReasonPhrase == 'Unauthorized'
          ) {
            let msg = 'Session Expired...';

            if (
              window.sessionStorage.getItem('Unauthorized') == '' ||
              window.sessionStorage.getItem('Unauthorized') == null
            ) {
              this.toastr.error(msg, 'Error', {
                positionClass: 'toast-bottom-center',
                timeOut: 4500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });

            window.sessionStorage.setItem(
              'Unauthorized',
              'Error Message Shown'
            );

            setTimeout(() => {
              //window.location.href = 'https://udn.sbisecurities.in/diy';

              window.location.href =
                'https://diy.sbisecurities.in/open-demat-account';

              //window.sessionStorage.removeItem('Unauthorized');
              this.MoengageService.logoutUser();

              window.localStorage.clear();
              window.sessionStorage.clear();

              this.spinner.hide();
            }, 200);
          } else {
            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            this.spinner.hide();

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });
          }
          this.removeModal();
        } else if (error.status === 404) {
          // alert(error.error.Message);

          this.toastr.error('Details Not Found...', 'Error', {
            positionClass: 'toast-bottom-center',
            timeOut: 3500,
          });

          this.MoengageService.trackEvent('General Errors', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Errors',
            ErrorMsg: 'Details Not Found...',
            ErrorCode: error.status,
          });

          this.removeModal();
          this.spinner.hide();
        } else {
          // alert(error.error.Message || 'Server Error');
          this.spinner.hide();

          let msg =
            (error.error.message ?? '') ||
            (error.error['Message'] ?? '') ||
            (error.error instanceof ProgressEvent ? '' : error.error);

          if (msg === null || msg === '' || msg === undefined) {
            this.toastr.error(
              'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
              '',
              {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              }
            );
          } else {
            this.toastr.error(msg, '', {
              positionClass: 'toast-bottom-center',
              timeOut: 3500,
            });
          }

          this.MoengageService.trackEvent('General Errors', {
            product_id: window.sessionStorage.getItem('FormNumber') ?? '',
            product_name: 'Onboarding DIY',
            category: 'Errors',
            ErrorMsg: msg,
            ErrorCode: error.status,
          });

          this.removeModal();
        }
        return throwError(error);
      })
    );
  }

  postRequestMSF(controller: string, data: any) {
    let _api = this.msfapi + controller;

    let client_id = window.sessionStorage.getItem('clientid') ?? '';
    let token = window.sessionStorage.getItem('token');

    let tokenValue = '';

    if (token != null) {
      tokenValue = 'Bearer ' + token;
    }

    let headers = new HttpHeaders({
      client_id: client_id == null ? 'no-client' : client_id,
      Authorization: tokenValue,
    });

    const key = 'm22225y1a9xanbr7yog7p9lr0s4qzcmz';
    const iv = 'm22225y1a9xanbr7';

    if (token != null) {
      tokenValue = 'Bearer ' + token;
    }

    //let headers = new HttpHeaders({});

    // let options = {
    //   headers: headers,
    //   observe: 'response',
    // };

    return this._http
      .post<any>(
        _api,
        {
          request: this.aesService.encrypt(JSON.stringify(data), key, iv),
        },
        { headers, observe: 'response' }
      )
      .pipe(
        catchError((error) => {
          if (error.status === 400) {
            //alert(error.error.Message);

            this.spinner.hide();
            // let msg =
            //   error.error.message === undefined || null || ''
            //     ? error.error['Message']
            //     : error.error.message ?? error.error;

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });

            this.removeModal();
          } else if (error.status === 401) {
            // alert(error.error.Message);

            if (
              error.error == null ||
              error.error.ReasonPhrase == 'Unauthorized'
            ) {
              let msg = 'Session Expired...';

              if (
                window.sessionStorage.getItem('Unauthorized') == '' ||
                window.sessionStorage.getItem('Unauthorized') == null
              ) {
                this.toastr.error(msg, 'Error', {
                  positionClass: 'toast-bottom-center',
                  timeOut: 4500,
                });
              }

              this.MoengageService.trackEvent('General Errors', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'Errors',
                ErrorMsg: msg,
                ErrorCode: error.status,
              });

              window.sessionStorage.setItem(
                'Unauthorized',
                'Error Message Shown'
              );

              setTimeout(() => {
                //window.location.href = 'https://udn.sbisecurities.in/diy';

                window.location.href =
                  'https://diy.sbisecurities.in/open-demat-account';

                //window.sessionStorage.removeItem('Unauthorized');

                this.MoengageService.logoutUser();

                window.localStorage.clear();
                window.sessionStorage.clear();

                this.spinner.hide();
              }, 200);
            } else {
              let msg =
                (error.error.message ?? '') ||
                (error.error['Message'] ?? '') ||
                (error.error instanceof ProgressEvent ? '' : error.error);

              this.spinner.hide();

              if (msg === null || msg === '' || msg === undefined) {
                this.toastr.error(
                  'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                  '',
                  {
                    positionClass: 'toast-bottom-center',
                    timeOut: 3500,
                  }
                );
              } else {
                this.toastr.error(msg, '', {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                });
              }

              this.MoengageService.trackEvent('General Errors', {
                product_id: window.sessionStorage.getItem('FormNumber') ?? '',
                product_name: 'Onboarding DIY',
                category: 'Errors',
                ErrorMsg: msg,
                ErrorCode: error.status,
              });
            }
            this.removeModal();
          } else if (error.status === 404) {
            // alert(error.error.Message);

            this.toastr.error('Details Not Found...', 'Error', {
              positionClass: 'toast-bottom-center',
              timeOut: 3500,
            });

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: 'Details Not Found...',
              ErrorCode: error.status,
            });

            this.removeModal();
            this.spinner.hide();
          } else {
            // alert(error.error.Message || 'Server Error');

            this.spinner.hide();
            // let msg =
            //   error.error.message === undefined || null || ''
            //     ? error.error['Message']
            //     : error.error.message ?? error.error;

            let msg =
              (error.error.message ?? '') ||
              (error.error['Message'] ?? '') ||
              (error.error instanceof ProgressEvent ? '' : error.error);

            if (msg === null || msg === '' || msg === undefined) {
              this.toastr.error(
                'Please check the internet connectivity. Still if the issue persists, please contact us at helpdesk@sbicapsec.com',
                '',
                {
                  positionClass: 'toast-bottom-center',
                  timeOut: 3500,
                }
              );
            } else {
              this.toastr.error(msg, '', {
                positionClass: 'toast-bottom-center',
                timeOut: 3500,
              });
            }

            this.MoengageService.trackEvent('General Errors', {
              product_id: window.sessionStorage.getItem('FormNumber') ?? '',
              product_name: 'Onboarding DIY',
              category: 'Errors',
              ErrorMsg: msg,
              ErrorCode: error.status,
            });

            this.removeModal();
            // return throwError(error);
          }
          return throwError(error);
        })
      );
  }

  removeModal() {
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');
    modalBackdrops.forEach((backdrop) => {
      if (backdrop instanceof HTMLElement) {
        backdrop.remove();
      }
    });
  }
}
