import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YonoEmailComponent } from './yono-email.component';

describe('YonoEmailComponent', () => {
  let component: YonoEmailComponent;
  let fixture: ComponentFixture<YonoEmailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YonoEmailComponent]
    });
    fixture = TestBed.createComponent(YonoEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
