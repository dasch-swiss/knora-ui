import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextfileValueComponent } from './textfile-value.component';

describe('TextfileValueComponent', () => {
  let component: TextfileValueComponent;
  let fixture: ComponentFixture<TextfileValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextfileValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextfileValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
