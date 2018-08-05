import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { KuiAuthenticationModule } from '../authentication.module';
import { AuthenticationService } from '@knora/core';

import * as momentImported from 'moment';

const moment = momentImported;


@Injectable({
    providedIn: KuiAuthenticationModule
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private _auth: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if ((localStorage.getItem('id_token') && localStorage.getItem('expires_at')) && this._auth.authenticate()) {
            // check the expiration time
            console.log('auth expires_at', localStorage.getItem('expires_at'));
            console.log('auth moment now', moment().add(0, 'seconds').valueOf());

            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

}
