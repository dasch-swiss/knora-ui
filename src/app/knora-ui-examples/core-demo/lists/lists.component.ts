import {Component, OnInit} from '@angular/core';
import {ApiServiceError, Group, List, ListsService} from '@knora/core';

@Component({
    selector: 'app-lists',
    templateUrl: './lists.component.html',
    styleUrls: ['./lists.component.scss']
})
export class ListsComponent implements OnInit {

    projectIri: string = 'http://rdfh.ch/projects/00FF';

    projectLists: List[];

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
