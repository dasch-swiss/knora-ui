import { Component, Input } from '@angular/core';
import { ReadGeomValue } from '@knora/api';

@Component({
    selector: 'kui-geometry-value',
    templateUrl: './geometry-value.component.html',
    styleUrls: ['./geometry-value.component.scss']
})
export class GeometryValueComponent {

    @Input()
    set valueObject(value: ReadGeomValue) {
        this._geomValueObj = value;
    }

    get valueObject() {
        return this._geomValueObj;
    }

    private _geomValueObj: ReadGeomValue;

    constructor() { }

}
