import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { KuiCoreConfig } from '@knora/core';
import { Observable, throwError } from 'rxjs';
// import { catchError, map } from 'rxjs/operators';
import { SessionService } from './session.service';

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(
        private _http: HttpClient,
        private _session: SessionService,
        @Inject('config') public config: KuiCoreConfig) {
    }


    /**
     * api authentication request: /v2/authentication
     *
     * @returns {Observable<boolean>}
     */

    /*
    private authenticate(): Observable<boolean> {
        return this._http.get(this.config.api + '/v2/authentication').pipe(
            map((result: any) => {

                console.log('AuthenticationService - authenticate - result: : ', result);
                // return true || false
                return result.status === 200;
            })
        );
    }
    */
    /*
    public loggedIn() {
        // mix of checks with session.validation and this.authenticate
        return false;
    }
    */
    /*
    public login(username: string, password: string) {
        return this._http.post(this.config.api + '/v2/authentication',
            {email: username, password: password})
            .pipe(
                map((authRes: any) => {
                    // console.log('ApiServie -- signIn http.post -- res', authRes);
                    // set the session here? and return a token
                    return {token: authRes.token};
                }),
                catchError(this.handleError)
            );
    }
*/
/*

    private handleError(error: Response | any) {
        console.error('AuthService::handleError', error);
        return throwError(error);
    }

    public logout() {

        // destroy session
        this._session.destroySession();
        // return false;
    }
*/


}
