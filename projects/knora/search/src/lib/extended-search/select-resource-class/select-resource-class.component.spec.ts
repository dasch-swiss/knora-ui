import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatSelectModule } from '@angular/material';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ResourceClass } from '@knora/core';

import { SelectResourceClassComponent } from './select-resource-class.component';

describe('SelectResourceClassComponent', () => {
  let component: SelectResourceClassComponent;
  let fixture: ComponentFixture<SelectResourceClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SelectResourceClassComponent
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

  beforeEach(inject([FormBuilder], (fb: FormBuilder) => {
    fixture = TestBed.createComponent(SelectResourceClassComponent);
    component = fixture.componentInstance;
    component.ngOnChanges();
    component.ngOnInit();
    fixture.detectChanges();

    const resolvedPromise = Promise.resolve(null);
    component.formGroup = fb.group({
      resourceClass: [null]
    });
    component.formGroup.addControl('resourceClass', component.form);

    if (component.form !== undefined) {
      resolvedPromise.then(() => {
        component.formGroup.removeControl('resourceClass');
        component.formGroup.addControl('resourceClass', component.form);
      });
    }

  }));

  it('should create', async () => {
    expect(component).toBeTruthy();
  });

});
