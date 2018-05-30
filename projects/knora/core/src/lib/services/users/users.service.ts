import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ApiService} from '../api.service';

import {ApiServiceResult, Project, ProjectResponse, User, UserResponse, UsersResponse} from '../../declarations';

import {KuiCoreModule} from '../../core.module';

@Injectable({
    providedIn: KuiCoreModule
})
export class UsersService extends ApiService {

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
        const url: string = '/admin/users/' + encodeURIComponent(email) + '?identifier=email';
        return this.getUser(url);
    }

    /**
     *
     * @param {string} iri
     * @returns {Observable<User>}
     */
    getUserByIri(iri: string): Observable<User> {
        const url: string = '/admin/users/' + iri;
        return this.getUser(url);
    }

    /**
     * Helper method combining user retrieval
     *
     * @param {string} url
     * @returns {Observable<User>}
     */
    protected getUser(url: string): Observable<User> {
        return this.httpGet(url).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }


    // TODO: create global changePassword method and use it in protected updateUser
}
