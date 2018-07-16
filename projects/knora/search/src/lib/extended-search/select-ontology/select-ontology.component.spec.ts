import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';

import { SelectOntologyComponent } from './select-ontology.component';

describe('SelectOntologyComponent', () => {
  let component: SelectOntologyComponent;
  let fixture: ComponentFixture<SelectOntologyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectOntologyComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
