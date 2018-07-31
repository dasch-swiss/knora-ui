import { Component, OnInit } from '@angular/core';
import { ApiServiceError, AuthenticationCacheService, UsersService } from '@knora/core';
import { LoginFormComponent } from '../login-form/login-form.component';
import { MatDialog } from '@angular/material';

/**
 * this component includes the whole process of user authentication;
 * it shows the login OR the logout button, depending on user's
 * authentication. The login button will open the login form
 */
@Component({
    selector: 'kui-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

    loggedIn: boolean = false;

    loading: boolean = true;

    constructor(private _dialog: MatDialog,
                private _acs: AuthenticationCacheService,
                private _usersService: UsersService) {
    }

    ngOnInit() {
        this.authenticate();
    }

    authenticate() {

        // first: get the user data from SimpleCacheService and check if it's still valid
        if (localStorage.getItem('user') !== null) {
            const id = localStorage.getItem('user');

            this._acs.get(id, this._usersService.getUserByIri(id))
                .subscribe(
                    (result: any) => {
                        console.log('auth comp -- result from acs:', result);
                    },
                    error => {
                        console.error('auth comp -- error from acs:', error);
                    }
                );


        } else {
            // no data in localstorage, we don't have a logged in user yet
        }



        this._usersService.authenticate()
            .subscribe(
                (result: boolean) => {

                    console.log('auth comp result from usersService authenticate:', result);


                    // if result == true: a user is logged-in,
                    // in case of an error (ApiServiceError), the current user is not authorized to do something
                    // console.log('authenticate:', result);
                    // this.loggedIn = result;
                    this.loggedIn = result;
                    this.loading = false;
                },
                (error: ApiServiceError) => {
//                    console.error('authentication error:', error);
                    // delete cached user data
                    this.loggedIn = false;
                    this.loading = false;
                    // this.errorMessage = error;
                }
            );
    }

    logout() {
        this.loading = true;
        this._usersService.logout();
        // switch button to login
        this.loggedIn = false;
        this.loading = false;
    }

    login() {
        const dialogRef = this._dialog.open(LoginFormComponent, {
            hasBackdrop: true
        });

        dialogRef.afterClosed()
            .subscribe(() => {
                this.loading = true;
                // refresh parent component
                this.authenticate();
                this.loading = false;
            });
    }
}
