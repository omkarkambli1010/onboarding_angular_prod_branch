import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import { register } from 'swiper/element/bundle';
import Lenis from 'lenis';
register();

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  standalone: false
})
export class AppComponent implements OnInit {
  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.isAppHeaderVisible(this.isExcludedRoute);
  }

  @HostListener('document:contextmenu', ['$event'])
  onRightClick(event: MouseEvent) {
    event.preventDefault();
  }
  
  ngAfterViewInit(): void {
    const lenis = new Lenis({
      duration: 2.0,
      smoothWheel: true,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
  }


  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent) {
    if ((event.ctrlKey && event.shiftKey &&
      (event.key.toLowerCase() === 'i' || event.key.toLowerCase() === 'j' || event.key.toLowerCase() === 'c')) ||
      (event.key === 'F12')
    ) {
      event.preventDefault();
      event.stopPropagation();
      return false;
    }
    return true;
  }

  isheadervisible: boolean = false
  excludedRoutes: string[] = ['yono-mobile', 'yono-sso', 'yono-email']; // Add your routes here
  isExcludedRoute: boolean = false;

  title = 'onboarding-diy-pwa';


  constructor(
    private spinner: NgxSpinnerService,
    private router: Router,
    private renderer: Renderer2
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isExcludedRoute = this.excludedRoutes.some(route => event.urlAfterRedirects.includes(route));

        this.isheadervisible = this.isAppHeaderVisible(this.isExcludedRoute);
      }
    });

    console.log('Header Visible', this.isheadervisible)
  }

  ngOnInit() {
    this.clearCaches();
    this.setupBackButtonHandling();
    this.getDeviceType();

    // this.waitForMoengageSDK(() => {
    //   console.log('MoEngage SDK is ready!');
    //   this.trackEvent('SDK Loaded', { source: 'Angular App' });
    // });

  }

  showSpinner() {
    this.spinner.show();
  }

  stopSpinner() {
    setTimeout(() => {
      this.spinner.hide();
    }, 2000);
  }

  clearCaches() {
    if ('caches' in window) {
      caches
        .keys()
        .then((cacheNames) => {
          //console.log('Caches available to clear:', cacheNames);
          return Promise.all(
            cacheNames.map((cache) => {
              //console.log(`Deleting cache: ${cache}`);
              return caches.delete(cache);
            })
          );
        })
        .then(() => {
          //console.log('All caches cleared');
        })
        .catch((error) => {
          console.error('Error clearing caches:', error);
        });
    } else {
      console.warn('Cache API not supported in this browser.');
    }
  }

  getDeviceType(): string {
    const userAgent: string = navigator.userAgent;
    // //console.log('userAgent', userAgent);

    if (/mobile/i.test(userAgent)) {
      return 'Mobile';
    } else if (/tablet/i.test(userAgent)) {
      return 'Tablet';
    } else {
      return 'Desktop';
    }
  }

  isAppHeaderVisible(route: boolean): boolean {
    const deviceType = this.getDeviceType();
    return deviceType === 'Desktop' || deviceType === 'Tablet' || route;
  }

  setupBackButtonHandling() {
    history.pushState(null, '', location.href);

    window.onpopstate = () => {
      history.go(1);
    };
  }

  disableZoom() {
    // Disable pinch-to-zoom
    this.renderer.listen('document', 'touchstart', (event: TouchEvent) => {
      if (event.touches.length > 1) {
        event.preventDefault();
      }
    });

    // Disable double-tap zoom
    let lastTouchEnd = 0;
    this.renderer.listen('document', 'touchend', (event: TouchEvent) => {
      const now = new Date().getTime();
      if (now - lastTouchEnd <= 300) {
        event.preventDefault();
      }
      lastTouchEnd = now;
    });
  }



  // private waitForMoengageSDK(callback: () => void, retries = 10) {
  //   const interval = setInterval(() => {
  //     if ((window as any).moe) {
  //       clearInterval(interval);
  //       callback();
  //     } else if (--retries <= 0) {
  //       clearInterval(interval);
  //       console.error('MoEngage SDK failed to load.');
  //     }
  //   }, 500);
  // }

  // public trackEvent(eventName: string, payload: any = {}) {
  //   (window as any).moengage_q = (window as any).moengage_q || [];
  //   (window as any).moengage_q.push({
  //     f: 'track_event',
  //     a: [eventName, payload]
  //   });
  // }



  // handleRouterEvents() {
  //   this.router.events.subscribe((event) => {
  //     if (event instanceof NavigationStart) {
  //       this.showSpinner();
  //     }

  //     this.stopSpinner();
  //   });
  // }
}
