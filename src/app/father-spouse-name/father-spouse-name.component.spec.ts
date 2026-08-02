import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FatherSpouseNameComponent } from './father-spouse-name.component';

describe('FatherSpouseNameComponent', () => {
  let component: FatherSpouseNameComponent;
  let fixture: ComponentFixture<FatherSpouseNameComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FatherSpouseNameComponent]
    });
    fixture = TestBed.createComponent(FatherSpouseNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
