import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@knora/core';

import * as momentImported from 'moment';
import { Moment } from 'moment';

const moment = momentImported;

@Component({
    selector: 'app-auth',
    templateUrl: './auth.component.html',
    styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    expiresAt: Moment;

    constructor(private _auth: AuthenticationService) {
    }

    ngOnInit() {
        // get expiration
        this.expiresAt = moment(JSON.parse(localStorage.getItem('expires_at')));
        console.log('expiresAt', this.expiresAt);
    }

    getExpiration() {
        const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return moment(expiresAt);
    }

    logout() {
        this._auth.logout();
        // refresh page

    }

}
