import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPgComponent } from './list-pg.component';

describe('ListPgComponent', () => {
  let component: ListPgComponent;
  let fixture: ComponentFixture<ListPgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
