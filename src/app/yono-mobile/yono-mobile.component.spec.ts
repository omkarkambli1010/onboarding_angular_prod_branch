import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YonoMobileComponent } from './yono-mobile.component';

describe('YonoMobileComponent', () => {
  let component: YonoMobileComponent;
  let fixture: ComponentFixture<YonoMobileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YonoMobileComponent]
    });
    fixture = TestBed.createComponent(YonoMobileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
