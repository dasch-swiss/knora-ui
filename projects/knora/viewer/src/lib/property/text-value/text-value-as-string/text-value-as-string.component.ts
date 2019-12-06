import { Component, Input } from '@angular/core';
import { ReadTextValueAsString } from '@knora/api';

@Component({
    selector: 'kui-text-value-as-string',
    templateUrl: './text-value-as-string.component.html',
    styleUrls: ['./text-value-as-string.component.scss']
})
export class TextValueAsStringComponent {

    regexUrl: RegExp = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;

    @Input()
    set valueObject(value: ReadTextValueAsString) {
        // console.log(value);

        const str: string = value.strval;

        if (this.regexUrl.exec(str)) {
            const url: string = this.regexUrl.exec(str)[0];
            const newStr = str.replace(this.regexUrl, '<a class="kui-link" href="' + url + '">' + url + '</a>');
            value.strval = newStr;
            this._textStringValueObj = value;
        } else {
            this._textStringValueObj = value;
        }
    }

    get valueObject() {


        return this._textStringValueObj;
    }

    private _textStringValueObj: ReadTextValueAsString;

    constructor() {
    }

}
