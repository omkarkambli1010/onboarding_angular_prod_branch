import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailHomePageComponent } from './email-home-page.component';

describe('EmailHomePageComponent', () => {
  let component: EmailHomePageComponent;
  let fixture: ComponentFixture<EmailHomePageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailHomePageComponent]
    });
    fixture = TestBed.createComponent(EmailHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
