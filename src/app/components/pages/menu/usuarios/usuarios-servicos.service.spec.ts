import { TestBed } from '@angular/core/testing';

import { UsuariosServicosService } from './usuarios-servicos.service';

describe('UsuariosServicosService', () => {
  let service: UsuariosServicosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UsuariosServicosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
