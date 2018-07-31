import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { KuiCoreConfig } from '@knora/core';
import { KuiAuthenticationModule } from './authentication.module';

import { shareReplay, tap } from 'rxjs/operators';
import * as momentImported from 'moment';

const moment = momentImported;

@Injectable({
    providedIn: KuiAuthenticationModule
})
export class AuthenticationService {

    constructor(@Inject('config') public config: KuiCoreConfig,
                private http: HttpClient) {
    }

    login(email: string, password: string) {
        const url: string = '/v2/authentication';

        return this.http.post(this.config.api + url, {email, password}).pipe(
            tap(res => this.setSession),
            shareReplay()
        );
    }

    private setSession(authResult) {
        const expiresAt = moment().add(authResult.expiresIn, 'second');

        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', JSON.stringify(expiresAt.valueOf()));
    }

    logout() {
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
    }

    isLoggedIn() {
        return moment().isBefore(this.getExpiration());
    }

    isLoggedOut() {
        return !this.isLoggedIn();
    }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }
}
