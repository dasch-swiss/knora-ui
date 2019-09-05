import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringLiteralInputComponent } from './string-literal-input.component';

describe('StringLiteralInputComponent', () => {
  let component: StringLiteralInputComponent;
  let fixture: ComponentFixture<StringLiteralInputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringLiteralInputComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringLiteralInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
