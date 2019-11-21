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

    @Input()
    set valueObject(value: ReadTextValueAsString) {
        this._textStringValueObj = value;
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
