import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  // private allRoutes: string[] =

  //   [
  //     '/email',
  //     '/uploadProcess/1',
  //     '/personalDetailsForm/1',
  //     '/personalDetailsForm/2',
  //     '/personalDetailsForm/3',
  //     '/personalDetailsForm/4',
  //     '/personalDetailsForm/5',
  //     '/personalDetailsForm/6',
  //     '/PennyDrop/2',
  //     '/planprocess/1',
  //     '/planprocess/2',
  //     '/planprocess/3',
  //     '/CaptureSelfie/1',
  //     '/CaptureSelfie/2',
  //     '/uploadSignature',
  //     '/uploadPan',
  //     '/nameChange',
  //     '/addNominee/1',
  //     '/addNominee/2',
  //     '/esign',
  //     '/thankyou',

  //   ]

  private allowedRoutes: string[] = [];
  private historyStack: string[] = []; // Stack to track navigation history

  constructor(private router: Router, private http: HttpClient, private spinner: NgxSpinnerService) { }

  // setRoutes(routes: string[]): void {
  //   this.allowedRoutes = routes;
  // }

  // Navigate to the next step and push it to history
  navigateToNextStep(): void {

    if (!this.allowedRoutes.length) {
      const storedRoutes = sessionStorage.getItem('allowedRoutes');

      if (storedRoutes) {
        
        this.allowedRoutes = JSON.parse(storedRoutes!);

      }
      else
      {
        setTimeout(() => {

          this.router.navigate(["/"]); // Navigate to next route
        
          this.spinner.hide();
        }, 100);
      }
    }

    if (this.allowedRoutes.length > 0) {

      let nextRoute: any 

      // if(this.allowedRoutes.some(str => str.includes('uploadProcess')))
      // {
      //   nextRoute = this.allowedRoutes.shift();
      //   nextRoute = this.allowedRoutes.shift();
      // }
      // else
      // {
      // }
      nextRoute = this.allowedRoutes.shift(); // Get the next route

      sessionStorage.setItem('allowedRoutes', JSON.stringify(this.allowedRoutes))

      if (nextRoute) {
        this.historyStack.push(nextRoute); // Push route to history stack

        setTimeout(() => {

          this.router.navigate([nextRoute]); // Navigate to next route

          this.spinner.hide();

        }, 200);
      }
    }
  }

  // Navigate to the previous step using the history stack
  navigateToPreviousStep(): void {
    if (this.historyStack.length > 1) {
      this.historyStack.pop(); // Remove the current route
      const previousRoute = this.historyStack[this.historyStack.length - 1]; // Get last route in stack

      setTimeout(() => {

        this.router.navigate([previousRoute]); // Navigate to previous route

        this.spinner.hide();

      }, 200);
    }
  }

  fetchRejectedRoutes(rejectedRoutes: string[], location: string): void {

    this.allowedRoutes = rejectedRoutes;  //this.allRoutes.filter(route => rejectedRoutes.includes(route));

    sessionStorage.setItem('allowedRoutes', JSON.stringify(this.allowedRoutes))

    if(location != "Aadhar")
    {
      this.navigateToNextStep(); // Start with the first allowed route
    }    

  }

}
