import { Component, Inject, Input, OnChanges } from '@angular/core';
import { KnoraApiConnection, ListNode } from '@knora/api';
import { KnoraApiConnectionToken, ReadListValue } from '@knora/core';
import { Observable } from 'rxjs';

@Component({
    selector: 'kui-list-value',
    templateUrl: './list-value.component.html',
    styleUrls: ['./list-value.component.scss']
})
export class ListValueComponent implements OnChanges {

    @Input()
    set valueObject(value: ReadListValue) {
        this._listValueObj = value;
    }

    get valueObject() {
        return this._listValueObj;
    }

    private _listValueObj: ReadListValue;

    node: Observable<ListNode>;

    constructor (
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection
        ) {
    }

    ngOnChanges() {
        // given the node's Iri, ask the list cache service
        this.node = this.knoraApiConnection.v2.listNodeCache.getNode(this._listValueObj.listNodeIri);

    }

}
