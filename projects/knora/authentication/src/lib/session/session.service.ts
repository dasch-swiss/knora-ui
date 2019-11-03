import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiServiceError, KnoraConstants, KuiConfigToken, User, UsersService, KnoraApiConnectionToken } from '@knora/core';
import * as momentImported from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Session } from '../declarations';
import { KnoraApiConnection, ApiResponseData, ApiResponseError, UserResponse } from '@knora/api';

const moment = momentImported;

@Injectable({
    providedIn: 'root'
})
export class SessionService {

    public session: Session;

    /**
     * max session time in milliseconds
     * default value (24h): 86400000
     *
     */
    readonly MAX_SESSION_TIME: number = 86400000; // 1d = 24 * 60 * 60 * 1000

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
        private _http: HttpClient,
        @Inject(KuiConfigToken) public kuiConfig,
        private _users: UsersService) {
    }

    /**
     * set the session by using the json web token (jwt) and the user object;
     * it will be used in the login process
     *
     * @param jwt
     * @param username
     */
    setSession(jwt: string, username: string) {

        // define a session id, which is the timestamp of login
        this.session = {
            id: this.setTimestamp(),
            user: {
                name: '',
                jwt: jwt,
                lang: '',
                sysAdmin: false,
                projectAdmin: []
            }
        };
        // store in the localStorage
        localStorage.setItem('session', JSON.stringify(this.session));

        // username can be either name or email address, so what do we have?
        const identifierType: string = ((username.indexOf('@') > -1) ? 'email' : 'username');

        // get user information
        this.knoraApiConnection.admin.usersEndpoint.getUserByUsername(username).subscribe(
            (response: ApiResponseData<UserResponse>) => {
                let sysAdmin: boolean = false;
                const projectAdmin: string[] = [];

                // BUG: Property 'permissions' does not exist on type 'ReadUser'. Issue #90 in knora-api-js-lib
                // TODO: uncomment after bug is fixed
                /*
                const groupsPerProjectKeys: string[] = Object.keys(response.body.user.permissions.groupsPerProject);

                for (const key of groupsPerProjectKeys) {
                    if (key === KnoraConstants.SystemProjectIRI) {
                        sysAdmin = result.permissions.groupsPerProject[key].indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
                    }

                    if (result.permissions.groupsPerProject[key].indexOf(KnoraConstants.ProjectAdminGroupIRI) > -1) {
                        projectAdmin.push(key);
                    }
                }
                */


                // replace existing session in localstorage
                this.session = {
                    id: this.setTimestamp(),
                    user: {
                        name: response.body.user.username,
                        jwt: jwt,
                        lang: response.body.user.lang,
                        sysAdmin: sysAdmin,
                        projectAdmin: projectAdmin
                    }
                };
                // update localStorage
                localStorage.setItem('session', JSON.stringify(this.session));
            },
            (error: ApiResponseError) => {
                console.error(error);
            }
        );

        /*
        this._users.getUser(username, identifierType).subscribe(
            (result: User) => {
                let sysAdmin: boolean = false;
                const projectAdmin: string[] = [];

                const groupsPerProjectKeys: string[] = Object.keys(result.permissions.groupsPerProject);

                for (const key of groupsPerProjectKeys) {
                    if (key === KnoraConstants.SystemProjectIRI) {
                        sysAdmin = result.permissions.groupsPerProject[key].indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
                    }

                    if (result.permissions.groupsPerProject[key].indexOf(KnoraConstants.ProjectAdminGroupIRI) > -1) {
                        projectAdmin.push(key);
                    }
                }


                // replace existing session in localstorage
                this.session = {
                    id: this.setTimestamp(),
                    user: {
                        name: result.username,
                        jwt: jwt,
                        lang: result.lang,
                        sysAdmin: sysAdmin,
                        projectAdmin: projectAdmin
                    }
                };
                // update localStorage
                localStorage.setItem('session', JSON.stringify(this.session));

            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );
        */
    }

    private setTimestamp() {
        return (moment().add(0, 'second')).valueOf();
    }

    validateSession() {
        // mix of checks with session.validation and this.authenticate
        this.session = JSON.parse(localStorage.getItem('session'));

        const tsNow: number = this.setTimestamp();

        if (this.session) {
            // the session exists
            // check if the session is still valid:
            // if session.id + MAX_SESSION_TIME > now: _session.validateSession()
            if (this.session.id + this.MAX_SESSION_TIME < tsNow) {
                // the internal session has expired
                // check if the api v2/authentication is still valid

                if (this.authenticate()) {
                    // the api authentication is valid;
                    // update the session.id
                    this.session.id = tsNow;

                    localStorage.setItem('session', JSON.stringify(this.session));
                    return true;

                } else {
                    // console.error('session.service -- validateSession -- authenticate: the session expired on API side');
                    // a user is not authenticated anymore!
                    this.destroySession();
                    return false;
                }

            } else {
                return true;
            }
        }
        return false;
    }

    private authenticate(): Observable<boolean> {

        // TODO: still old method because of missing one in knora-api-js-lib
        const apiUrl: string = (this.kuiConfig.api.protocol + '://' + this.kuiConfig.api.host) +
            (this.kuiConfig.api.port !== null ? ':' + this.kuiConfig.api.port : '') +
            (this.kuiConfig.api.path ? '/' + this.kuiConfig.api.path : '');
        return this._http.get(apiUrl + '/v2/authentication').pipe(
            map((result: any) => {
                // console.log('AuthenticationService - authenticate - result: ', result);
                // return true || false
                return result.status === 200;
            })
        );
    }

    destroySession() {
        localStorage.removeItem('session');
    }

}
