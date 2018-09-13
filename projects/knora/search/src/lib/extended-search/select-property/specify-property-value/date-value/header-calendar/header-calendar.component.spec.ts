import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header-calendar.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent<any>;
  let fixture: ComponentFixture<HeaderComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
