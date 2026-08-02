import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NomineeOptoutComponent } from './nominee-optout.component';

describe('NomineeOptoutComponent', () => {
  let component: NomineeOptoutComponent;
  let fixture: ComponentFixture<NomineeOptoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NomineeOptoutComponent]
    });
    fixture = TestBed.createComponent(NomineeOptoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
