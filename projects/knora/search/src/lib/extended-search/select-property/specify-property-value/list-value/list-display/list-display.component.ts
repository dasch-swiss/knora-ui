import { Component, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { ListNodeV2 } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'list-display',
    templateUrl: './list-display.component.html',
    styleUrls: ['./list-display.component.scss']
})
export class ListDisplayComponent implements OnInit {

    @Input() list: ListNodeV2[];

    form: FormGroup;

    constructor() {
    }

    ngOnInit() {

    }

}
