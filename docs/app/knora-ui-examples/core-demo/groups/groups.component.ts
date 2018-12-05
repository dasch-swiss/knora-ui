import { Component, OnInit } from '@angular/core';
import { ApiServiceError, Group, GroupsService } from '@knora/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

    module = AppDemo.coreModule;

    allGroups: Group[];

    group: Group;

    constructor(public groupsService: GroupsService) {
    }

    ngOnInit() {
        this.getAllGroups();
    }

    getAllGroups() {
        this.groupsService.getAllGroups()
            .subscribe(
                (result: Group[]) => {
                    this.allGroups = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

    getGroupByIri(iri: string) {
        this.groupsService.getGroupByIri(iri)
            .subscribe(
                (result: Group) => {
                    this.group = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

}
