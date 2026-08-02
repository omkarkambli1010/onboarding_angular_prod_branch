import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OccupDetailsComponent } from './occup-details.component';

describe('OccupDetailsComponent', () => {
  let component: OccupDetailsComponent;
  let fixture: ComponentFixture<OccupDetailsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OccupDetailsComponent]
    });
    fixture = TestBed.createComponent(OccupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
