import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanPreferenceComponent } from './plan-preference.component';

describe('PlanPreferenceComponent', () => {
  let component: PlanPreferenceComponent;
  let fixture: ComponentFixture<PlanPreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanPreferenceComponent]
    });
    fixture = TestBed.createComponent(PlanPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
