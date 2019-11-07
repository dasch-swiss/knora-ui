import { Component, Inject, Input } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn } from '@angular/forms';

/**
 * Abstract component that is the base for all GUI element components.
 */
@Component({
    template: ``
})
export abstract class BaseElementComponent<T> {

    constructor(@Inject(FormBuilder) protected fb: FormBuilder) {
    }

    @Input() formGroup: FormGroup;

    @Input()
    set eleVal(value: T) {
        this._eleVal = value || null;
    }

    get eleVal(): T | null {
        if (this.form.valid) {
            return this._eleVal;
        } else {
            return null;
        }
    }

    protected _eleVal: T;

    @Input() readonlyValue = false;

    abstract form: FormGroup;

    protected abstract validators: ValidatorFn[];

}
