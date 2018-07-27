import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatSelectModule } from '@angular/material';

import { SpecifyPropertyValueComponent } from './specify-property-value.component';
import { ComparisonOperator, Property, PropertyValue } from '@knora/core';

describe('SpecifyPropertyValueComponent', () => {
  let component: SpecifyPropertyValueComponent;
  let fixture: ComponentFixture<SpecifyPropertyValueComponent>;
  const specifyForm: FormGroup = component.form;
  // const comparisonOperatorSelected: ComparisonOperator = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecifyPropertyValueComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule],
      providers: [
        FormBuilder
      ]
    })

      .compileComponents();

  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecifyPropertyValueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnChanges();
  });

  it('should create', inject([FormBuilder], (fb: FormBuilder) => {

    const resolvedPromise = Promise.resolve(null);

    // build a form for the property selection
    this.specifyForm = fb.group({
      comparisonOperator: [null, Validators.required]
    });
    // update the selected property
    /* component.form.valueChanges.subscribe((data) => {
      this.comparisonOperatorSelected = data.comparisonOperator;
    }); */

    resolvedPromise.then(() => {
      specifyForm.removeControl('comparisonOperator');
      specifyForm.addControl('comparisonOperator', this.specifyForm);
    });

    expect(component).toBeTruthy();
  }));

});

