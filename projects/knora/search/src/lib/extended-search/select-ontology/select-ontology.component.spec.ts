import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectOntologyComponent } from './select-ontology.component';

describe('SelectOntologyComponent', () => {
  let component: SelectOntologyComponent;
  let fixture: ComponentFixture<SelectOntologyComponent>;
  const ontologyForm: FormGroup = component.form;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectOntologyComponent
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatFormFieldModule,
        MatSelectModule
      ],
      providers: [FormBuilder]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectOntologyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
  });

  it('should create', inject([FormBuilder], (fb: FormBuilder) => {
    this.ontologyForm = fb.group({
      ontology: [null, Validators.required]
    });
    ontologyForm.addControl('ontology', this.ontologyForm);

    expect(component).toBeTruthy();
  }));

});
