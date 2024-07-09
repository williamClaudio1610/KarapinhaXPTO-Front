import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmarMarcacoesComponent } from './confirmar-marcacoes.component';

describe('ConfirmarMarcacoesComponent', () => {
  let component: ConfirmarMarcacoesComponent;
  let fixture: ComponentFixture<ConfirmarMarcacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ConfirmarMarcacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfirmarMarcacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
