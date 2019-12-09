import { Component, Input } from '@angular/core';
import { ReadListValue } from '@knora/api';

@Component({
    selector: 'kui-list-value',
    templateUrl: './list-value.component.html',
    styleUrls: ['./list-value.component.scss']
})
export class ListValueComponent {

    @Input()
    set valueObject(value: ReadListValue) {
        this._listValueObj = value;
    }

    get valueObject() {
        return this._listValueObj;
    }

    private _listValueObj: ReadListValue;

    constructor() { }

}
