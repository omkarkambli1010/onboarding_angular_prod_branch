import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FnoesignComponent } from './fnoesign.component';

describe('FnoesignComponent', () => {
  let component: FnoesignComponent;
  let fixture: ComponentFixture<FnoesignComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FnoesignComponent]
    });
    fixture = TestBed.createComponent(FnoesignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
