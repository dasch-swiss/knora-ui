import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { KuiAuthenticationModule } from '../authentication.module';

import * as momentImported from 'moment';
import { AuthenticationCacheService } from '@knora/core';

const moment = momentImported;


@Injectable({
    providedIn: KuiAuthenticationModule
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private _acs: AuthenticationCacheService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (localStorage.getItem('session_id')) { // && this._auth.authenticate()) {
            // check the expiration time

            this._acs.get(localStorage.getItem('session_id'));

            // console.log('auth expires_at', localStorage.getItem('expires_at'));
            // console.log('auth moment now', moment().add(0, 'seconds').valueOf());

            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

}
