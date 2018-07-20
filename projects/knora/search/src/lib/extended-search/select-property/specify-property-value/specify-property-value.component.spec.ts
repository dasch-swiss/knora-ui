import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCheckboxModule, MatFormFieldModule, MatSelectModule } from '@angular/material';

import { SpecifyPropertyValueComponent } from './specify-property-value.component';
import { Property, PropertyValue } from '@knora/core';

describe('SpecifyPropertyValueComponent', () => {
  let component: SpecifyPropertyValueComponent;
  let fixture: ComponentFixture<SpecifyPropertyValueComponent>;

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
        FormBuilder, FormGroup
      ]
    })
      .compileComponents();
  }));

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(SpecifyPropertyValueComponent);
    component = fixture.componentInstance;
    component.formGroup = fb.group({
      comparisonOperator: [null, null, Validators.required]
    });
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
    // console.log('SpecifyPropertyValueComponent: ', component);
  });
});
