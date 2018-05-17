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
     * @returns {Observable<Project[]>}
     */
    getAllProjects(): Observable<Project[]> {
        return this.httpGet('/admin/projects').pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectsResponse).projects),
            catchError(this.handleJsonError)
        );
    }

    /**
     * returns a project object
     *
     * @param {string} iri
     * @returns {Observable<Project>}
     */
    getProjectByIri(iri: string): Observable<Project> {
        const url: string = '/admin/projects/' + encodeURIComponent(iri);
        return this.getProject(url);
    }

    /**
     * returns a project object
     *
     * @param {string} shortname
     * @returns {Observable<Project>}
     */
    getProjectByShortname(shortname: string): Observable<Project> {
        const url = '/admin/projects/' + shortname + '?identifier=shortname';
        return this.getProject(url);
    }

    /**
     * returns a project object
     *
     * @param {string} shortcode
     * @returns {Observable<Project>}
     */
    getProjectByShortcode(shortcode: string): Observable<Project> {
        const url = '/admin/projects/' + shortcode + '?identifier=shortcode';
        return this.getProject(url);
    }

    /**
     * Helper method combining project retrieval
     *
     * @param {string} url
     * @returns {Observable<Project>}
     */
    getProject(url: string): Observable<Project> {
        return this.httpGet(url).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse).project),
            catchError(this.handleJsonError)
        );
    }


}
