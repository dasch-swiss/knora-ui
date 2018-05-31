import {Component, OnChanges, OnInit} from '@angular/core';
import {ApiServiceError, AuthenticationRequestPayload, UsersService} from '@knora/core';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit, OnChanges {

    userSimData: AuthenticationRequestPayload = {
        email: 'root@example.com',
        password: 'test1234'
    };

    isLoggedIn: boolean = false;

    errorMessage: ApiServiceError;

    constructor(public usersService: UsersService) {


    }

    ngOnInit() {
        this.simulateAuthentication();
    }

    ngOnChanges() {
        this.simulateAuthentication();
    }

    simulateAuthentication() {
        this.usersService.authenticate()
            .subscribe(
                (result: any) => {
                    // if result == true: a user is logged-in,
                    // in case of an error (ApiServiceError), the current user is not authorized to do something
                    this.isLoggedIn = result;
                },
                (error: ApiServiceError) => {
                    this.isLoggedIn = false;
                    this.errorMessage = error;
                }
            );
    }

    login(data: AuthenticationRequestPayload) {

        console.log(data);

        this.usersService.login(data.email, data.password)
            .subscribe(
                (result: any) => {
                    this.isLoggedIn = result;
                    // console.log('simulateLogin: ', result);
                },
                (error: ApiServiceError) => {
                    this.errorMessage = error;
                    // console.error('simulateLogin: ', error);
                }
            );
    }

    logout() {
        this.usersService.logout();
        this.simulateAuthentication();
    }

}
