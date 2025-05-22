import { TestBed } from '@angular/core/testing';

import { BildirimService } from './bildirim.service';

describe('BildirimService', () => {
  let service: BildirimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BildirimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
