import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AuthenticationResponse, KuiCoreConfig, ApiServiceError } from '@knora/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from './session/session.service';


@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {


    constructor(private _session: SessionService,
                private _http: HttpClient,
                @Inject('config') public config: KuiCoreConfig) {
    }

    /**
     * is a user logged in? returns true or false;
     * it's a mix of checking session.validation and this.authenticate
     * incl. update session if it's necessary
     *
     * @returns
     */
    public loggedIn() {
        return (this._session.validateSession());
    }

    /**
     * login process;
     * it's used by the login component
     *
     * @param username
     * @param password
     * @returns
     */
    public login(username: string, password: string) {

        return this._http.post(this.config.api + '/v2/authentication',
            {email: username, password: password})
            .pipe(
                map((authRes: AuthenticationResponse) => {
                    // console.log('ApiServie -- signIn http.post -- res', authRes);

                    // we have a token; set the session now
                    this._session.setSession(authRes.token, username);

                    return {token: authRes.token, name: username};
                }),
                catchError((error: HttpErrorResponse) => {
                        return this.handleRequestError(error);
                })
            );
    }

    public logout() {
        // destroy the session
        this._session.destroySession();
    }

    /**
     * error handler for login process
     *
     * @param error
     * @returns
     */
    private handleError(error: Response | any) {
        console.error('AuthenticationService -- handleError', error);
        // TODO: destroy any session

        // throw error
        return throwError(error);
    }

    /**
     * handle request error in case of server error
     *
     * @param error
     * @returns
     */
    protected handleRequestError(error: HttpErrorResponse): Observable<ApiServiceError> {
        console.error('authentication service -- handleRequestError', error);
        const serviceError = new ApiServiceError();
        serviceError.status = error.status;
        serviceError.statusText = error.statusText;
        serviceError.errorInfo = error.message;
        serviceError.url = error.url;
        return throwError(serviceError);
    }
}
