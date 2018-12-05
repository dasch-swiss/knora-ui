import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { ApiServiceError, List, ListNodeInfo, ListsService } from '@knora/core';
import { AppDemo } from '../../../app.config';

class ListNode {
    label: string;
    children: ListNode[];
    type: any;
}

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

    module = AppDemo.coreModule;

    projectIri: string = 'http://rdfh.ch/projects/00FF';

    projectLists: ListNodeInfo[];

    treeControl: FlatTreeControl<ListNode>;

    constructor(public listsService: ListsService) {
    }

    ngOnInit() {
        this.getAllLists();
    }


    getAllLists() {
        this.listsService.getLists(this.projectIri)
            .subscribe(
                (result: ListNodeInfo[]) => {
                    this.projectLists = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );

    }
}
