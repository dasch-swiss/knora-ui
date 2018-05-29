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

    projectSimData: any = {
        shortcode: '0010',
        shortname: 'test',
        longname: 'Test Project',
        description: [{
            'language': 'en',
            'value': 'Knora-ui module: test project to create this new project'
        }],
        keywords: [],
        status: true,
        selfjoin: false
    };

    projectMembers: User[];

    tsExampleGetAllProjects = `
    constructor(public projectsService: ProjectsService) { }
    (...)
    this.projectsService.getAllProjects()
        .subscribe(
            (result: Project[]) => {
                this.allProjects = result;
            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );`;

    tsExampleGetProjectByIri = `
    this.projectsService.getProjectByIri(iri)
        .subscribe(
            (result: Project) => {
                this.project = result;
                this.getProjectMembers(iri);
            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );`;

    tsExampleGetProjectMembersByIri = `
    this.projectsService.getProjectMembersByIri(iri)
        .subscribe(
            (result: User[]) => {
                this.projectMembers = result;
            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );`;



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

    createNewProject(data: any) {
        this.projectsService.createProject(data)
            .subscribe(
                (result: Project) => {
                    console.log('createNewProject (result): ', result);
                },
                (error: ApiServiceError) => {
                    console.error('createNewProject (error): ', error);
                }
            );
    }

}
