import { TestBed } from '@angular/core/testing';

import { HorarioServicoService } from './horario-servico.service';

describe('HorarioServicoService', () => {
  let service: HorarioServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HorarioServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
