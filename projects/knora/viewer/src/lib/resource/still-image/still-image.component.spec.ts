import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StillImageComponent } from './still-image.component';

describe('StillImageComponent', () => {
  let component: StillImageComponent;
  let fixture: ComponentFixture<StillImageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StillImageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StillImageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
