import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PennyDropComponent } from './penny-drop.component';

describe('PennyDropComponent', () => {
  let component: PennyDropComponent;
  let fixture: ComponentFixture<PennyDropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PennyDropComponent]
    });
    fixture = TestBed.createComponent(PennyDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
