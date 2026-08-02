import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YonotabSsoComponent } from './yonotab-sso.component';

describe('YonotabSsoComponent', () => {
  let component: YonotabSsoComponent;
  let fixture: ComponentFixture<YonotabSsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YonotabSsoComponent]
    });
    fixture = TestBed.createComponent(YonotabSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
