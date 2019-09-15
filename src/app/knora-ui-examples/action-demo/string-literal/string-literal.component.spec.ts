import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StringLiteralComponent } from './string-literal.component';

describe('StringLiteralComponent', () => {
  let component: StringLiteralComponent;
  let fixture: ComponentFixture<StringLiteralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StringLiteralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StringLiteralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
