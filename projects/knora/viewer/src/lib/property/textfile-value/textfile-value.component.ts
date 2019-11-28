import { Component, Input } from '@angular/core';
import { ReadFileValue } from '@knora/api';

@Component({
    selector: 'kui-textfile-value',
    templateUrl: './textfile-value.component.html',
    styleUrls: ['./textfile-value.component.scss']
})
export class TextfileValueComponent {

    @Input()
    set valueObject(value: ReadFileValue) {
        this._textfileValueObj = value;
    }

    get valueObject() {
        return this._textfileValueObj;
    }

    private _textfileValueObj: ReadFileValue;

    constructor() { }

}
