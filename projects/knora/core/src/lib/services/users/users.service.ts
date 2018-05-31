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


    // TODO: create global changePassword method and use it in protected updateUser


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
    doAuthentication(payload: AuthenticationRequestPayload): Observable<any> {

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
