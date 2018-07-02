import { Component, OnInit } from '@angular/core';
import { ApiServiceError, UsersService } from '@knora/core';

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

    constructor(private _usersService: UsersService) {
    }

    ngOnInit() {
        this.authenticate();
    }

    authenticate() {
        this._usersService.authenticate()
            .subscribe(
                (result: boolean) => {
                    // if result == true: a user is logged-in,
                    // in case of an error (ApiServiceError), the current user is not authorized to do something
                    // console.log('authenticate:', result);
                    // this.loggedIn = result;
                    this.loggedIn = result;
                },
                (error: ApiServiceError) => {
                    // console.error('authenticate:', error);
                    this.loggedIn = false;
                    // this.errorMessage = error;
                }
            );
    }
}
