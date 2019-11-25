import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { SessionService } from '../session/session.service';

/**
 * @deprecated since v9.5.0
 * Import and configure your guards directly inside your web app.
 */
@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    constructor(private _session: SessionService,
        private _router: Router) {

    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

        if (!this._session.validateSession()) {
            this._router.navigate(['login'], { queryParams: { returnUrl: state.url } });
            return false;
        }

        return true;
    }

}
