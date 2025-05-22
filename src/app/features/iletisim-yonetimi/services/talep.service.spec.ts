import { TestBed } from '@angular/core/testing';

import { TalepService } from './talep.service';

describe('TalepService', () => {
  let service: TalepService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TalepService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
