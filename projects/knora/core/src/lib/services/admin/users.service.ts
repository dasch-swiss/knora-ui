import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiService } from '../api.service';
import {
    ApiServiceResult,
    User,
    UserResponse,
    UsersResponse
} from '../../declarations/';

@Injectable({
    providedIn: 'root'
})
export class UsersService extends ApiService {

    url: string = this.config.api + '/admin/users';


    // ------------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------------

    /**
     * returns a list of all users
     *
     * @returns {Observable<User[]>}
     */
    getAllUsers(): Observable<User[]> {
        return this.httpGet('/admin/users').pipe(
            map((result: ApiServiceResult) => result.getBody(UsersResponse).users),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} email
     * @returns {Observable<User>}
     */
    getUserByEmail(email: string): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(email) + '?identifier=email';
        return this.getUser(path);
    }

    /**
     *
     * @param {string} iri
     * @returns {Observable<User>}
     */
    getUserByIri(iri: string): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(iri);
        return this.getUser(path);
    }

    /**
     * Helper method combining user retrieval
     *
     * @param {string} path
     * @returns {Observable<User>}
     */
    protected getUser(path: string): Observable<User> {
        return this.httpGet(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }


    // ------------------------------------------------------------------------
    // POST
    // ------------------------------------------------------------------------

    /**
     *
     * @param data
     * @returns {Observable<User>}
     */
    createUser(data: any): Observable<User> {
        const path = '/admin/users';
        return this.httpPost(path, data).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns {Observable<User>}
     */
    addUserToProject(userIri: string, projectIri: string): Observable<User> {
        const path = '/admin/users/projects/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpPost(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns {Observable<User>}
     */
    addUserToProjectAdmin(userIri: string, projectIri: string): Observable<User> {
        const path = '/admin/users/projects-admin/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpPost(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns {Observable<User>}
     */
    removeUserFromProjectAdmin(userIri: string, projectIri: string): Observable<User> {
        const path = '/admin/users/projects-admin/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpDelete(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }


    // ------------------------------------------------------------------------
    // PUT
    // ------------------------------------------------------------------------


    /**
     *
     * @param {string} userIri
     * @param data
     * @returns {Observable<User>}
     */
    addUserToSystemAdmin(userIri: string, data: any): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(userIri);
        return this.httpPut(path, data).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} userIri
     * @returns {Observable<User>}
     */
    activateUser(userIri: string): Observable<User> {
        const data: any = {
            status: true
        };
        return this.updateUser(userIri, data);
    }


    /**
     * Update own password
     *
     * @param {string} userIri
     * @param {string} oldPassword
     * @param {string} newPassword
     * @returns {Observable<User>}
     */
    updateOwnPassword(userIri: string, oldPassword: string, newPassword: string): Observable<User> {
        const data = {
            newPassword: newPassword,
            requesterPassword: oldPassword
        };
        return this.updateUser(userIri, data);
    }


    updateUsersPassword(userIri: string, requesterPassword: string, newPassword: string): Observable<User> {
        const data = {
            newPassword: newPassword,
            requesterPassword: requesterPassword
        };
        return this.updateUser(userIri, data);
    }


    /**
     *
     * @param {string} userIri
     * @param data
     * @returns {Observable<User>}
     */
    updateUser(userIri: string, data: any): Observable<User> {

        const path = '/admin/users/' + encodeURIComponent(userIri);

        return this.httpPut(path, data).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    // ------------------------------------------------------------------------
    // DELETE
    // ------------------------------------------------------------------------

    /**
     *
     * @param {string} userIri
     * @returns {Observable<User>}
     */
    deleteUser(userIri: string): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(userIri);
        return this.httpDelete(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );

    }

    /**
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns {Observable<User>}
     */
    removeUserFromProject(userIri: string, projectIri: string): Observable<User> {
        const path = '/admin/users/projects/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpDelete(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }
}
