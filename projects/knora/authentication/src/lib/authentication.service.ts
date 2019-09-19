import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ApiService, ApiServiceError, ApiServiceResult, AuthenticationRequestByEmailPayload, AuthenticationRequestByUsernamePayload, AuthenticationResponse, KuiCoreConfigToken, LogoutResponse } from '@knora/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { SessionService } from './session/session.service';

/**
 * Authentication service includes the login, logout method and a session method to check if a user is logged in or not.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthenticationService extends ApiService {

    path: string = '/v2/authentication';

    constructor (private _session: SessionService,
        public http: HttpClient,
        @Inject(KuiCoreConfigToken) public config) {
        super(http, config);
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
     * @ignore
     *
     * generic post handler to authenticate
     *
     * @param  {AuthenticationRequestPayload} data
     * @returns Observable of any
     */
    /*
     private authPost(data: AuthenticationRequestPayload): Observable<any> {

        // console.log('AuthenticationService - login - api: ', this.config.api);

        let params: AuthenticationRequestByUsernamePayload | AuthenticationRequestByEmailPayload = { username: data.identifier, password: data.password };

        // username can be either name or email address, so what do we have?
        if (data.identifier.indexOf('@') > -1) {
            // username is email address
            params = { email: data.identifier, password: data.password };
        }

        return this.http.post(this.path, params, { observe: 'response' }).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {

                const result = new ApiServiceResult();
                result.header = { 'server': response.headers.get('Server') };
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = '/v2/authentication';
                result.body = response.body;
                return result;
            }),
            catchError((error: HttpErrorResponse) => {

                return this.handleRequestError(error);
            })
        );
    }
    */
    /**
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

        console.log('params', params);

        return this.httpPost(this.path, params).pipe(
            map((result: ApiServiceResult) => result.getBody(AuthenticationResponse).token),
            catchError(this.handleJsonError)
        );
    }

    loginUsage(identifier: string, password: string) {

        this.login(identifier, password).subscribe(
            (result: string) => {
                this.updateSession(result, identifier);
            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );
    }


    logout(): Observable<LogoutResponse> {
        this._session.destroySession();
        return this.httpDelete(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(LogoutResponse)),
            catchError(this.handleJsonError)
        );
    }

    /**
     * logout the user by destroying the session
     *
     */
    // logout(): Observable<any> {

    //     return this.http.delete(this.config.api + '/v2/authentication').pipe(
    //         map((response: HttpResponse<any>): any => {
    //             this._session.destroySession();
    //             return response;
    //         }),
    //         catchError((error: HttpErrorResponse) => {

    //             return this.handleRequestError(error);
    //         })
    //     );

    // }


    // /**
    //  * @ignore
    //  * handle request error in case of server error
    //  *
    //  * @param error
    //  * @returns
    //  */
    // protected handleRequestError(error: HttpErrorResponse): Observable<ApiServiceError> {
    //     const serviceError = new ApiServiceError();
    //     serviceError.header = { 'server': error.headers.get('Server') };
    //     serviceError.status = error.status;
    //     serviceError.statusText = error.statusText;
    //     serviceError.errorInfo = error.message;
    //     serviceError.url = error.url;
    //     return throwError(serviceError);
    // }

    // /**
    //  * handle json error in case of type error in json response (json2typescript)
    //  *
    //  * @param {any} error
    //  * @returns Observable of ApiServiceError
    //  */
    // protected handleJsonError(error: any): Observable<ApiServiceError> {

    //     if (error instanceof ApiServiceError) return throwError(error);

    //     const serviceError = new ApiServiceError();
    //     serviceError.header = { 'server': error.headers.get('Server') };
    //     serviceError.status = -1;
    //     serviceError.statusText = 'Invalid JSON';
    //     serviceError.errorInfo = error;
    //     serviceError.url = '';
    //     return throwError(serviceError);

    // }
}
