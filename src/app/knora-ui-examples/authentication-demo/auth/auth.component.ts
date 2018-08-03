import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@knora/authentication';

import { Moment } from 'moment';
import * as momentImported from 'moment';
const moment = momentImported;

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

    expire: Moment;

  constructor(private _auth: AuthenticationService) { }

  ngOnInit() {
      this.expire = this.getExpiration();
  }

    getExpiration() {
        const expiration = localStorage.getItem('expires_at');
        const expiresAt = JSON.parse(expiration);
        return moment(expiresAt);
    }

    logout() {
        this._auth.logout();
    }

}
