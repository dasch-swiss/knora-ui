import { Component, Inject, Input } from '@angular/core';
import { OntologyInformation, ReadLinkValue } from '@knora/core';

@Component({
    selector: 'kui-link-value',
    templateUrl: './link-value.component.html',
    styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent {

    @Input()
    ontologyInfo?: OntologyInformation;

    @Input()
    set valueObject(value: ReadLinkValue) {
        this._linkValueObj = value;
    }

    get valueObject() {
        return this._linkValueObj;
    }

    private _linkValueObj: ReadLinkValue;

    constructor() { }

}
