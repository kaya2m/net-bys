import { TestBed } from '@angular/core/testing';

import { DaireService } from './daire.service';

describe('DaireService', () => {
  let service: DaireService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DaireService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
