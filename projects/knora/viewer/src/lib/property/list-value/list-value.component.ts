import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { ReadListValue } from '@knora/core';
import { ListCacheService, ListNodeV2 } from '@knora/core';
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

    node: Observable<ListNodeV2>;

    constructor(private _listCacheService: ListCacheService) {
    }

    ngOnChanges() {
        // given the node's Iri, ask the list cache service
        this.node = this._listCacheService.getListNode(this._listValueObj.listNodeIri);

    }

}
