import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YonoSsoComponent } from './yono-sso.component';

describe('YonoSsoComponent', () => {
  let component: YonoSsoComponent;
  let fixture: ComponentFixture<YonoSsoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [YonoSsoComponent]
    });
    fixture = TestBed.createComponent(YonoSsoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
