import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiServiceError, KUI_CORE_CONFIG_TOKEN, KuiCoreConfig } from '@knora/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from './session/session.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(public http: HttpClient,
                private _session: SessionService,
                @Inject(KUI_CORE_CONFIG_TOKEN) public config: KuiCoreConfig) {

    }

    /**
     * validate if a user is logged in or not
     * and the session is active
     */
    session(): boolean {
        return this._session.validateSession();
    }

    /**
     * login process;
     * it's used by the login component
     *
     * @param username
     * @param password
     * @returns
     */
    login(username: string, password: string): Observable<any> {

        return this.http.post(
            this.config.api + '/v2/authentication',
            {email: username, password: password},
            {observe: 'response'}).pipe(
                map((response: HttpResponse<any>): any => {
                    return response;
                }),
                catchError((error: HttpErrorResponse) => {

                    return this.handleRequestError(error);
                })
            );
    }


    logout() {
        // destroy the session
        localStorage.removeItem('session');
    }


    /**
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
