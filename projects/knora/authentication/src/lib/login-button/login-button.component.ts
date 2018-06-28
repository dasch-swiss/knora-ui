import {Component, OnInit} from '@angular/core';

@Component({
    selector: 'kui-login-button',
    templateUrl: './login-button.component.html',
    styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {

    loggedIn: boolean;

    constructor() {
    }

    ngOnInit() {
        this.loggedIn = false;
        // TODO: OR make a real test, if a user is logged in
    }

    login() {
        // will open a dialog box incl. the LoginFormComponent
        // TODO: implement the dialog from @knora/action, when it's done there
        alert('open the login form here');
    }

}
