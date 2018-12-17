import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiServiceError, KuiCoreConfig } from '@knora/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from './session/session.service';

/**
 * Authentication service includes the login, logout method and a session method to check if a user is logged in or not.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(public http: HttpClient,
                private _session: SessionService,
                @Inject('config') public config: KuiCoreConfig) {
    }

    /**
     * validate if a user is logged in or not
     * returns true if the session is active
     *
     * @returns boolean
     */
    session(): boolean {
        return this._session.validateSession();
    }

    /**
     * login process;
     * it's used by the login component
     *
     * @param {string} identifier email or username
     * @param {string} password
     * @returns Observable<any>
     */
    login(identifier: string, password: string): Observable<any> {

        return this.http.post(
            this.config.api + '/v2/authentication',
            {identifier: identifier, password: password},
            {observe: 'response'}).pipe(
                map((response: HttpResponse<any>): any => {
                    return response;
                }),
                catchError((error: HttpErrorResponse) => {

                    return this.handleRequestError(error);
                })
            );
    }


    /**
     * logout the user by destroying the session
     */
    logout() {
        // destroy the session
        localStorage.removeItem('session');
    }


    /**
     * @ignore
     * handle request error in case of server error
     *
     * @param error
     * @returns
     */
    protected handleRequestError(error: HttpErrorResponse): Observable<ApiServiceError> {
        const serviceError = new ApiServiceError();
        serviceError.status = error.status;
        serviceError.statusText = error.statusText;
        serviceError.errorInfo = error.message;
        serviceError.url = error.url;
        return throwError(serviceError);
    }
}
