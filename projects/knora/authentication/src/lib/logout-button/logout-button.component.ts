import {Component, OnInit} from '@angular/core';
import {UsersService} from '@knora/core';

@Component({
    selector: 'kui-logout-button',
    templateUrl: './logout-button.component.html',
    styleUrls: ['./logout-button.component.scss']
})
export class LogoutButtonComponent implements OnInit {

    loggedIn: boolean;

    constructor(private _usersService: UsersService) {
    }

    ngOnInit() {
        this.loggedIn = true;
        // TODO: OR make a real test, if a user is logged in
    }


    logout() {
        this._usersService.logout();
        // switch button to login
        this.loggedIn = false;
    }
}
