import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalResValueComponent } from './external-res-value.component';

describe('ExternalResValueComponent', () => {
  let component: ExternalResValueComponent;
  let fixture: ComponentFixture<ExternalResValueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExternalResValueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExternalResValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
