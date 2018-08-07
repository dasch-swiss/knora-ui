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

        console.log('auth comp on init');

        this._acs.getData().subscribe(
            (result: CurrentUser) => {
                console.log('user from cache', result);
                this.currentUser = result;
            },
            (error: any) => {
                this.currentUser = undefined;
                console.error(error);
            }
        );

        // get current User data from cache by using the session id as a key
        if (localStorage.getItem('session_id')) {

        }


    }

    logout() {
        this._auth.logout();
        // refresh page

    }

}
