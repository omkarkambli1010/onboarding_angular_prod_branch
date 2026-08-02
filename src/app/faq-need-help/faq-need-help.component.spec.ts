import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FaqNeedHelpComponent } from './faq-need-help.component';

describe('FaqNeedHelpComponent', () => {
  let component: FaqNeedHelpComponent;
  let fixture: ComponentFixture<FaqNeedHelpComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FaqNeedHelpComponent]
    });
    fixture = TestBed.createComponent(FaqNeedHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
