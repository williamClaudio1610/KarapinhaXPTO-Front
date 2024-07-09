import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GalleryPhotosComponent } from './gallery-photos.component';

describe('GalleryPhotosComponent', () => {
  let component: GalleryPhotosComponent;
  let fixture: ComponentFixture<GalleryPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GalleryPhotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GalleryPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
