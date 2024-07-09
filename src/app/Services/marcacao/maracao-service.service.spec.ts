import { TestBed } from '@angular/core/testing';

import { MaracaoServiceService } from './maracao-service.service';

describe('MaracaoServiceService', () => {
  let service: MaracaoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MaracaoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
