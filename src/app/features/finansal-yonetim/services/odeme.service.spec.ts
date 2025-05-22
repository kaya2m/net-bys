import { TestBed } from '@angular/core/testing';

import { OdemeService } from './odeme.service';

describe('OdemeService', () => {
  let service: OdemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OdemeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
