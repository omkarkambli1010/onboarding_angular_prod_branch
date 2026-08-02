import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailHomeOtpScreenComponent } from './email-home-otp-screen.component';

describe('EmailHomeOtpScreenComponent', () => {
  let component: EmailHomeOtpScreenComponent;
  let fixture: ComponentFixture<EmailHomeOtpScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailHomeOtpScreenComponent]
    });
    fixture = TestBed.createComponent(EmailHomeOtpScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
