import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn, Validators } from '@angular/forms';

@Directive({
    selector: '[kuiExistingName]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ExistingNameDirective, multi: true }]
})
/**
 * With the ExistingNameDirective we could prevent to use a name which has to be unique but already exists
 * e.g. get a list of all project shortnames, then we can use this list as existing names;
 * you can also use it for a list of blacklisted (not allowed) words
 */
export class ExistingNameDirective implements Validators, OnChanges {

    /**
     * @ignore
     */
    @Input() existingName: string;

    /**
     * @ignore
     */
    private valFn = Validators.nullValidator;

    /**
     * @ignore
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        const change = changes['existingName'];
        if (change) {
            const val: string | RegExp = change.currentValue;
            const re = val instanceof RegExp ? val : new RegExp(val);
            this.valFn = existingNameValidator(re);
        } else {
            this.valFn = Validators.nullValidator;
        }
    }

    /**
     * @ignore
     * @param control
     */
    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}

/**
 * Validation of existing name value. String method (only one value);
 * Use it in a "formbuilder" group as a validator property
 *
 * @param {RegExp} nameRegexp
 * @returns ValidatorFn
 */
export function existingNameValidator(nameRegexp: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let name;

        if (control.value) {
            name = control.value.toLowerCase();
        }

        const no = nameRegexp.test(name);
        return no ? { 'existingName': { name } } : null;
    };
}

/**
 * Validation of existing name values. Array method (list of values)
 * Use it in a "formbuilder" group as a validator property
 *
 *
 * @param {RegExp} nameArrayRegexp
 * @returns ValidatorFn
 */
export function existingNamesValidator(nameArrayRegexp: [RegExp]): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } => {

        let name;

        if (control.value) {
            name = control.value.toLowerCase();
        }

        let no;
        for (const existing of nameArrayRegexp) {
            no = existing.test(name);
            if (no) {
                // console.log(no);
                return no ? { 'existingName': { name } } : null;
            }
        }
        return no ? { 'existingName': { name } } : null;
    };
}

/**
 * @ignore
 *
 * @param {RegExp} pattern
 * @param {string} regType
 * @returns ValidatorFn
 */
export function notAllowed(pattern: RegExp, regType: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let name;

        // console.log(regType);

        if (control.value) {
            name = control.value.toLowerCase();
        }

        // console.log(name);

        const no = pattern.test(name);
        return no ? { regType: { name } } : null;
    };
}
