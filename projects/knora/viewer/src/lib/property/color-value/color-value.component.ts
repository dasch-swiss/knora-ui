import { Component, Input } from '@angular/core';
import { ReadColorValue } from '@knora/api';

@Component({
    selector: 'kui-color-value',
    templateUrl: './color-value.component.html',
    styleUrls: ['./color-value.component.scss']
})
export class ColorValueComponent {

    @Input()
    set valueObject(value: ReadColorValue) {
        this._colorValueObj = value;
    }

    get valueObject() {
        return this._colorValueObj;
    }

    private _colorValueObj: ReadColorValue;

    constructor() {
    }

}
