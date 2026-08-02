import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomineeCallbackComponent } from './nominee-callback.component';

describe('NomineeCallbackComponent', () => {
  let component: NomineeCallbackComponent;
  let fixture: ComponentFixture<NomineeCallbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NomineeCallbackComponent]
    });
    fixture = TestBed.createComponent(NomineeCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
