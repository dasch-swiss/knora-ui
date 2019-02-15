import { Component, OnInit } from '@angular/core';
import { ListService } from '@knora/core';
import { ListNodeV2 } from '../../../../projects/knora/core/src/lib/services';

@Component({
    selector: 'app-list-pg',
    templateUrl: './list-pg.component.html',
    styleUrls: ['./list-pg.component.scss']
})
export class ListPgComponent implements OnInit {

    constructor(private _listService: ListService) {
    }

    private listRootNodeIri = 'http://rdfh.ch/lists/0801/subject_index';

    private listNode = 'http://rdfh.ch/lists/0801/complex_numbers';

    node;

    list;

    ngOnInit() {

    }

    getList() {
        this.list = {
            label: 'loading'
        };

        setTimeout(() => {
            this._listService.getList(this.listRootNodeIri).subscribe(
                (list: ListNodeV2) => {
                    this.list = list;
                }
            );
        }, 1000);


    }

    getListNode() {
        this.node = {
            label: 'loading'
        };

        setTimeout(() => {
            this._listService.getListNode(this.listNode).subscribe(
                (node: ListNodeV2) => {
                    this.node = node;
                }
            );
        }, 1000);
    }

}
