import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginaServicosComponent } from './pagina-servicos.component';

describe('PaginaServicosComponent', () => {
  let component: PaginaServicosComponent;
  let fixture: ComponentFixture<PaginaServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PaginaServicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PaginaServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
