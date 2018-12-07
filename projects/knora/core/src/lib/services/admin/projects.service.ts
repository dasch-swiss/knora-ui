import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiServiceResult, Project, ProjectMembersResponse, ProjectResponse, ProjectsResponse, User } from '../../declarations/';

import { ApiService } from '../api.service';

/**
 * Request information about projects from Knora.
 */
@Injectable({
    providedIn: 'root'
})
export class ProjectsService extends ApiService {

    // ------------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------------

    /**
     * Returns a list of all projects.
     *
     * @returns Observable<Project[]>
     */
    getAllProjects(): Observable<Project[]> {
        return this.httpGet('/admin/projects').pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectsResponse).projects),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Returns a project object.
     *
     * @param {string} iri
     * @returns Observable<Project>
     */
    getProjectByIri(iri: string): Observable<Project> {
        const url: string = '/admin/projects/' + encodeURIComponent(iri);
        return this.getProject(url);
    }

    /**
     * Returns a project object.
     *
     * @param {string} shortname
     * @returns Observable<Project>
     */
    getProjectByShortname(shortname: string): Observable<Project> {
        const url = '/admin/projects/' + shortname + '?identifier=shortname';
        return this.getProject(url);
    }

    /**
     * Returns a project object.
     *
     * @param {string} shortcode
     * @returns Observable<Project>
     */
    getProjectByShortcode(shortcode: string): Observable<Project> {
        const url = '/admin/projects/' + shortcode + '?identifier=shortcode';
        return this.getProject(url);
    }

    /**
     * Helper method combining project retrieval.
     *
     * @param {string} url
     * @returns Observable<Project>
     */
    protected getProject(url: string): Observable<Project> {
        return this.httpGet(url).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse).project),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Returns all project members.
     * Project identifier is project id (iri).
     *
     * @param {string} iri
     * @returns Observable<User[]>
     */
    getProjectMembersByIri(iri: string): Observable<User[]> {
        const url = '/admin/projects/members/' + encodeURIComponent(iri);
        return this.getProjectMembers(url);
    }

    /**
     * Returns all project members.
     * Project identifier is shortname.
     *
     * @param {string} shortname
     * @returns Observable<User[]>
     */
    getProjectMembersByShortname(shortname: string): Observable<User[]> {
        const url = '/admin/projects/members/' + shortname + '?identifier=shortname';
        return this.getProjectMembers(url);
    }

    /**
     * Returns all project members.
     * Project identifier is shortcode.
     *
     * @param {string} shortcode
     * @returns Observable<User[]>
     */
    getProjectMembersByShortcode(shortcode: string): Observable<User[]> {
        const url = '/admin/projects/members/' + shortcode + '?identifier=shortcode';
        return this.getProjectMembers(url);
    }

    /**
     * Helper method combining project member retrieval.
     *
     * @param {string} url
     * @returns Observable<User[]>
     */
    protected getProjectMembers(url: string): Observable<User[]> {
        return this.httpGet(url).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectMembersResponse).members),
            catchError(this.handleJsonError)
        );
    }


    // ------------------------------------------------------------------------
    // POST
    // ------------------------------------------------------------------------

    /**
     * Create new project.
     *
     * @param {any} data
     * @returns Observable<Project>
     */
    createProject(data: any): Observable<Project> {
        const url: string = '/admin/projects';
        return this.httpPost(url, data).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse).project),
            catchError(this.handleJsonError)
        );
    }

    // ------------------------------------------------------------------------
    // PUT
    // ------------------------------------------------------------------------

    /**
     * Edit project data.
     *
     * @param {string} iri
     * @param {any} data
     * @returns Observable<Project>
     */
    updateProject(iri: string, data: any): Observable<Project> {
        const url: string = '/admin/projects/' + encodeURIComponent(iri);

        return this.httpPut(url, data).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse).project),
            catchError(this.handleJsonError)
        );
    }


    /**
     * Activate project (if it was deleted).
     *
     * @param {string} iri
     * @returns Observable<Project>
     */
    activateProject(iri: string): Observable<Project> {
        const data: any = {
            status: true
        };

        const url: string = '/admin/projects/' + encodeURIComponent(iri);

        return this.httpPut(url, data).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse).project),
            catchError(this.handleJsonError)
        );
    }


    // ------------------------------------------------------------------------
    // DELETE
    // ------------------------------------------------------------------------

    /**
     * Delete (set inactive) project.
     *
     * @param {string} iri
     * @returns Observable<Project>
     */
    deleteProject(iri: string): Observable<Project> {
        const url: string = '/admin/projects/' + encodeURIComponent(iri);

        return this.httpDelete(url).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse).project),
            catchError(this.handleJsonError)
        );
    }

}
