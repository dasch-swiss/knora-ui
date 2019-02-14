import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisplayComponent } from './list-display.component';

describe('ListDisplayComponent', () => {
  let component: ListDisplayComponent;
  let fixture: ComponentFixture<ListDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListDisplayComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
