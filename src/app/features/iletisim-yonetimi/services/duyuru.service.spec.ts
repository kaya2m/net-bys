import { TestBed } from '@angular/core/testing';

import { DuyuruService } from './duyuru.service';

describe('DuyuruService', () => {
  let service: DuyuruService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DuyuruService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
