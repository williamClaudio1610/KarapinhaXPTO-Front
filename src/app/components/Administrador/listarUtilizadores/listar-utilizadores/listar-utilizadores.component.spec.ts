import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarUtilizadoresComponent } from './listar-utilizadores.component';

describe('ListarUtilizadoresComponent', () => {
  let component: ListarUtilizadoresComponent;
  let fixture: ComponentFixture<ListarUtilizadoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListarUtilizadoresComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListarUtilizadoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
