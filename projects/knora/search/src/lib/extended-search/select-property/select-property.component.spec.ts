import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { MatCheckboxModule, MatFormFieldModule, MatSelectModule } from '@angular/material';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { SelectPropertyComponent } from './select-property.component';
import { SpecifyPropertyValueComponent } from './specify-property-value/specify-property-value.component';

describe('SelectPropertyComponent', () => {
  let component: SelectPropertyComponent;
  let fixture: ComponentFixture<SelectPropertyComponent>;
  const resolvedPromise = Promise.resolve(null);
  const propIndex: string = null;
  const index: string = null;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SelectPropertyComponent, SpecifyPropertyValueComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatSelectModule]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.ngOnInit();
    component.ngOnDestroy();
  });

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    component.formGroup = fb.group({
      ontology: [null, Validators.required]
    });
    resolvedPromise.then(() => {
      this.propIndex = 'property' + this.index;
      component.formGroup.addControl(this.propIndex, component.form);
      component.formGroup.removeControl(this.propIndex);
    });
  }));



  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
