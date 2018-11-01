import { Component, Input } from '@angular/core';
import { ReadIntegerValue } from '@knora/core';

@Component({
    selector: 'kui-integer-value',
    templateUrl: './integer-value.component.html',
    styleUrls: ['./integer-value.component.scss']
})
export class IntegerValueComponent {

    @Input()
    set valueObject(value: ReadIntegerValue) {
        this._integerValueObj = value;
    }

    get valueObject() {
        return this._integerValueObj;
    }

    private _integerValueObj: ReadIntegerValue;

    constructor() {
    }

}
