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

    usersUrl: string = this.config.api + '/admin/users';


    // ------------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------------

    /**
     * returns a list of all users
     *
     * @returns Observable of User[]
     */
    getAllUsers(): Observable<User[]> {
        return this.httpGet('/admin/users').pipe(
            map((result: ApiServiceResult) => result.getBody(UsersResponse).users),
            catchError(this.handleJsonError)
        );
    }

    /**
     * return an user object filtered by email
     *
     * @param {string} email
     * @returns Observable of User
     */
    getUserByEmail(email: string): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(email) + '?identifier=email';
        return this.getUser(path);
    }

    /**
     * return an user object filtered by iri
     *
     * @param {string} iri
     * @returns Observable of User
     */
    getUserByIri(iri: string): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(iri);
        return this.getUser(path);
    }

    /**
     * return an user object
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
     * Add a new user.
     *
     * @param {any} data
     * @returns Observable of User
     */
    createUser(data: any): Observable<User> {
        const path = '/admin/users';
        return this.httpPost(path, data).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Add an user to a project.
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns Observable of User
     */
    addUserToProject(userIri: string, projectIri: string): Observable<User> {
        const path = '/admin/users/projects/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpPost(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Add an user to an admin project.
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns Observable of User
     */
    addUserToProjectAdmin(userIri: string, projectIri: string): Observable<User> {
        const path = '/admin/users/projects-admin/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpPost(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Delete an user of an admin project.
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns Observable of User
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
     * Add an user to the admin system
     *
     * @param {string} userIri
     * @param {any} data
     * @returns Observable of User
     */
    addUserToSystemAdmin(userIri: string, data: any): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(userIri);
        return this.httpPut(path, data).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Active an user.
     *
     * @param {string} userIri
     * @returns Observable of User
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
     * @returns Observable of User
     */
    updateOwnPassword(userIri: string, oldPassword: string, newPassword: string): Observable<User> {
        const data = {
            newPassword: newPassword,
            requesterPassword: oldPassword
        };
        return this.updateUser(userIri, data);
    }

    /**
     * Update users password.
     *
     * @param {string} userIri
     * @param {string} requesterPassword
     * @param {string} newPassword
     * @returns Observable of User
     */
    updateUsersPassword(userIri: string, requesterPassword: string, newPassword: string): Observable<User> {
        const data = {
            newPassword: newPassword,
            requesterPassword: requesterPassword
        };
        return this.updateUser(userIri, data);
    }


    /**
     * Update user.
     *
     * @param {string} userIri
     * @param {any} data
     * @returns Observable of User
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
     * Delete user.
     *
     * @param {string} userIri
     * @returns Observable of User
     */
    deleteUser(userIri: string): Observable<User> {
        const path = '/admin/users/' + encodeURIComponent(userIri);
        return this.httpDelete(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );

    }

    /**
     * Remove an user from a project.
     *
     * @param {string} userIri
     * @param {string} projectIri
     * @returns Observable of User
     */
    removeUserFromProject(userIri: string, projectIri: string): Observable<User> {
        const path = '/admin/users/projects/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpDelete(path).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }
}
