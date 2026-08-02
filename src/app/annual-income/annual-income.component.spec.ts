import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnualIncomeComponent } from './annual-income.component';

describe('AnnualIncomeComponent', () => {
  let component: AnnualIncomeComponent;
  let fixture: ComponentFixture<AnnualIncomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AnnualIncomeComponent]
    });
    fixture = TestBed.createComponent(AnnualIncomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
