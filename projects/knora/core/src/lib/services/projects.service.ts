import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';

import {catchError, map} from 'rxjs/operators';

import {ApiServiceError, ApiServiceResult, Project, ProjectsResponse} from '../declarations';
import {KnoraCoreModule} from '../core.module';

@Injectable({
    providedIn: KnoraCoreModule
})
export class ProjectsService extends ApiService {

    /**
     * returns a list of all projects
     *
     * @returns {Observable<ProjectsResponse>}
     * @throws {ApiServiceError}
     */
    getAllProjects(): Observable<ProjectsResponse> {
        return this.httpGet('/admin/projects').pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectsResponse)),
            catchError(this.handleJsonError)
        );
    }

    getProjectByIri(iri: string): Observable<Project> {
        const url: string = '/admin/projects/' + encodeURIComponent(iri);
        return this.httpGet(url).pipe(
            map((result: ApiServiceResult) => result.getBody(Project)),
            catchError(this.handleJsonError)
        );
    }


}
