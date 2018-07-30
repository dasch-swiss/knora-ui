import { Component, Input, OnInit } from '@angular/core';
import { ReadColorValue } from '@knora/core';

@Component({
    selector: 'kui-color-value',
    templateUrl: './color-value.component.html',
    styleUrls: ['./color-value.component.scss']
})
export class ColorValueComponent implements OnInit {

    @Input() valueObject: ReadColorValue;

    constructor() {
    }

    ngOnInit() {
        console.log(this.valueObject);
    }

}
