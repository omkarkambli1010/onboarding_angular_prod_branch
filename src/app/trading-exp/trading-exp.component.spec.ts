import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingExpComponent } from './trading-exp.component';

describe('TradingExpComponent', () => {
  let component: TradingExpComponent;
  let fixture: ComponentFixture<TradingExpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TradingExpComponent]
    });
    fixture = TestBed.createComponent(TradingExpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
