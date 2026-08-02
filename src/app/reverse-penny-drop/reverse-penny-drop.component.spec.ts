import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReversePennyDropComponent } from './reverse-penny-drop.component';

describe('ReversePennyDropComponent', () => {
  let component: ReversePennyDropComponent;
  let fixture: ComponentFixture<ReversePennyDropComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ReversePennyDropComponent]
    });
    fixture = TestBed.createComponent(ReversePennyDropComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
