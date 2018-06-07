import { Component, OnInit } from '@angular/core';
import {ApiServiceError, ProjectsService, Project} from '@knora/core';

@Component({
  selector: 'kui-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  project: Project;

  constructor(
    private _projectsService: ProjectsService) { }

  ngOnInit() {
    this.getProjectByShortname('incunabula');
  }

  getProjectByShortname(shortname: string) {
    this._projectsService.getProjectByShortname(shortname)
        .subscribe((result: Project) => {
            this.project = result;
        },
        (error: ApiServiceError) => {
            console.error(error);
        }
    );
}

}
