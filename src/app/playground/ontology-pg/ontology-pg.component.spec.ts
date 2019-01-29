import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyPgComponent } from './ontology-pg.component';

describe('OntologyPgComponent', () => {
  let component: OntologyPgComponent;
  let fixture: ComponentFixture<OntologyPgComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntologyPgComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologyPgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
