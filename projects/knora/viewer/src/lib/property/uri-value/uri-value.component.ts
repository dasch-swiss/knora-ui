import { Component, Input, OnChanges } from '@angular/core';
import { ReadUriValue } from '@knora/core';

@Component({
    selector: '   kui-uri-value',
    templateUrl: './uri-value.component.html',
    styleUrls: ['./uri-value.component.scss']
})
export class UriValueComponent implements OnChanges {

    @Input()
    set valueObject(value: ReadUriValue) {
        this.__uriValueObj = value;

    }
    get valueObject() {
        return this.__uriValueObj;
    }
    @Input() label?: string;
    private __uriValueObj: ReadUriValue;
    public displayString: string;
    constructor () { }

    ngOnChanges() {
        if (this.label === undefined) {
            this.displayString = this.__uriValueObj.uri;
        } else {
            this.displayString = this.label;
        }
    }

}
