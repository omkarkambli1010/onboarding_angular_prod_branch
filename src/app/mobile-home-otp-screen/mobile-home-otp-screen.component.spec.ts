import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileHomeOtpScreenComponent } from './mobile-home-otp-screen.component';

describe('MobileHomeOtpScreenComponent', () => {
  let component: MobileHomeOtpScreenComponent;
  let fixture: ComponentFixture<MobileHomeOtpScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MobileHomeOtpScreenComponent]
    });
    fixture = TestBed.createComponent(MobileHomeOtpScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
