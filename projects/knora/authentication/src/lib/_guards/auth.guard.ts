import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';

import { KuiAuthenticationModule } from '../authentication.module';
import { AuthenticationService } from '../authentication.service';

@Injectable({
    providedIn: KuiAuthenticationModule
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private _auth: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        if (localStorage.getItem('id_token') && this._auth.authenticate()) {
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }

}
