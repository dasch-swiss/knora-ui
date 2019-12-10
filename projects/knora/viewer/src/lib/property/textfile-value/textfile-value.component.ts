import { Component, Input } from '@angular/core';
import { ReadFileValue } from '@knora/api';

// TEMP CLASS DEFINITION BECAUSE MISSING IN KNORA/API LIB
// TODO: this class must be replaced with the new definition from the lib
export class ReadTextFileValue extends ReadFileValue { }

@Component({
    selector: 'kui-textfile-value',
    templateUrl: './textfile-value.component.html',
    styleUrls: ['./textfile-value.component.scss']
})
export class TextfileValueComponent {

    @Input()
    set valueObject(value: ReadTextFileValue) {
        this._textfileValueObj = value;
    }

    get valueObject() {
        return this._textfileValueObj;
    }

    private _textfileValueObj: ReadTextFileValue;

    constructor() { }

}
