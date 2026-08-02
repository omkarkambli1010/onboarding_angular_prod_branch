import { AfterViewInit, Directive, ElementRef, Renderer2 } from '@angular/core';

/**
 * The `ng-otp-input` library renders bare <input> elements with no accessible
 * name, which fails WCAG 1.3.1 / 3.3.2 / 4.1.2 ("Form elements must have labels").
 *
 * This directive matches every <ng-otp-input> element in the app and, after the
 * inputs are rendered, gives each one an aria-label ("OTP digit N of M") plus a
 * numeric inputmode. Applying it via the element selector means it is enforced
 * automatically across all OTP screens (mobile, email, yono, bp-sso, nominee...).
 */
@Directive({
  selector: 'ng-otp-input',
  standalone: false,
})
export class OtpAriaLabelDirective implements AfterViewInit {
  constructor(private el: ElementRef, private renderer: Renderer2) {}

  ngAfterViewInit(): void {
    // Defer so the library has rendered its inputs into the DOM.
    setTimeout(() => this.applyLabels(), 0);
  }

  private applyLabels(): void {
    const inputs: NodeListOf<HTMLInputElement> =
      this.el.nativeElement.querySelectorAll('input.otp-input');
    inputs.forEach((input, index) => {
      if (!input.getAttribute('aria-label')) {
        this.renderer.setAttribute(
          input,
          'aria-label',
          `OTP digit ${index + 1} of ${inputs.length}`,
        );
      }
      this.renderer.setAttribute(input, 'inputmode', 'numeric');
    });
  }
}
