import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';

/**
 * Abstract component that is the base for all GUI element components.
 */
@Component({
  template: ``
})
export abstract class BaseElementComponent<T> {

    constructor (@Inject(FormBuilder) protected fb: FormBuilder) {
    }

    @Input() formGroup: FormGroup;

    @Input() set eleVal(value: T) {
        this._eleVal = value || null;
    }

    get eleVal(): T {
        return this._eleVal;
    }

    protected _eleVal: T;

    @Input() readonlyValue = false;

    form: FormGroup;

    protected abstract validators: ValidatorFn[];

}
