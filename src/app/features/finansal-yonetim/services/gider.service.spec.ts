import { TestBed } from '@angular/core/testing';

import { GiderService } from './gider.service';

describe('GiderService', () => {
  let service: GiderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GiderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
