import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdhaarCopyComponent } from './adhaar-copy.component';

describe('AdhaarCopyComponent', () => {
  let component: AdhaarCopyComponent;
  let fixture: ComponentFixture<AdhaarCopyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdhaarCopyComponent]
    });
    fixture = TestBed.createComponent(AdhaarCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
