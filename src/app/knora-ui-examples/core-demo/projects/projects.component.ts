import { Component, OnInit } from '@angular/core';

import { ApiServiceError, Project, ProjectsService, User } from '@knora/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-projects',
    templateUrl: './projects.component.html',
    styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit {

    module = AppDemo.coreModule;

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

    exampleGetAllProjects: Example = {
        title: 'getAllProjects()',
        subtitle: 'returns a list of all projects in Knora',
        name: 'getAllProjects',
        code: {
            html: `
<div *ngIf="allProjects && !projectsService.loading">
    <mat-card-subtitle>Result</mat-card-subtitle>
    <ul>
        <li *ngFor="let p of allProjects">
            ({{p.shortcode}})
            <strong>{{p.shortname}}: </strong>
            {{p.longname}}
        </li>
    </ul>
</div>`,
            ts: `
allProjects: Project[];

// the services from @knora/core should be public,
// if you want to use the loading status in the html template
// --> projectsService.loading = true | false
constructor(public projectsService: ProjectsService) { }


ngOnInit() {
    this.projectsService.getAllProjects().subscribe(
        (result: Project[]) => {
            this.allProjects = result;
        },
        (error: ApiServiceError) => {
            console.error(error);
        }
    )
};`,
            scss: ``
        }
    };

    exampleGetProjectByShortname: Example = {
        title: 'getProjectByShortname(\'incunabula\') and getProjectMembersByIri(this.project.id)',
        subtitle: 'two requests: one returns a project object defined by shortname (e.g. \'incunabula\') ' +
            'and the second returns all members of this project defined by id of project (iri)',
        name: 'getProjectByShortname',
        code: {
            html: `
<div *ngIf="project && !projectsService.loading">
    <mat-card-subtitle>Result</mat-card-subtitle>

    <div *ngIf="project && !projectsService.loading">
        <p class="mat-card-subtitle">Shortcode / Shortname: Longname</p>
        <p><strong>{{project.shortcode}} / {{project.shortname}}: </strong> {{project.longname}}</p>
        <br>
        <div *ngFor="let d of project.description">
            <p class="mat-card-subtitle">Description <span *ngIf="d.language">in {{d.language}}</span></p>
            <div [innerHtml]="d.value"></div>
        </div>
        <br>
        <p class="mat-card-subtitle">Keywords</p>
        <mat-chip-list>
            <mat-chip class="tag" *ngFor="let k of project.keywords">{{k}}</mat-chip>
        </mat-chip-list>
    </div>
    <br><br>
    <p class="mat-card-subtitle">All members of the project</p>
    <div *ngIf="projectMembers && !projectsService.loading">
        <ul>
            <li *ngFor="let u of projectMembers">
                <strong>{{u.familyName}}, </strong>
                {{u.givenName}} ({{u.email}})
            </li>
        </ul>
    </div>
</div>`,
            ts: `
project: Project;
projectMembers: User[];
            
// the services from @knora/core should be public,
// if you want to use the loading status in the html template
// --> projectsService.loading = true | false
constructor(public projectsService: ProjectsService) { }

ngOnInit() {
    this.projectsService.getProjectByShortname('incunabula').subscribe(
        (result: Project) => {
            this.project = result;
            
            // and get the members of the project here
            this.projectsService.getProjectMembersByIri(result.id).subscribe(
                (result: User[]) => {
                    this.projectMembers = result;
                },
                (errorByGettingMembers: ApiServiceError) => {
                    console.error(errorByGettingMembers);
                }
            );
        },
        (errorByGettingProject: ApiServiceError) => {
            console.error(errorByGettingProject);
        }
    );
}`,
            scss: ``
        }
    };

    constructor(public projectsService: ProjectsService) {
    }

    ngOnInit() {
        this.getAllProjects();

        this.getProject('incunabula');
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

    getProject(shortname: string) {
        this.projectsService.getProjectByShortname(shortname)
            .subscribe(
                (result: Project) => {
                    this.project = result;
                    this.getProjectMembers(this.project.id);
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
