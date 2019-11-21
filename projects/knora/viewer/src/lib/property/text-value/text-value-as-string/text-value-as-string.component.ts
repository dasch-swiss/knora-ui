import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ReadTextValueAsString } from '@knora/core';
import { StringElementComponent } from '../../../element';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: 'kui-text-value-as-string',
    templateUrl: './text-value-as-string.component.html',
    styleUrls: ['./text-value-as-string.component.scss']
})
export class TextValueAsStringComponent implements OnInit {

    @ViewChild('textVal', {static: false}) stringValueElement: StringElementComponent;

    regexUrl: RegExp = /(http|https|ftp|ftps)\:\/\/[a-zA-Z0-9\-\.]+\.[a-zA-Z]{2,3}(\/\S*)?/;

    @Input()
    set valueObject(value: ReadTextValueAsString) {
        // console.log(value);

        const str: string = value.str;

        if (this.regexUrl.exec(str)) {
            const url: string = this.regexUrl.exec(str)[0];
            const newStr = str.replace(this.regexUrl, '<a class="kui-link" href="' + url + '">' + url + '</a>');
            value.str = newStr;
            this._textStringValueObj = value;
        } else {
            this._textStringValueObj = value;
        }
    }

    get valueObject() {


        return this._textStringValueObj;
    }

    private _textStringValueObj: ReadTextValueAsString;

    form: FormGroup;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({});
    }

}
