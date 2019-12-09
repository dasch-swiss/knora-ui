import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ReadLinkValue } from '@knora/api';

@Component({
    selector: 'kui-link-value',
    templateUrl: './link-value.component.html',
    styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent {

    @Input()
    set valueObject(value: ReadLinkValue) {
        this._linkValueObj = value;

        if (this.valueObject.linkedResource !== undefined) {
            this.referredResource = this.valueObject.linkedResource.label;
        } else {
            this.referredResource = this.valueObject.linkedResourceIri;
        }
    }

    get valueObject() {
        return this._linkValueObj;
    }

    @Output()
    referredResourceClicked: EventEmitter<ReadLinkValue> = new EventEmitter();

    private _linkValueObj: ReadLinkValue;
    referredResource: string;

    constructor() { }

    refResClicked() {
        this.referredResourceClicked.emit(this._linkValueObj);
    }
}
