import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import * as momentImported from 'moment';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { UsersService } from '..';
import { ApiServiceError, CurrentUser, KnoraConstants, KuiCoreConfig, User } from '../../declarations';
import { AuthenticationCacheService } from './authentication-cache.service';
import { SessionService } from './session.service';

const moment = momentImported;

export class Session {
    id: number;
    user: {
        name: string;
        jwt: string;
        lang: string;
        sysAdmin: boolean;
    }
}

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(
        private session: SessionService,
        private _http: HttpClient,
        private _acs: AuthenticationCacheService,
        private _usersService: UsersService,
        @Inject('config') public config: KuiCoreConfig) {
    }

    /**
     * returns whether or not the user is signed in
     *
     * @returns {boolean}
     */
    public isSignedIn() {
        return !!this.session.accessToken;
    }

    /**
     * signs out the user by clearing the session data
     */
    public doSignOut() {
        this.session.destroy();
    }

    /**
     * signs in the user by storing the session data
     *
     * @param {string} accessToken
     * @param {string} name
     */
    public doSignIn(accessToken: string, name: string) {
        if ((!accessToken) || (!name)) {
            return;
        }
        this.session.accessToken = accessToken;
        this.session.name = name;
    }

    login(username: string, password: string) {

        let currentUser: CurrentUser = new CurrentUser();

        return this._http.post<any>(this.config.api + '/v2/authentication', {email: username, password: password})
            .pipe(map((res: any) => {
                // login successful if there's a jwt token in the response

                if (res && res.token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    // localStorage.setItem('currentUser', JSON.stringify({username, token: res.token}));

                    // store a new user key in local storage
                    const key = moment().add(0, 'second');
                    localStorage.setItem('session_id', JSON.stringify(key.valueOf()));

                    // just a workaround to test the interceptor. TODO remove it later
                    localStorage.setItem('token', res.token);

                    this._usersService.getUserByEmail(username).subscribe(
                        (result: User) => {
                            let sysAdmin: boolean = false;

                            const permissions = result.permissions;
                            if (permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]) {
                                sysAdmin = permissions.groupsPerProject[KnoraConstants.SystemProjectIRI].indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
                            }

                            currentUser = {
                                email: username,
                                token: res.token,
                                lang: result.lang,
                                sysAdmin: sysAdmin
                            };

                            this.doSignIn(
                                res.token,
                                result.email
                            );

                            // set the currentUser in the cache service
                            // this._acs.setData(JSON.stringify(key.valueOf()), currentUser);
                            // this._acs.setData(JSON.stringify(key.valueOf()), currentUser);

                        },
                        (error: ApiServiceError) => {
                            console.error(error);
                        }
                    );
                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('currentUser');

        // delete session id
        localStorage.removeItem('session_id');

        // and clear the cache

    }

}

// new service 2018-08-09
@Injectable({
    providedIn: 'root'
})
export class AuthService {

    readonly MAX_SESSION_TIME: number = 432000;  // 5d = 24 * 60 * 60 * 5

    constructor(private _http: HttpClient,
                private _usersService: UsersService,
                @Inject('config') public config: KuiCoreConfig) {
    }

    public sessionValidation() {


    }

    /**
     * Checks if the user is logged in or not.
     *
     * @returns {Observable<boolean>}
     */
    public authenticate(): Observable<boolean> {
        return this._http.get(this.config.api + '/v2/authentication').pipe(
            map((result: any) => {

                console.log('AuthenticationService - authenticate - result: : ', result);
                // return true || false
                return result.status === 200;
            })
        );
    }

    /**
     * returns whether or not the user is logged in
     */
    public loggedIn() {
        const session: Session = JSON.parse(localStorage.getItem('session'));
        if (session) {
            // check if the session is still valid
            // by comparing session id + max session time with current timestamp
            const now = moment().add(0, 'second');

            if ((session.id + this.MAX_SESSION_TIME) > now.valueOf()) {
                // the session is not valid anymore on client side;
                // is the session still valid in the back end?
                this.authenticate().subscribe(
                    res => {
                        // if we have a result, the session is still valid and should be updated
                        session.id = now.valueOf();
                        // update the localStorage
                        localStorage.setItem('session', JSON.stringify(session));
                        return true;
                    },
                    err => {
                        console.error(err);
                        // if it fails, delete the session
                        this.logout();
                        return false;
                    }
                )
            } else {
                return true;
            }
        }

        return false;
    }

    login(username: string, password: string) {
        return this._http.post<any>(this.config.api + '/v2/authentication', {username, password})
            .pipe(map(result => {
                // login successful if there's a jwt token in the response
                if (result && result.token) {

                    // define a session object
                    let session: Session;

                    // and a session id, which is the timestamp of login
                    const session_id = moment().add(0, 'second');

                    // get user data
                    this._usersService.getUserByEmail(username).subscribe(
                        (user: User) => {
                            let sysAdmin: boolean = false;

                            const permissions = result.permissions;
                            if (permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]) {
                                sysAdmin = permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]
                                    .indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
                            }

                            session = {
                                id: session_id.valueOf(),
                                user: {
                                    name: username,
                                    jwt: result.token,
                                    lang: user.lang,
                                    sysAdmin: sysAdmin
                                }
                            };
                            // store user details and jwt token and other session relevant information
                            // in local storage to keep user logged in between page refreshes
                            localStorage.setItem('session', JSON.stringify(session));

                        },
                        (error: ApiServiceError) => {
                            console.error(error);
                        }
                    );
                }

                // return user;
            }));
    }

    logout() {
        // remove user from local storage to log user out
        localStorage.removeItem('session');
        // TODO: and refresh page somehow
    }
}
