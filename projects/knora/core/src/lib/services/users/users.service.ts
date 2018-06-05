import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ApiService} from '../api.service';

import {
    ApiServiceError,
    ApiServiceResult,
    AuthenticationRequestPayload,
    KnoraApiConfig,
    User,
    UserResponse,
    UsersResponse
} from '../../declarations';

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



    // ------------------------------------------------------------------------
    // POST
    // ------------------------------------------------------------------------

    /**
     *
     * @param data
     * @returns {Observable<User>}
     */
    createUser(data: any): Observable<User> {
        const url: string = '/admin/users';
        return this.httpPost(url, data).pipe(
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
        const url: string = '/admin/users/projects/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpPost(url).pipe(
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
        const url: string = '/admin/users/projects-admin/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpPost(url).pipe(
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
        const url: string = '/admin/users/projects-admin/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpDelete(url).pipe(
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
        const url: string = '/admin/users/' + encodeURIComponent(userIri);
        return this.httpPut(url, data).pipe(
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

        const url: string = '/admin/users/' + encodeURIComponent(userIri);

        return this.httpPut(url, data).pipe(
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
        const url: string = '/admin/users/' + encodeURIComponent(userIri);
        return this.httpDelete(url).pipe(
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
        const url: string = '/admin/users/projects/' + encodeURIComponent(userIri) + '/' + encodeURIComponent(projectIri);
        return this.httpDelete(url).pipe(
            map((result: ApiServiceResult) => result.getBody(UserResponse).user),
            catchError(this.handleJsonError)
        );
    }

    // ------------------------------------------------------------------------
    // AUTHENTICATION
    // ------------------------------------------------------------------------

    /**
     * Checks if the user is logged in or not.
     *
     * @returns {Observable<boolean>}
     */
    authenticate(): Observable<boolean> {
        return this.httpGet('/v2/authentication').pipe(
            map((result: ApiServiceResult) => {
                // console.log('UsersService - authenticate - result: : ', result);
                // return true || false
                return result.status === 200;
            })
        );
    }

    /**
     *
     * @param {AuthenticationRequestPayload} payload
     * @returns {Observable<any>}
     */
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

    /**
     *
     * @param {string} email
     * @param {string} password
     * @returns {Observable<any>}
     */
    login(email: string, password: string): Observable<any> {

        // new login, so remove anything stale
        this.clearEverything();

        return this.doAuthentication({email, password}).pipe(
            map((token: string) => {
                // console.log('UsersService - login - token: : ', token);

                return this.getUserByEmail(email)
                    .subscribe(
                        (user: User) => {
                            // console.log('UsersService - login - user: ', user);
                            let isSysAdmin: boolean = false;

                            const permissions = user.permissions;

                            if (permissions.groupsPerProject[KnoraApiConfig.SystemProjectIRI]) {
                                isSysAdmin = permissions.groupsPerProject[KnoraApiConfig.SystemProjectIRI]
                                    .indexOf(KnoraApiConfig.SystemAdminGroupIRI) > -1;
                            }

                            const currentUserObject: any = {
                                email: user.email,
                                token: token,
                                sysAdmin: isSysAdmin,
                                lang: user.lang
                            };

                            // store username and jwt token in local storage to keep user logged in between page refreshes
                            // and set the system admin property to true or false
                            localStorage.setItem('currentUser', JSON.stringify(currentUserObject));

                            return true;
                        },
                        (error: ApiServiceError) => {
                            // console.error('UsersService - login - error: ', error);
                            throw error;
                        }
                    );

            }),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Sends a logout request to the server and removes any variables.
     *
     */
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

    /**
     * Clears any variables set during authentication in local and session storage
     *
     */
    protected clearEverything(): void {
        // clear token remove user from local storage to log user out
        // this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lang');
        sessionStorage.clear();
    }
}
