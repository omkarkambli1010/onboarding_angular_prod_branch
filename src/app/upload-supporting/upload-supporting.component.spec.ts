import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadSupportingComponent } from './upload-supporting.component';

describe('UploadSupportingComponent', () => {
  let component: UploadSupportingComponent;
  let fixture: ComponentFixture<UploadSupportingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadSupportingComponent]
    });
    fixture = TestBed.createComponent(UploadSupportingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
