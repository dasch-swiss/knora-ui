import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExistingNameComponent } from './existing-name.component';

describe('ExistingNameComponent', () => {
  let component: ExistingNameComponent;
  let fixture: ComponentFixture<ExistingNameComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExistingNameComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExistingNameComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
