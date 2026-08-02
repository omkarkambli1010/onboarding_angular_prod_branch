import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SegmentPreferenceComponent } from './segment-preference.component';

describe('SegmentPreferenceComponent', () => {
  let component: SegmentPreferenceComponent;
  let fixture: ComponentFixture<SegmentPreferenceComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SegmentPreferenceComponent]
    });
    fixture = TestBed.createComponent(SegmentPreferenceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
