import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../authentication.service';


@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private router: Router,
                private _auth: AuthenticationService) {
    }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        if (localStorage.getItem('session')) {
            // the session includes an id which is the timestamp from login
            // TODO: check if the session is still valid, by comparing it with current time and the max session time; if it's false, check the api authentication /v2/authentication; if this is still true, set the new session id; a session is valid for 5 days by default

            // console.log('auth guard -- canActivate -- _auth.loggedIn', this._auth.loggedIn());
            // logged in so return true
            return true;
        }

        // not logged in so redirect to login page with the return url
        this.router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
        return false;
    }
}
