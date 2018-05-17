import {Component, OnInit} from '@angular/core';
import {AppDemo} from '../../app.config';

import {ApiServiceError, Project, ProjectsService, User} from '@knora/core';

@Component({
    selector: 'app-core-demo',
    templateUrl: './core-demo.component.html',
    styleUrls: ['./core-demo.component.scss']
})
export class CoreDemoComponent implements OnInit {

    module = AppDemo.coreModule;

    allProjects: Project[];

    project: Project;

    projectMembers: User[];

    constructor(public projectsService: ProjectsService) {
    }

    ngOnInit() {
        this.getAllProjects();
    }

    getAllProjects() {
        this.projectsService.getAllProjects()
            .subscribe(
                (result: Project[]) => {
                    this.allProjects = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

    getProject(iri: string) {
        this.projectsService.getProjectByIri(iri)
            .subscribe(
                (result: Project) => {
                    this.project = result;
                    this.getProjectMembers(iri);
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

    getProjectMembers(iri: string) {
        this.projectsService.getProjectMembersByIri(iri)
            .subscribe(
                (result: User[]) => {
                    this.projectMembers = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

}
