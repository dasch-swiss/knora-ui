import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';

import {catchError, map} from 'rxjs/operators';

import {ApiServiceResult, Project, ProjectResponse, ProjectsResponse} from '../declarations';
import {KuiCoreModule} from '../core.module';

@Injectable({
    providedIn: KuiCoreModule
})
export class ProjectsService extends ApiService {

    /**
     * returns a list of all projects
     *
     * @returns {Observable<ProjectsResponse>}
     * @throws {KuiServiceResult}
     */
    getAllProjects(): Observable<ProjectsResponse> {
        return this.httpGet('/admin/projects').pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectsResponse)),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} iri
     * @returns {Observable<ProjectResponse>}
     */
    getProjectByIri(iri: string): Observable<ProjectResponse> {
        const url: string = '/admin/projects/' + encodeURIComponent(iri);
        return this.httpGet(url).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse)),
            catchError(this.handleJsonError)
        );
    }


}
