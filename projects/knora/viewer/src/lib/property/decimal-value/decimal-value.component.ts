import { Component, Input } from '@angular/core';
import { ReadDecimalValue } from '@knora/api';

@Component({
    selector: 'kui-decimal-value',
    templateUrl: './decimal-value.component.html',
    styleUrls: ['./decimal-value.component.scss']
})
export class DecimalValueComponent {

    @Input()
    set valueObject(value: ReadDecimalValue) {
        this._decimalValueObj = value;
    }

    get valueObject() {
        return this._decimalValueObj;
    }

    private _decimalValueObj: ReadDecimalValue;

    constructor() { }

}
