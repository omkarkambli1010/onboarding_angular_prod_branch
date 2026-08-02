import { Injectable, OnInit } from '@angular/core';
import * as Moengage from '@moengage/web-sdk';

@Injectable({
  providedIn: 'root',
})
export class MoengagesdkService implements OnInit {
  constructor() {
    // this.waitForMoengageSDK(() => {
    //   console.log('MoEngage SDK is ready!');
    //   this.trackEvent('SDK Loaded', { source: 'Angular App' });
    // });
  }

  ngOnInit(): void {}

  // private waitForMoengageSDK(callback: () => void, retries = 10) {

  //   try {
  //     const interval = setInterval(() => {
  //       if ((window as any).moe) {
  //         clearInterval(interval);
  //         callback();
  //       } else if (--retries <= 0) {
  //         clearInterval(interval);
  //         console.error('MoEngage SDK failed to load.');
  //       }
  //     }, 500);
  //   }
  //   catch (error) {
  //     console.error(error)
  //   }
  // }

  // public trackEvent(eventName: string, payload: any = {}) {
  //   try {
  //     console.log('[MoEngage] Tracking Event:', eventName, payload);
  //     (window as any).moengage_q = (window as any).moengage_q || [];
  //     (window as any).moengage_q.push({
  //       f: 'track_event',
  //       a: [eventName, payload]
  //     });
  //   }
  //   catch (error) {
  //     console.error(error)
  //   }
  // }

  // public setUserAttributes(userId: string, email: string, firstName: string, lastName: string) {

  //   try {
  //     (window as any).moengage_q = (window as any).moengage_q || [];
  //     (window as any).moengage_q.push({ f: 'add_unique_user_id', a: [userId] });
  //     (window as any).moengage_q.push({ f: 'add_email', a: [email] });
  //     (window as any).moengage_q.push({ f: 'add_first_name', a: [firstName] });
  //     (window as any).moengage_q.push({ f: 'add_last_name', a: [lastName] });
  //   }
  //   catch (error) {
  //     console.error(error)
  //   }

  // }

  public async MoeInit() {
    await Moengage.initialize({
      // app_id: 'TV0K4G9F9UDUBXFCF7IUI1A1', // UAT App ID
      //app_id: '8Q5GNFTMC64B07VZ67XUTJWY', // PrePod App ID
      // app_id: '8TWYM2SJLK8VXYIOOM07NYJB',   // PROD
      //WORKSPACE / APP ID CHANGE MSF 05-05-2026
      app_id: '3CP79OIK5MBOIQ8JU8Y8AC8C',   // PROD

      debug_logs: 0, // Enable debug logs
      //cluster: 'dc_3',
      cluster: 'dc_3',
      swPath: '/open-demat-account/moe_sw.js' // PROD
      //swPath: '/diy/moe_sw.js' // PrePod App ID
      //swPath: '/moe_sw.js', //Local
    });

    console.log('MoEngage SDK initialized');
  }

  public async trackEvent(eventName: string, payload: any = {}) {
    await Moengage.track_event(eventName, payload);
    console.log('[MoEngage] Event Tracked:', eventName, payload);
  }

  public async setUserAttributes(
    userId: string,
    mobile: string,
    email: string,
    firstName: string,
    lastName: string
  ) {
    await Moengage.add_unique_user_id(userId);
    await Moengage.add_mobile(mobile);
    await Moengage.add_email(email);
    await Moengage.add_first_name(firstName);
    await Moengage.add_last_name(lastName);

    console.log(
      'MoEngage User Attributes Set: ',
      userId,
      mobile,
      email,
      firstName,
      lastName
    );

    await Moengage.call_web_push();

    //await Moengage.destroy_session();
  }

  public async logoutUser() {
    await Moengage.destroy_session();

    console.log('MoEngage session destroyed on logout');
  }
}
