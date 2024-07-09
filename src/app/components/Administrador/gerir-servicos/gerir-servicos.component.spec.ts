import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GerirServicosComponent } from './gerir-servicos.component';

describe('GerirServicosComponent', () => {
  let component: GerirServicosComponent;
  let fixture: ComponentFixture<GerirServicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GerirServicosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GerirServicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
