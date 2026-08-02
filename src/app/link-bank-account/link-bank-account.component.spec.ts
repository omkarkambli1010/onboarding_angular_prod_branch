import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkBankAccountComponent } from './link-bank-account.component';

describe('LinkBankAccountComponent', () => {
  let component: LinkBankAccountComponent;
  let fixture: ComponentFixture<LinkBankAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkBankAccountComponent]
    });
    fixture = TestBed.createComponent(LinkBankAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
