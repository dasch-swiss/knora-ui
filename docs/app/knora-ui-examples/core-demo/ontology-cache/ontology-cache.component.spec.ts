import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OntologyCacheComponent } from './ontology-cache.component';

describe('OntologyCacheComponent', () => {
  let component: OntologyCacheComponent;
  let fixture: ComponentFixture<OntologyCacheComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OntologyCacheComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OntologyCacheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
