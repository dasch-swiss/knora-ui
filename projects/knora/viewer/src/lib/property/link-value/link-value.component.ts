import { Component, EventEmitter, Input, Output } from '@angular/core';
import { OntologyInformation } from '@knora/core';
import { ReadLinkValue } from '@knora/core';

@Component({
    selector: 'kui-link-value',
    templateUrl: './link-value.component.html',
    styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent {

    @Input()
    set ontologyInfo(value: OntologyInformation) {
        this._ontoInfo = value;
    }

    get ontologyInfo() {
        return this._ontoInfo;
    }

    @Input()
    set valueObject(value: ReadLinkValue) {
        this._linkValueObj = value;

        if (this.valueObject.referredResource !== undefined) {
            this.referredResource = this.valueObject.referredResource.label;
        } else {
            this.referredResource = this.valueObject.referredResourceIri;
        }
    }

    get valueObject() {
        return this._linkValueObj;
    }

    @Output()
    referredResourceClicked: EventEmitter<ReadLinkValue> = new EventEmitter();

    private _linkValueObj: ReadLinkValue;
    private _ontoInfo: OntologyInformation;
    referredResource: string;

    constructor() { }

    refResClicked() {
        this.referredResourceClicked.emit(this._linkValueObj);
    }
}
