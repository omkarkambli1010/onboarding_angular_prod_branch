import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAadhaarFrontComponent } from './upload-aadhaar-front.component';

describe('UploadAadhaarFrontComponent', () => {
  let component: UploadAadhaarFrontComponent;
  let fixture: ComponentFixture<UploadAadhaarFrontComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAadhaarFrontComponent]
    });
    fixture = TestBed.createComponent(UploadAadhaarFrontComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
