import { Inject, Input, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

/**
 * Abstract component that is the base for all GUI element components.
 */
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

    @Input() index?: number;

    protected controlName: string;

    form: FormGroup;

    protected abstract validators: ValidatorFn[];

    // https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
    protected resolvedPromise = Promise.resolve(null);

    protected valueChangesSubscription: Subscription;

    abstract placeholder: string;

    protected initialize() {

        this.form = this.fb.group({
            elementValue: [this._eleVal, Validators.compose(this.validators)]
        });

        this.valueChangesSubscription = this.form.valueChanges.subscribe((data) => {

            if (data.elementValue !== undefined) {
                this.eleVal = data.elementValue;
            }
        });

        const ctrlNameBase = 'eleValueCtrl';
        if (this.index !== undefined) {
            this.controlName = ctrlNameBase + String(this.index);
        } else {
            this.controlName = ctrlNameBase;
        }

        // add to form group
        this.resolvedPromise.then(() => {
            // add form to the parent form group
            this.formGroup.addControl(this.controlName, this.form);
        });

    }

    protected change(changes: SimpleChanges) {

        if (this.form !== undefined && changes['eleVal'] !== undefined) {
            this.form.setValue({
                elementValue: this.eleVal
            });
        }
    }

    protected destroy() {

        // remove form from the parent form group
        this.resolvedPromise.then(() => {
            if (this.valueChangesSubscription !== undefined) this.valueChangesSubscription.unsubscribe();
            this.formGroup.removeControl(this.controlName);
        });
    }

}
