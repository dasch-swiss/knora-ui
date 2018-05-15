import {Component, OnInit} from '@angular/core';
import {AppDemo} from '../../app.config';

import {ApiServiceError, Project, ProjectsResponse, ProjectsService} from '@knora/core';

@Component({
    selector: 'app-core-demo',
    templateUrl: './core-demo.component.html',
    styleUrls: ['./core-demo.component.scss']
})
export class CoreDemoComponent implements OnInit {

    module = AppDemo.coreModule;

    allProjects: Project[];

    projectIri = 'http://rdfh.ch/projects/00FF';   // images project

    project: Project;

    constructor(public projectsService: ProjectsService) {
    }

    ngOnInit() {
        this.getAllProjects();
    }

    getAllProjects() {
        this.projectsService.getAllProjects()
            .subscribe(
                (result: ProjectsResponse) => {
                    this.allProjects = result.projects;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
        /*
        this._projectsService.getProjectByIri(this.projectIri)
          .subscribe(
            (result: Project) => {
              this.project = result;
              console.log(this.project);
              this.isLoading = false;
            },
            (error: ApiServiceError) => {
              console.log(error);
            }

          );
          */

    }

    getProject(iri: string) {
        this.projectsService.getProjectByIri(iri)
            .subscribe(
                (result: Project) => {
                    console.log(result);
                    this.project = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

}
