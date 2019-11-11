import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { ReadIntegerValue } from '@knora/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { IntElementComponent } from '../../element/int-element/int-element.component';

@Component({
    selector: 'kui-integer-value',
    templateUrl: './integer-value.component.html',
    styleUrls: ['./integer-value.component.scss']
})
export class IntegerValueComponent implements OnInit {

    @ViewChild('integerVal', {static: false}) integerValueElement: IntElementComponent;

    @Input()
    set valueObject(value: ReadIntegerValue) {
        this._integerValueObj = value;
    }

    get valueObject() {
        return this._integerValueObj;
    }

    form: FormGroup;

    private _integerValueObj: ReadIntegerValue;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({});
    }

}
