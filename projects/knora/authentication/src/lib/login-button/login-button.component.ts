import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginFormComponent} from '../login-form/login-form.component';


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

        const dialogRef = this._dialog.open(LoginFormComponent, {
            hasBackdrop: true,
            panelClass: 'no-padding'
        });

        dialogRef.afterClosed()
            .subscribe(() => {
                // refresh parent component
                console.log('refresh now');
            });
        // will open a dialog box incl. the LoginFormComponent
        // TODO: implement the dialog from @knora/action, when it's done there
        // alert('open the login form here');
    }

}
