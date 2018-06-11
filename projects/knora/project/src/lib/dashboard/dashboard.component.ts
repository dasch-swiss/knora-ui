import { Component, OnInit } from '@angular/core';
import {ApiServiceError, ProjectsService, Project, User} from '@knora/core';

@Component({
  selector: 'kui-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  project: Project;
  allProjects: Project[] = [];
  projectMembers: User[] = [];

  constructor(
    private _projectsService: ProjectsService) { }

  ngOnInit() {
    this.getProjectByShortname('incunabula');
    this.getProjects();
    this.getProjectMembersByShortname('incunabula');
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

  getProjects() {
    this._projectsService.getAllProjects()
      .subscribe((result: Project[]) => {
        this.allProjects = result;
      },
      (error: ApiServiceError) => {
        console.error(error);
      }
    );
  }

  getProjectMembersByShortname(shortname: string) {
    this._projectsService.getProjectMembersByShortname(shortname)
      .subscribe((result: User[]) => {
        this.projectMembers = result;
      },
      (error: ApiServiceError) => {
        console.error(error);
      }
    );
  }

}
