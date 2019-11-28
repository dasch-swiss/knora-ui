import { Component, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ReadUriValue } from '@knora/core';
import { UriElementComponent } from '../../element';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
    selector: '   kui-uri-value',
    templateUrl: './uri-value.component.html',
    styleUrls: ['./uri-value.component.scss']
})
export class UriValueComponent implements OnInit {

    @ViewChild('uriVal', {static: false}) uriValueElement: UriElementComponent;

    @Input()
    set valueObject(value: ReadUriValue) {
        this.__uriValueObj = value;

    }
    get valueObject() {
        return this.__uriValueObj;
    }
    @Input() label?: string;
    private __uriValueObj: ReadUriValue;

    form: FormGroup;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.form = this.fb.group({});
    }

}
