import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DddComponent } from './ddd.component';

describe('DddComponent', () => {
  let component: DddComponent;
  let fixture: ComponentFixture<DddComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DddComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DddComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
