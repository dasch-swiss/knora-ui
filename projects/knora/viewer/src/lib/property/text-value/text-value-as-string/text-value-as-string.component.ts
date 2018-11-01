import { Component, Input } from '@angular/core';
import { ReadTextValueAsString } from '@knora/core';

@Component({
    selector: 'kui-text-value-as-string',
    templateUrl: './text-value-as-string.component.html',
    styleUrls: ['./text-value-as-string.component.scss']
})
export class TextValueAsStringComponent {

    @Input()
    set valueObject(value: ReadTextValueAsString) {
        this._textStringValueObj = value;
    }

    get valueObject() {
        return this._textStringValueObj;
    }

    private _textStringValueObj: ReadTextValueAsString;

    constructor() {
    }

}
