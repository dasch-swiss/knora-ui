import {Component, OnInit} from '@angular/core';
import {AppDemo} from '../../app.config';
import {ApiServiceError, Project, ProjectsResponse, ProjectsService} from '@knora/core';

// import {ApiServiceError, Project, ProjectsResponse, ProjectsService} from '@knora/core';

@Component({
    selector: 'app-core-demo',
    templateUrl: './core-demo.component.html',
    styleUrls: ['./core-demo.component.scss'],
    providers: [ProjectsService]
})
export class CoreDemoComponent implements OnInit {

    module = AppDemo.coreModule;

    allProjects: Project[];

    projectIri = 'http://rdfh.ch/projects/00FF';   // images project

    // project: Project;

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
                    console.log(this.allProjects);
                    //this.isLoading = false;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                    //this.isLoading = false;
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

}
