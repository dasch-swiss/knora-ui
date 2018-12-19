import { Component, OnInit } from '@angular/core';
import { ApiServiceError, Group, GroupsService } from '@knora/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-groups',
    templateUrl: './groups.component.html',
    styleUrls: ['./groups.component.scss']
})
export class GroupsComponent implements OnInit {

    module = AppDemo.coreModule;

    allGroups: Group[];

    group: Group;

    exampleGetAllGroups: Example = {
        title: 'getAllGroups()',
        subtitle: 'returns a list of all (project specific) groups',
        name: 'getAllGroups',
        code: {
            html: `
<ul>
    <li *ngFor="let g of allGroups">
        <strong>{{g.name}}</strong> ({{g.project.longname}})
        <span>{{g.description}}</span>
    </li>
</ul>`,
            ts: `
allGroups: Group[];

constructor(private _groupsService: GroupsService) { }

ngOnInit() {
    this.groupsService.getAllGroups().subscribe(
        (result: Group[]) => {
            this.allGroups = result;
        },
        (error: ApiServiceError) => {
            console.error(error);
        }
    );
}`,
            scss: ``
        }
    };

    constructor(public groupsService: GroupsService) {
    }

    ngOnInit() {
        // deactivated for docs
        // this.getAllGroups();
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
