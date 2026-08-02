import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UploadAdditionalComponent } from './upload-additional.component';

describe('UploadAdditionalComponent', () => {
  let component: UploadAdditionalComponent;
  let fixture: ComponentFixture<UploadAdditionalComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UploadAdditionalComponent]
    });
    fixture = TestBed.createComponent(UploadAdditionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
