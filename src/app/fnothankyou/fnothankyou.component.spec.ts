import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FnothankyouComponent } from './fnothankyou.component';

describe('FnothankyouComponent', () => {
  let component: FnothankyouComponent;
  let fixture: ComponentFixture<FnothankyouComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FnothankyouComponent]
    });
    fixture = TestBed.createComponent(FnothankyouComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
