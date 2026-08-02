import { TestBed } from '@angular/core/testing';

import { MoengagesdkService } from './moengagesdk.service';

describe('MoengagesdkService', () => {
  let service: MoengagesdkService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MoengagesdkService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
