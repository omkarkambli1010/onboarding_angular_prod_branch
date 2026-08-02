import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DigilockerScreenComponent } from './digilocker-screen.component';

describe('DigilockerScreenComponent', () => {
  let component: DigilockerScreenComponent;
  let fixture: ComponentFixture<DigilockerScreenComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DigilockerScreenComponent]
    });
    fixture = TestBed.createComponent(DigilockerScreenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
