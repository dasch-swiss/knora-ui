import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueComponent } from './list-value.component';

xdescribe('ListValueComponent', () => {
  let component: ListValueComponent;
  let fixture: ComponentFixture<ListValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
