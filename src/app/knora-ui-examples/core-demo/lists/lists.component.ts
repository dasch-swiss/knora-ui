import { FlatTreeControl } from '@angular/cdk/tree';
import { Component, OnInit } from '@angular/core';
import { ApiServiceError, List, ListNodeInfo, ListsService } from '@knora/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

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

    exampleGetLists: Example = {
        title: 'getAllLists()',
        subtitle: 'returns a list of all lists',
        name: 'getAllLists',
        code: {
            html: `
<div *ngFor="let item of projectLists">
    <p>{{item.labels[0].value}}</p>
    <p *ngIf="item.comments.length > 0">{{item.comments[0].value}}</p>
</div>`,
            ts: `
projectIri: string;

projectLists: ListNodeInfo[];

constructor(public _listsService: ListsService) {}

ngOnInit() {
    this._listsService.getLists(this.projectIri)
        .subscribe(
            (result: ListNodeInfo[]) => {
                this.projectLists = result;
            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );

}`,
            scss: ``
        }
    };

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
