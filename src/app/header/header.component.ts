import { Component } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  clientid: any;
  // utm_source: string = 'search-engine';
  // utm_medium: string = 'organic';
  // utm_campaign: string = 'Onboarding-DIY';
  utm_source: string = '';
  utm_medium: string = '';
  utm_campaign: string = '';

  constructor(
    private router: Router,
    private spinner: NgxSpinnerService,
    private title: Title,
    private meta: Meta,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.title.setTitle('Header - Onboarding-DIY-PWA');

    this.meta.updateTag({
      name: 'description',
      content: 'Header Page of DIY.',
    });

    this.clientid = sessionStorage.getItem('clientid') ?? '';
    this.utm_source =
      this.route.snapshot.queryParams['utm_source'] || 'search-engine';
    this.utm_medium =
      this.route.snapshot.queryParams['utm_medium'] || 'organic';
    this.utm_campaign =
      this.route.snapshot.queryParams['utm_campaign'] || 'Onboarding-DIY';
  }

redirectHome() {
    this.spinner.show();
    const currentUrl = this.router.url;
    if (currentUrl === '/page-not-found') {
      window.localStorage.clear();
      window.sessionStorage.clear();
      this.router.navigate(['/']);
      this.spinner.hide();
    } else {
      location.reload();
      this.spinner.hide();
    }
  }

}
