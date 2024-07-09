import { TestBed } from '@angular/core/testing';

import { ProfissionalServiceService } from './profissional-service.service';

describe('ProfissionalServiceService', () => {
  let service: ProfissionalServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfissionalServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
