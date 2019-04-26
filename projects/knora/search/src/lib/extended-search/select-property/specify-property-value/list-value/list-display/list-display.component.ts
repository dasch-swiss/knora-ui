import { Component, Inject, Input, OnChanges, OnDestroy, OnInit, ViewChild, Output, EventEmitter, QueryList } from '@angular/core';
import { ListNodeV2 } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatMenuTrigger, MatMenu } from '@angular/material';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'list-display',
    templateUrl: './list-display.component.html',
    styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit, OnDestroy {

    @Input() children?: ListNodeV2;

    @Output() selectedNode: EventEmitter<ListNodeV2> = new EventEmitter<ListNodeV2>();

    // parent FormGroup
    // @Input() formGroup?: FormGroup;

    @ViewChild('childMenu') public childMenu: MatMenuTrigger;
    /*

        @ViewChild('matTrigger') public matTrigger: MatMenuTrigger; */

    // private _listNode: ListNodeV2;

    /*     @Input()
        set listNode(value: ListNodeV2) {
            console.log(value)
            this.activeNode = undefined;
            this._listNode = value;
        }

        get listNode() {
            return this._listNode;
        } */

    // form: FormGroup;

    // activeNode;
    // @Inject(FormBuilder) private fb: FormBuilder
    constructor () {
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

    setValue(item: ListNodeV2) {
        this.selectedNode.emit(item);
    }
    /*
        menuClosed(ev: any) {
            console.log('menu closed', ev);
            if (ev) {
                this.matTrigger.closeMenu();
            }

        } */

}
