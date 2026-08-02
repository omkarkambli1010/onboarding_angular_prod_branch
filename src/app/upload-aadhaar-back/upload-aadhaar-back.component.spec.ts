import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAadhaarBackComponent } from './upload-aadhaar-back.component';

describe('UploadAadhaarBackComponent', () => {
  let component: UploadAadhaarBackComponent;
  let fixture: ComponentFixture<UploadAadhaarBackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAadhaarBackComponent]
    });
    fixture = TestBed.createComponent(UploadAadhaarBackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
