import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { ApiServiceResult, KuiCoreConfig } from '@knora/core';

import * as momentImported from 'moment';

const moment = momentImported;

@Injectable({
    providedIn: 'root'
})
export class AuthenticationService {

    constructor(private _http: HttpClient,
                @Inject('config') public config: KuiCoreConfig) {
    }

    login(username: string, password: string) {
        return this._http.post<any>(this.config.api + '/v2/authentication', {email: username, password: password})
            .pipe(map((res: any) => {
                // login successful if there's a jwt token in the response
                console.log(res);
                if (res && res.token) {
                    // store username and jwt token in local storage to keep user logged in between page refreshes
                    // localStorage.setItem('currentUser', JSON.stringify({username, token: res.token}));


                    // from https://blog.angular-university.io/angular-jwt-authentication/
                    const expiresAt = moment().add(res.expiresIn, 'second');

                    console.log('res.expiresIn', res.expiresIn);

                    localStorage.setItem('id_token', res.token);
                    localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
                    // end angular-university.io

                }
            }));
    }

    logout() {
        // remove user from local storage to log user out
        // localStorage.removeItem('currentUser');

        // from https://blog.angular-university.io/angular-jwt-authentication/
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // end angular-university.io
    }

    authenticate(): Observable<boolean> {
        return this._http.get('/v2/authentication').pipe(
            map((result: ApiServiceResult) => {

                console.log('authenticate', result);
                // return true || false
                return result.status === 200;
            })
        );
    }
}
