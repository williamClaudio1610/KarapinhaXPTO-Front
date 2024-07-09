import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MarcacoesComponent } from './marcacoes.component';

describe('MarcacoesComponent', () => {
  let component: MarcacoesComponent;
  let fixture: ComponentFixture<MarcacoesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MarcacoesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MarcacoesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
