import { Component, Input } from '@angular/core';
import { ReadTextValueAsXml } from '@knora/core';

@Component({
    selector: 'kui-text-value-as-xml',
    templateUrl: './text-value-as-xml.component.html',
    styleUrls: ['./text-value-as-xml.component.scss']
})
export class TextValueAsXmlComponent {

    @Input()
    set valueObject(value: ReadTextValueAsXml) {
        this._xmlValueObj = value;
    }

    get valueObject() {
        return this._xmlValueObj;
    }

    private _xmlValueObj: ReadTextValueAsXml;

    constructor() {
    }

}
