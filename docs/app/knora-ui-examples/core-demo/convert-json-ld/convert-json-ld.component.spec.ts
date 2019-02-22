import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvertJsonLdComponent } from './convert-json-ld.component';

describe('ConvertJsonLdComponent', () => {
  let component: ConvertJsonLdComponent;
  let fixture: ComponentFixture<ConvertJsonLdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConvertJsonLdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConvertJsonLdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
