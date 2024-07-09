import { TestBed } from '@angular/core/testing';

import { ServicoxptoService } from './servicoxpto.service';

describe('ServicoxptoService', () => {
  let service: ServicoxptoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ServicoxptoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
