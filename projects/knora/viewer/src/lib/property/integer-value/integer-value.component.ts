import { Component, Input } from '@angular/core';
import { ReadIntValue } from '@knora/api';

@Component({
    selector: 'kui-integer-value',
    templateUrl: './integer-value.component.html',
    styleUrls: ['./integer-value.component.scss']
})
export class IntegerValueComponent {

    @Input()
    set valueObject(value: ReadIntValue) {
        this._integerValueObj = value;
    }

    get valueObject() {
        return this._integerValueObj;
    }

    private _integerValueObj: ReadIntValue;

    constructor() {
    }

}
