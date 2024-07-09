import { TestBed } from '@angular/core/testing';

import { UtilizadorGuardsGuard } from './utilizador-guards.guard';

describe('UtilizadorGuardsGuard', () => {
  let guard: UtilizadorGuardsGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(UtilizadorGuardsGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
