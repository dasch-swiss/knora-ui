import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, ProjectResponse, ReadProject } from '@knora/api';
import { KnoraApiConnectionToken } from '@knora/core';

@Component({
    selector: 'kui-properties-toolbar',
    templateUrl: './properties-toolbar.component.html',
    styleUrls: ['./properties-toolbar.component.scss']
})
export class PropertiesToolbarComponent implements OnInit {

    @Input() projectiri: string;
    @Input() ontologyiri: string;
    @Input() arkurl: string;

    @Input() showAllProps: boolean;

    @Output() toggleProps: EventEmitter<boolean> = new EventEmitter<boolean>();

    project: ReadProject;

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection
    ) { }

    ngOnInit() {
        // get project information
        this.knoraApiConnection.admin.projectsEndpoint.getProjectByIri(this.projectiri).subscribe(
            (response: ApiResponseData<ProjectResponse>) => {
                this.project = response.body.project;
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        )
    }

}
