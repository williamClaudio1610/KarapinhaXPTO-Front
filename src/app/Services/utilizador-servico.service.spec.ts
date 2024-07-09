import { TestBed } from '@angular/core/testing';

import { UtilizadorServicoService } from './utilizador-servico.service';

describe('UtilizadorServicoService', () => {
  let service: UtilizadorServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilizadorServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
