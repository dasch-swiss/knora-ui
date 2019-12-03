import { Component, OnInit } from '@angular/core';
import { AuthenticationService, CurrentUser } from '@knora/authentication';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    currentUser: CurrentUser;

    module = AppDemo.authenticationModule;

    constructor(private _auth: AuthenticationService) {
    }

    ngOnInit() {

        if (JSON.parse(localStorage.getItem('session'))) {
            this.currentUser = JSON.parse(localStorage.getItem('session')).user;
        }
    }

    logout() {
        this._auth.logout();
        location.reload(true);
    }

}
