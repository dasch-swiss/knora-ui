import { Component, OnInit } from '@angular/core';
import { ApiServiceError, UsersService } from '@knora/core';

@Component({
    selector: 'kui-button',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.css']
})
export class ButtonComponent implements OnInit {

    loggedIn: boolean;

    errorMessage: any;

    constructor(private _usersService: UsersService) { }

    ngOnInit() {
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

    login() {
        // do something... e.g. go to / open login form
    }

    logout() {
        this._usersService.logout();
    }
}
