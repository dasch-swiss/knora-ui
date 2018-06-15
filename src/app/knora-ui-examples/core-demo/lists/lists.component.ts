import {Component, OnInit} from '@angular/core';
import {ApiServiceError, Group, List, ListsService} from '@knora/core';
import {FlatTreeControl} from '@angular/cdk/tree';

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

    projectIri: string = 'http://rdfh.ch/projects/00FF';

    projectLists: List[];

    treeControl: FlatTreeControl<ListNode>;

    constructor(public listsService: ListsService) {
    }

    ngOnInit() {
        this.getAllLists();
    }


    getAllLists() {
        this.listsService.getLists(this.projectIri)
            .subscribe(
                (result: List[]) => {
                    this.projectLists = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );

    }
}
