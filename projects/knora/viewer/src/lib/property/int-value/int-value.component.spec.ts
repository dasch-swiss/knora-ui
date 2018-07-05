import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntValueComponent } from './int-value.component';

describe('IntValueComponent', () => {
  let component: IntValueComponent;
  let fixture: ComponentFixture<IntValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IntValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IntValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
