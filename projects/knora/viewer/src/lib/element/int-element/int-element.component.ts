import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { BaseElementComponent } from '../base-element/base-element.component';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'kui-int-element',
    templateUrl: './int-element.component.html',
    styleUrls: ['./int-element.component.scss']
})
export class IntElementComponent extends BaseElementComponent<number> implements OnInit, OnChanges, OnDestroy {

    // only allow for integer values (no fractions)
    validators = [Validators.required, Validators.pattern(/^-?\d+$/)];

    form: FormGroup;

    ngOnInit() {

        this.form = this.fb.group({
            integer: [this._eleVal, Validators.compose(this.validators)]
        });

        this.form.valueChanges.subscribe((data) => {

            if (data.integer !== undefined) {
                const num: number = Number(data.integer);
                this.eleVal = num;
            }
        });

        // add to form group
        resolvedPromise.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });

    }

    ngOnChanges(changes: SimpleChanges): void {

        if (this.form !== undefined && changes['eleVal'] !== undefined) {
            this.form.setValue({
                integer: this.eleVal
            });
        }
    }


    ngOnDestroy() {

        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl('propValue');
        });

    }

}
