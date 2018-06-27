import { Component, OnInit, OnChanges } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { ApiServiceError, UsersService } from '@knora/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {

    module = AppDemo.authenticationModule;

    loggedIn: boolean;

    errorMessage: any;

    constructor(private _usersService: UsersService) { }

    ngOnInit() {

        // 1) check if a user is already logged in
        this.authenticate();

        // 2) show a logout button or the login form
        // depending on the first action in ngOnInit

    }

    ngOnChanges() {
        this.authenticate();
    }

    authenticate() {
        this._usersService.authenticate()
            .subscribe(
                (result: any) => {
                    // if result == true: a user is logged-in,
                    // in case of an error (ApiServiceError), the current user is not authorized to do something
                    console.log('authenticate:', result);
                    this.loggedIn = result;
                },
                (error: ApiServiceError) => {
                    console.error('authenticate:', error);
                    this.loggedIn = false;
                    this.errorMessage = error;
                }
            );
    }


    /*
        simulateAuthentication() {
            this.usersService.authenticate()
                .subscribe(
                    (result: any) => {
                        // if result == true: a user is logged-in,
                        // in case of an error (ApiServiceError), the current user is not authorized to do something
                        console.log('simulateAuthentication:', result);
                        this.isLoggedIn = result;
                    },
                    (error: ApiServiceError) => {
                        console.error('simulateAuthentication:', error);
                        this.isLoggedIn = false;
                        this.errorMessage = error;
                    }
                );
        }
         */
}
