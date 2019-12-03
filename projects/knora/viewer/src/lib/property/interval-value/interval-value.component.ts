import { Component, Input } from '@angular/core';
import { ReadIntervalValue } from '@knora/api';

@Component({
    selector: 'kui-interval-value',
    templateUrl: './interval-value.component.html',
    styleUrls: ['./interval-value.component.scss']
})
export class IntervalValueComponent {

    @Input()
    set valueObject(value: ReadIntervalValue) {
        this._intervalValueObj = value;
    }

    get valueObject() {
        return this._intervalValueObj;
    }

    private _intervalValueObj: ReadIntervalValue;

    constructor() { }

}
