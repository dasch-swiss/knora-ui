import { Component, Inject, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { ListNodeV2 } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'list-display',
    templateUrl: './list-display.component.html',
    styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit, OnDestroy {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    private _listNode: ListNodeV2;

    @Input()
    set listNode(value: ListNodeV2) {
        console.log(value)
        this.activeNode = undefined;
        this._listNode = value;
    }

    get listNode() {
        return this._listNode;
    }

    form: FormGroup;

    activeNode;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({
            listValue: [null, Validators.compose([Validators.required])]
        });

        this.form.valueChanges.subscribe(
            (data) => {
                this.activeNode = data.listValue;
            }
        );

        resolvedPromise.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });
    }

    ngOnDestroy() {

        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl('propValue');
        });

    }

}
