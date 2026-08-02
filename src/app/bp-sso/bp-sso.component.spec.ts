import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BpSsoComponent } from './bp-sso.component';

describe('BpSsoComponent', () => {
  let component: BpSsoComponent;
  let fixture: ComponentFixture<BpSsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BpSsoComponent]
    });
    fixture = TestBed.createComponent(BpSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
