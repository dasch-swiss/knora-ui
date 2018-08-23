import { Component, Input, OnInit } from '@angular/core';
import { ReadIntegerValue } from '@knora/core';

@Component({
    selector: 'kui-integer-value',
    templateUrl: './integer-value.component.html',
    styleUrls: ['./integer-value.component.scss']
})
export class IntegerValueComponent implements OnInit {

    errorMessage: any;
    @Input() valueObject: ReadIntegerValue;

    constructor() {
    }

    ngOnInit() {
    }

}
