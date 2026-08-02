import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailHomeScreenComponent } from './email-home-screen.component';

describe('EmailHomeScreenComponent', () => {
  let component: EmailHomeScreenComponent;
  let fixture: ComponentFixture<EmailHomeScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailHomeScreenComponent]
    });
    fixture = TestBed.createComponent(EmailHomeScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
