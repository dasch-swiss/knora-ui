import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoIndexComponent } from './demo-index.component';

describe('DemoIndexComponent', () => {
  let component: DemoIndexComponent;
  let fixture: ComponentFixture<DemoIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
