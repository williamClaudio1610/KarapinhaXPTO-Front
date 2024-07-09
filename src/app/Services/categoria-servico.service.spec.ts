import { TestBed } from '@angular/core/testing';

import { CategoriaServicoService } from './categoria-servico.service';

describe('CategoriaServicoService', () => {
  let service: CategoriaServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoriaServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
