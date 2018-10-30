import { Directive, Input, OnChanges, SimpleChanges } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidatorFn, Validators } from '@angular/forms';

@Directive({
    selector: '[kuiExistingName]',
    providers: [{ provide: NG_VALIDATORS, useExisting: ExistingNameDirective, multi: true }]
})
/**
 * With the ExistingNameDirective we could prevent to use an already existing name
 * e.g. get a list of all project shortnames, then we can use this list as existing names
 * TODO: implement projectsService.getAll
 */
export class ExistingNameDirective implements Validators, OnChanges {
    @Input() existingName: string;
    private valFn = Validators.nullValidator;

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

    validate(control: AbstractControl): { [key: string]: any } {
        return this.valFn(control);
    }
}

/**
 * Validation of existing name value.
 *
 * @param {RegExp} nameRe
 * @returns ValidatorFn
 */
export function existingNameValidator(nameRe: RegExp): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
        let name;

        if (control.value) {
            name = control.value.toLowerCase();
        }

        const no = nameRe.test(name);
        return no ? { 'existingName': { name } } : null;
    };
}

/**
 * The same as above, but with an array list of existing names.
 *
 * @param {RegExp} nameAr
 * @returns ValidatorFn
 */
export function existingNamesValidator(nameAr: [RegExp]): ValidatorFn {

    return (control: AbstractControl): { [key: string]: any } => {

        let name;

        if (control.value) {
            name = control.value.toLowerCase();
        }

        let no;
        for (const existing of nameAr) {
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
 * TODO: add description
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
