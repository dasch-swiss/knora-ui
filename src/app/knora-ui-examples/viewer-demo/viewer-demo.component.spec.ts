import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewerDemoComponent } from './viewer-demo.component';

describe('ViewerDemoComponent', () => {
  let component: ViewerDemoComponent;
  let fixture: ComponentFixture<ViewerDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewerDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewerDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
