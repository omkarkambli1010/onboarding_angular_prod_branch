import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';

const SITE_SUFFIX = 'Onboarding - SBI Securities';
const DEFAULT_TITLE =
  'Open Demat Account - Demat & Trading Account Online for Free | SBI Securities';

/**
 * WCAG 2.4.2 - every step of the journey needs a title that identifies the
 * current step, not the landing page title inherited from index.html.
 */
@Injectable()
export class PageTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(snapshot: RouterStateSnapshot): void {
    const pageTitle = this.buildTitle(snapshot);
    this.title.setTitle(
      pageTitle ? `${pageTitle} - ${SITE_SUFFIX}` : DEFAULT_TITLE
    );
  }
}
