import { TestBed } from '@angular/core/testing';

import { BlokService } from './blok.service';

describe('BlokService', () => {
  let service: BlokService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlokService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
