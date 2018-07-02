import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material';
import { LoginFormComponent } from '../login-form/login-form.component';


@Component({
    selector: 'kui-login-button',
    templateUrl: './login-button.component.html',
    styleUrls: ['./login-button.component.scss']
})
export class LoginButtonComponent implements OnInit {

    loggedIn: boolean;

    constructor(private _dialog: MatDialog) {
    }

    ngOnInit() {
        this.loggedIn = false;
        // TODO: OR make a real test, if a user is logged in
    }

    login() {

        const dialogRef = this._dialog.open(LoginFormComponent);

        // will open a dialog box incl. the LoginFormComponent
        // TODO: implement the dialog from @knora/action, when it's done there
        // alert('open the login form here');
    }

}
