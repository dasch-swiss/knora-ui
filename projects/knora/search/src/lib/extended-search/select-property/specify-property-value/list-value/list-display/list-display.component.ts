import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, ViewChild, Output, EventEmitter, QueryList } from '@angular/core';
import { ListNodeV2 } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'list-display',
    templateUrl: './list-display.component.html',
    styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit, OnDestroy {

    @Output() selectedNode: EventEmitter<any> = new EventEmitter<any>();

    // parent FormGroup
    @Input() formGroup?: FormGroup;

    @Input() children?: ListNodeV2;

    @ViewChild('childMenu') public childMenu;

    @ViewChild('matTrigger') public matTrigger: MatMenuTrigger;

    private _listNode: ListNodeV2;

    /*     @Input()
        set listNode(value: ListNodeV2) {
            console.log(value)
            this.activeNode = undefined;
            this._listNode = value;
        }
    
        get listNode() {
            return this._listNode;
        } */

    form: FormGroup;

    activeNode;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        /* this.form = this.fb.group({
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
        }); */
    }

    ngOnDestroy() {

        // remove form from the parent form group
        /*  resolvedPromise.then(() => {
             this.formGroup.removeControl('propValue');
         }); */

    }

    setValue(id: string) {
        console.log('id of the value', id);
        this.selectedNode.emit(id);
    }

}
