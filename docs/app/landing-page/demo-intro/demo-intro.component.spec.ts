import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DemoIntroComponent } from './demo-intro.component';

describe('DemoIntroComponent', () => {
  let component: DemoIntroComponent;
  let fixture: ComponentFixture<DemoIntroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DemoIntroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DemoIntroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
