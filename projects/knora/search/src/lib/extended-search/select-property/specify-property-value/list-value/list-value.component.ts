import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnoraConstants, ListNodeV2, ListService, Property, PropertyValue, Value, ValueLiteral } from '@knora/core';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'list-value',
    templateUrl: './list-value.component.html',
    styleUrls: ['./list-value.component.scss']
})
export class ListValueComponent implements OnInit, OnDestroy, PropertyValue {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = KnoraConstants.ListValue;

    form: FormGroup;

    @Input() property: Property;

    listRootNode: ListNodeV2;

    activeNode;

    constructor(@Inject(FormBuilder) private fb: FormBuilder, private _listService: ListService) {
    }

    private getRootNodeIri(): string {
        const guiAttr = this.property.guiAttribute;

        if (guiAttr.length === 1 && guiAttr[0].startsWith('hlist=')) {
            const listNodeIri = guiAttr[0].substr(7, guiAttr[0].length - (1 + 7)); // hlist=<>, get also rid of <>
            return listNodeIri;
        } else {
            console.log('No root node Oro given for property');
        }
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

        // get list's root node Iri
        const rootNodeIri = this.getRootNodeIri();

        this._listService.getList(rootNodeIri).subscribe(
            (list: ListNodeV2) => {
                this.listRootNode = list;
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

    getValue(): Value {

        return new ValueLiteral(String(this.form.value.listValue), KnoraConstants.xsdString);
    }

}
