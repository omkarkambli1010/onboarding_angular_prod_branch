import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AggregatorCallbackComponent } from './aggregator-callback.component';

describe('AggregatorCallbackComponent', () => {
  let component: AggregatorCallbackComponent;
  let fixture: ComponentFixture<AggregatorCallbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AggregatorCallbackComponent]
    });
    fixture = TestBed.createComponent(AggregatorCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
