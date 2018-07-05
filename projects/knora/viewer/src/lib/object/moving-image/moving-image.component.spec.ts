import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MovingImageComponent } from './moving-image.component';

describe('MovingImageComponent', () => {
  let component: MovingImageComponent;
  let fixture: ComponentFixture<MovingImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MovingImageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MovingImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
