import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationDemoComponent } from './authentication-demo.component';

describe('AuthenticationDemoComponent', () => {
  let component: AuthenticationDemoComponent;
  let fixture: ComponentFixture<AuthenticationDemoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationDemoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
