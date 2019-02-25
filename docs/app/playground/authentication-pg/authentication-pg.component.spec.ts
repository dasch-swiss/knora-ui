import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthenticationPgComponent } from './authentication-pg.component';

describe('AuthenticationPgComponent', () => {
  let component: AuthenticationPgComponent;
  let fixture: ComponentFixture<AuthenticationPgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AuthenticationPgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthenticationPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
