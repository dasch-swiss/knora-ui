import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiService, ApiServiceResult, AuthenticationRequestByEmailPayload, AuthenticationRequestByUsernamePayload, AuthenticationResponse, KuiConfigToken, LogoutResponse } from '@knora/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { SessionService } from './session/session.service';


/**
 * @deprecated This service is obsolete since we use @knora/api (dasch-swiss/knora-api-js-lib)
 *
 * Authentication service includes the login, logout method and a session method to check if a user is logged in or not.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ApiService {

    path: string = '/v2/authentication';

    constructor(
        private _session: SessionService,
        public http: HttpClient,
        @Inject(KuiConfigToken) public config) {
        super(http, config);
    }

    /**
     * @deprecated Use session service validateSession instead
     *
     * validate if a user is logged in or not
     * returns true if the session is active
     *
     * @returns boolean
     */
    session(): boolean {
        return this._session.validateSession();
    }

    /**
     * @deprecated Use the session service instead
     *
     * update the session storage
     * @param jwt
     * @param username
     *
     * @returns boolean
     */
    updateSession(jwt: string, username: string): boolean {
        if (jwt && username) {
            this._session.setSession(jwt, username);
            return true;
        } else {
            return false;
        }
    }

    /**
     * @deprecated Use login from @knora/api instead
     * Login request
     *
     * @param  {string} identifier can be email address or username
     * @param  {string} password
     * @returns Observable<string> Returns JWT
     */
    login(identifier: string, password: string): Observable<string> {
        let params: AuthenticationRequestByUsernamePayload | AuthenticationRequestByEmailPayload;

        // username can be either name or email address, so what do we have?
        if (identifier.indexOf('@') > -1) {
            // username is email address
            params = { email: identifier, password: password };
        } else {
            params = { username: identifier, password: password };
        }

        return this.httpPost(this.path, params).pipe(
            map((result: ApiServiceResult) => result.getBody(AuthenticationResponse).token),
            catchError(this.handleJsonError)
        );
    }

    /**
     * @deprecated Use logout from @knora/api instead
     * Logout from app (by destroying the session) and knora
     *
     * @returns Observable<LogoutResponse>
     */
    logout(): Observable<LogoutResponse> {
        this._session.destroySession();
        return this.httpDelete(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(LogoutResponse)),
            catchError(this.handleJsonError)
        );
    }
}
