import { Component, OnInit } from '@angular/core';
import { AuthenticationCacheService, AuthenticationService, CurrentUser } from '@knora/core';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    currentUser: CurrentUser;

    constructor(private _auth: AuthenticationService,
                private _acs: AuthenticationCacheService) {
    }

    ngOnInit() {
        // get current User data from cache by using the session id as a key
        if (localStorage.getItem('session_id')) {
            this._acs.get(localStorage.getItem('session_id')).subscribe(
                (result: CurrentUser) => {
                    this.currentUser = result;
                },
                (error: any) => {
                    this.currentUser = undefined;
                    console.error(error);
                }
            );
        }


    }

    logout() {
        this._auth.logout();
        // refresh page

    }

}
