import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Listar_ProfessionaisComponent } from './listar_Professionais.component';

describe('Listar_ProfessionaisComponent', () => {
  let component: Listar_ProfessionaisComponent;
  let fixture: ComponentFixture<Listar_ProfessionaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Listar_ProfessionaisComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Listar_ProfessionaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
