import {Component, OnInit} from '@angular/core';
import {ApiServiceError, AuthenticationService, AuthenticationRequestPayload} from '@knora/core';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

    loginSimData: AuthenticationRequestPayload = {
        email: 'root@example.com',
        password: 'test'
    };

    errorMessage: ApiServiceError;

    constructor(private _authenticationService: AuthenticationService) {
    }

    ngOnInit() {

        this._authenticationService.authenticate()
            .subscribe(
                (result: any) => {
                    console.log('authenticate: ', result);
                },
                (error: ApiServiceError) => {

                    this.errorMessage = error;
                    console.error('authenticate: ', error);
                }
            );
    }

    simulateLogin(data: AuthenticationRequestPayload) {
        this._authenticationService.login(data.email, data.password)
            .subscribe(
                (result: any) => {
                    console.log('simulateLogin: ', result);
                },
                (error: ApiServiceError) => {

                    this.errorMessage = error;
                    console.error('simulateLogin: ', error);
                }
            );
    }

}
