import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarProfissionaisComponent } from './registrar-profissionais.component';

describe('RegistrarProfissionaisComponent', () => {
  let component: RegistrarProfissionaisComponent;
  let fixture: ComponentFixture<RegistrarProfissionaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegistrarProfissionaisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegistrarProfissionaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
