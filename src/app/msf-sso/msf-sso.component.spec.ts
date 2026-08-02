import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MsfSsoComponent } from './msf-sso.component';

describe('MsfSsoComponent', () => {
  let component: MsfSsoComponent;
  let fixture: ComponentFixture<MsfSsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MsfSsoComponent]
    });
    fixture = TestBed.createComponent(MsfSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
