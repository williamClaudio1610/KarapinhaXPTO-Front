import { TestBed } from '@angular/core/testing';

import { MarcacaoServiceService } from './marcacao-service.service';

describe('MarcacaoServiceService', () => {
  let service: MarcacaoServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MarcacaoServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
