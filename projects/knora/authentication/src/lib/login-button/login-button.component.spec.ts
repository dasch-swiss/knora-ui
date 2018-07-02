import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginButtonComponent} from './login-button.component';
import {MatButtonModule, MatDialogModule, MatDialogRef} from '@angular/material';

describe('LoginButtonComponent', () => {
  let component: LoginButtonComponent;
  let fixture: ComponentFixture<LoginButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        imports: [
            MatButtonModule,
            MatDialogModule
        ],
        providers: [
            {provide: MatDialogRef}
        ],
        declarations: [ LoginButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
