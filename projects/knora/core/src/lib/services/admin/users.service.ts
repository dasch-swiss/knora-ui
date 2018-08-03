import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
// import * as moment from 'moment';
import * as momentImported from 'moment';
import { ApiService } from '../api.service';

import {
    ApiServiceError,
    ApiServiceResult,
    AuthenticationRequestPayload,
    CurrentUser,
    KnoraConstants,
    User,
    UserResponse,
    UsersResponse
} from '../../declarations/';

import { KuiCoreModule } from '../../core.module';

const moment = momentImported;


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
/*
    // ------------------------------------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------------------------------------

    /!**
     * Checks if the user is logged in or not.
     *
     * @returns {Observable<boolean>}
     *!/
    authenticate(): Observable<boolean> {
        return this.httpGet('/v2/authentication').pipe(
            map((result: ApiServiceResult) => {
                // console.log('UsersService - authenticate - result: : ', result);
                // return true || false
                return result.status === 200;
            })
        );
    }

    /!**
     *
     * @param {AuthenticationRequestPayload} payload
     * @returns {Observable<any>}
     *!/
    protected doAuthentication(payload: AuthenticationRequestPayload): Observable<any> {

        const url: string = '/v2/authentication';
        return this.httpPost(url, payload).pipe(
            map((result: ApiServiceResult) => {
                const token = result.body && result.body.token;

                // console.log('UsersService - doAuthentication - result: ', result);

                if (token) {
                    // console.log('UsersService - doAuthentication - token: : ', token);
                    return token;
                } else {
                    // If login does fail, then we would gotten an error back. This case covers
                    // a `positive` login outcome without a returned token. This is a bug in `webapi`
                    throw new Error('Token not returned. Please report this as a possible bug.');
                }
//                result.getBody(AuthenticationResponse);
            }),
            catchError(this.handleJsonError)
        );
    }

    /!**
     * Login makes two api requests: one for user profile and another to get user's token
     *
     * @param {string} email
     * @param {string} password
     * @returns {Observable<CurrentUser>}
     *!/
    login(email: string, password: string): Observable<CurrentUser> {
        const url: string = '/v2/authentication';

        let user: User;

        // get the user profile
        this.getUserByEmail(email)
            .subscribe(
                (result: User) => {
                    user = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );

        // ask for the user's token
        // and create a current user object with email, token, sysAdmin and language information
        return this.httpPost(url, {email, password}).pipe(
            map((result: ApiServiceResult) => {
                const token = result.body && result.body.token;

                if (token && user) {
                    let isSysAdmin: boolean = false;

                    const permissions = user.permissions;

                    if (permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]) {
                        isSysAdmin = permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]
                            .indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
                    }

                    // store the user id in the local storage for later usage
                    localStorage.setItem('user', user.id);

                    // return CurrentUser object
                    return {
                        email: user.email,
                        token: token,
                        sysAdmin: isSysAdmin,
                        lang: user.lang
                    };
                } else {
                    // If login does fail, then we would gotten an error back. This case covers
                    // a `positive` login outcome without a returned token. This is a bug in `webapi`
                    throw new Error('Token not returned. Please report this as a possible bug.');
                }

            }));
    }

    private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn, 'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    /!**
     * Sends a logout request to the server and removes any variables.
     *
     *!/
    logout(): void {

        this.httpDelete('/v2/authentication').pipe(
            map((result: ApiServiceResult) => {
                // console.log('UsersService - logout - result:', result);
            }),
            catchError(this.handleJsonError)
        );

        // clear token remove user from local storage to log user out
        this.clearEverything();
    }

    /!**
     * Clears any variables set during authentication in local and session storage
     *
     *!/
    protected clearEverything(): void {
        // clear token remove user from local storage to log user out
        // this.token = null;
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // localStorage.removeItem('currentUser');
        // localStorage.removeItem('lang');
        sessionStorage.clear();
    }*/
}
