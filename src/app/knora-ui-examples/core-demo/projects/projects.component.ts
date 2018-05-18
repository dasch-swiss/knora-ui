import {Component, OnInit} from '@angular/core';

import {ApiServiceError, Project, ProjectsService, User} from '@knora/core';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    allProjects: Project[];

    project: Project;

    projectMembers: User[];

    tsExampleGetAllProjects = `getAllProjects() {
        this.projectsService.getAllProjects()
            .subscribe(
                (result: Project[]) => {
                    this.allProjects = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }`;

    content = '<p>test {{language}}</p>';
    hooks = {
        'before-sanity-check': (env) => { console.log(`before-sanity-check`, env); },
        'before-highlight': (env) => { console.log(`before-highlight`, env); },
        'after-highlight': (env) => { console.log(`after-highlight`, env); },
        'complete': (env) => { console.log(`complete`, env); },
        'before-insert': (env) => { console.log(`before-insert`, env); }
    };
    interpolate = {
        language: 'language interpolated'
    };
    language = 'html';



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
