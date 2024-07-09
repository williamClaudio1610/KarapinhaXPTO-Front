import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdicionarcategoriaComponent } from './adicionarcategoria.component';

describe('AdicionarcategoriaComponent', () => {
  let component: AdicionarcategoriaComponent;
  let fixture: ComponentFixture<AdicionarcategoriaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdicionarcategoriaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdicionarcategoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
