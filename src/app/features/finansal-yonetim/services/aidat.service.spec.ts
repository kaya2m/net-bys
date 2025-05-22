import { TestBed } from '@angular/core/testing';

import { AidatService } from './aidat.service';

describe('AidatService', () => {
  let service: AidatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AidatService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
