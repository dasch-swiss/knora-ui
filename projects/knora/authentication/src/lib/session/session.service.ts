import { Inject, Injectable } from '@angular/core';
import { ApiResponseData, ApiResponseError, CredentialsResponse, KnoraApiConfig, KnoraApiConnection, UserResponse } from '@knora/api';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KnoraConstants } from '@knora/core';
import * as momentImported from 'moment';
import { Subject } from 'rxjs';

/**
 * Currently logged-in user information
 */
export interface CurrentUser {
    // username
    name: string;

    // json web token
    jwt: string;

    // default language for ui
    lang: string;

    // is system admin?
    sysAdmin: boolean;

    // list of project shortcodes where the user is project admin
    projectAdmin: string[];
}

/**
 * Session with id (= login timestamp) and inforamtion about logged-in user
 */
export interface Session {
    id: number;
    user: CurrentUser;
}

const moment = momentImported;
/**
 * TODO: move this service to @knora/core
 */
@Injectable({
    providedIn: 'root'
})
export class SessionService {

    /**
     * max session time in milliseconds
     * default value (24h): 86400000
     *
     */
    readonly MAX_SESSION_TIME: number = 86400000; // 1d = 24 * 60 * 60 * 1000
    // readonly MAX_SESSION_TIME: number = 30000; // for test only: 30 seconds

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
        @Inject(KnoraApiConfigToken) private knoraApiConfig: KnoraApiConfig
    ) { }

    /**
     * set the session by using the json web token (jwt) and the user object;
     * it will be used in the login process
     *
     * @param jwt
     * @param username
     */
    setSession(jwt: string, identifier: string, identifierType: 'email' | 'username') {

        let session: Session;

        this.updateKnoraApiConnection(jwt);

        // // define a session id, which is the timestamp of login
        // this.session = {
        //     id: this.setTimestamp(),
        //     user: {
        //         name: '',
        //         jwt: jwt,
        //         lang: '',
        //         sysAdmin: false,
        //         projectAdmin: []
        //     }
        // };
        // // store in the localStorage
        // localStorage.setItem('session', JSON.stringify(this.session));

        // get user information
        this.knoraApiConnection.admin.usersEndpoint.getUser(identifierType, identifier).subscribe(
            (response: ApiResponseData<UserResponse>) => {
                let sysAdmin: boolean = false;
                const projectAdmin: string[] = [];

                // get permission inforamation: a) is user sysadmin? b) get list of project iris where user is project admin
                const groupsPerProjectKeys: string[] = Object.keys(response.body.user.permissions.groupsPerProject);

                for (const key of groupsPerProjectKeys) {
                    if (key === KnoraConstants.SystemProjectIRI) {
                        sysAdmin = response.body.user.permissions.groupsPerProject[key].indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
                    }

                    if (response.body.user.permissions.groupsPerProject[key].indexOf(KnoraConstants.ProjectAdminGroupIRI) > -1) {
                        projectAdmin.push(key);
                    }
                }

                // store session information in browser's localstorage
                session = {
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
                localStorage.setItem('session', JSON.stringify(session));
            },
            (error: ApiResponseError) => {
                localStorage.removeItem('session');
                console.error(error);
            }
        );

    }

    private setTimestamp(): number {
        return (moment().add(0, 'second')).valueOf();
    }


    /**
     * Validate the session.
     *
     * @returns boolean
     */
    validateSessionDepr() {
        const session = JSON.parse(localStorage.getItem('session'));

        if (!session) {
            return false;
        } else {
            // this.validateSessionAndCheckCredentials(session).subscribe(
            //     (response: boolean) => {
            //         return response;
            //     }
            // );
        }

    }

    /**
     * Validate intern session and check knora api credentials if necessary.
     * If a json web token exists, it doesn't mean, that the knora api credentials are still valid.
     *
     * @returns Observable<boolean>
     */
    validateSession(): boolean {
        // mix of checks with session.validation and this.authenticate
        const session = JSON.parse(localStorage.getItem('session'));

        const tsNow: number = this.setTimestamp();

        const subject = new Subject<boolean>();

        if (session) {

            this.updateKnoraApiConnection(session.user.jwt);
            // this.knoraApiConfig.jsonWebToken = session.user.jwt;
            // this.knoraApiConnection = new KnoraApiConnection(this.knoraApiConfig);

            // check if the session is still valid:
            // if session.id + MAX_SESSION_TIME < now: _session.validateSession()
            if (session.id + this.MAX_SESSION_TIME <= tsNow) {
                // the internal (knora-ui) session has expired
                // check if the api credentails are still valid

                // console.error('session is not valid; check knora api credentials');

                this.knoraApiConnection.v2.auth.checkCredentials().subscribe(
                    (response: ApiResponseData<CredentialsResponse>) => {
                        // the knora api credentials are still valid
                        // console.log('knora api credentials', response);

                        // refresh the jwt in @knora/api
                        this.updateKnoraApiConnection(session.user.jwt);
                        // this.knoraApiConfig.jsonWebToken = session.user.jwt;
                        // this.knoraApiConnection = new KnoraApiConnection(this.knoraApiConfig);

                        // the api authentication is valid;
                        // update the session.id
                        session.id = tsNow;

                        localStorage.setItem('session', JSON.stringify(session));

                        // console.log('knora api credentials are valid; return', true);
                        return true;
                        // subject.next(true);
                    },
                    (error: ApiResponseError) => {
                        // console.error('session.service -- validateSession -- authenticate: the session expired on API side');
                        // a user is not authenticated anymore!

                        console.error('knora api credentials issue', error);

                        this.destroySession();

                        // console.warn('knora api credentials are not valid; return', false);
                        return false;
                        // subject.next(false);
                    }
                );

            } else {
                // the internal (knora-ui) session is still valid
                // refresh the jwt in @knora/api and update the knora-api-connection

                // console.log('session is valid; return', true);
                return true;
                // subject.next(true);
            }
        } else {
            this.updateKnoraApiConnection();
            // this.knoraApiConfig.jsonWebToken = '';
            // this.knoraApiConnection = new KnoraApiConnection(this.knoraApiConfig);

            // console.warn('session is not valid; return', false);
            return false;
            // subject.next(false);
        }

        // console.log('observable subject:', subject);

        // return subject.asObservable();

    }

    updateKnoraApiConnection(jwt?: string) {
        this.knoraApiConfig.jsonWebToken = (jwt ? jwt : '');
        this.knoraApiConnection = new KnoraApiConnection(this.knoraApiConfig);
    }

    // private authenticate(): boolean {



    // TODO: still old method because of missing one in knora-api-js-lib
    // return this._http.get(this.knoraApiConfig.apiUrl + '/v2/authentication').pipe(
    //     map((result: any) => {
    //         // console.log('AuthenticationService - authenticate - result: ', result);
    //         // return true || false
    //         return result.status === 200;
    //     })
    // );
    // }

    /**
     * update the session storage
     * @param jwt
     * @param username
     *
     * @returns boolean
     */
    updateSession(jwt: string, username: string): boolean {
        if (jwt && username) {
            this.setSession(jwt, username, 'username');
            return true;
        } else {
            return false;
        }
    }

    destroySession() {
        localStorage.removeItem('session');
    }

}
