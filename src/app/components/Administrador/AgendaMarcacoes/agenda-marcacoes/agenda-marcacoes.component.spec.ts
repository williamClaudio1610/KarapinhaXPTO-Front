import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AgendaMarcacoesComponent } from './agenda-marcacoes.component';

describe('AgendaMarcacoesComponent', () => {
  let component: AgendaMarcacoesComponent;
  let fixture: ComponentFixture<AgendaMarcacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AgendaMarcacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AgendaMarcacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
