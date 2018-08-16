import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiServiceError, KnoraConstants, KuiCoreConfig, Session, User, UsersService } from '@knora/core';

import * as momentImported from 'moment';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

const moment = momentImported;


@Injectable({
    providedIn: 'root'
})
export class SessionService {

    public session: Session;

    /**
     * max session time in miliseconds
     */
    readonly MAX_SESSION_TIME: number = 30000; // 432000;  // 5d = 24 * 60 * 60 * 5

    constructor(
        private _http: HttpClient,
        @Inject('config') public config: KuiCoreConfig,
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

        // get user information
        this._users.getUserByEmail(username).subscribe(
            (result: User) => {
                let sysAdmin: boolean = false;

                const permissions = result.permissions;
                if (permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]) {
                    sysAdmin = permissions.groupsPerProject[KnoraConstants.SystemProjectIRI]
                        .indexOf(KnoraConstants.SystemAdminGroupIRI) > -1;
                }

                // define a session id, which is the timestamp of login
                this.session = {
                    id: this.setTimestamp(),
                    user: {
                        name: username,
                        jwt: jwt,
                        lang: result.lang,
                        sysAdmin: sysAdmin
                    }
                };

                console.log(this.session);
                // store in the localStorage
                localStorage.setItem('session', JSON.stringify(this.session));

            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );
    }

    private setTimestamp() {
        return (moment().add(0, 'second')).valueOf();
    }

    getSession() {

    }

    updateSession() {

    }

    validateSession() {
        // mix of checks with session.validation and this.authenticate
        this.session = JSON.parse(localStorage.getItem('session'));

        const tsNow: number = this.setTimestamp();

        if (this.session) {
            // check if the session is still valid: if session.id + MAX_SESSION_TIME > now: _session.validateSession()
            console.log(`%c current session id: ${this.session.id}`, 'color: blue');
            console.log(`%c MAX_SESSION_TIME: ${this.MAX_SESSION_TIME}`, 'color: orange');
            console.log(`%c Session valid until: ${this.session.id + this.MAX_SESSION_TIME}`, 'color: green');

            console.log(`%c current time: ${tsNow}`, 'color: purple');

            if (this.session.id + this.MAX_SESSION_TIME < tsNow) {
                // the internal session has expired
                // check if the api v2/authentication is still valid
                console.log('session.service -- validateSession: the intern session expired; make an API request and update the session id if the api session is still valid');


                this.authenticate().subscribe(
                    (response) => {
                        console.log('session.service -- validateSession -- authenticate', response);
                        // the api authentication is valid;
                        // update the session.id
                        this.session.id = tsNow;
                        console.log('new session id', this.session.id);
                        localStorage.setItem('session', JSON.stringify(this.session));
                        return true;
                    },
                    (error) => {
                        console.error('session.service -- validateSession -- authenticate: the session expired', error);
                        // a user is not authenticated anymore!
                        // TODO: destroy every session

                        return false;
                    }
                );

            } else {
                return true;
            }

            // then --> check if api v2/authentication is still valid this.authenticate()
            // then --> update the session.id _session.updateSession()
            // else --> logout() this.logout()

            return true;
        }
        return false;
    }


    private authenticate(): Observable<boolean> {
        return this._http.get(this.config.api + '/v2/authentication').pipe(
            map((result: any) => {

                console.log('AuthenticationService - authenticate - result: ', result);
                // return true || false
                return result.status === 200;
            })
        );
    }

    destroySession() {
        localStorage.removeItem('session');
    }


}
