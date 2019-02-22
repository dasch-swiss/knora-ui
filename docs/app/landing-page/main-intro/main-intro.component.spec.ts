import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MainIntroComponent } from './main-intro.component';

describe('MainIntroComponent', () => {
  let component: MainIntroComponent;
  let fixture: ComponentFixture<MainIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MainIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MainIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the landing page on route \'/\'', () => {
    expect(component).toBeTruthy();
  });

});
