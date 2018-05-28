import {Component, OnInit} from '@angular/core';
import {ApiServiceError, AuthenticationService, AuthenticationRequestPayload} from '@knora/core';
import {NavigationEnd, Router} from '@angular/router';

@Component({
    selector: 'app-authentication',
    templateUrl: './authentication.component.html',
    styleUrls: ['./authentication.component.scss']
})
export class AuthenticationComponent implements OnInit {

    userSimData: AuthenticationRequestPayload = {
        email: 'root@example.com',
        password: 'test'
    };
    isLoggedIn: boolean = false;

    errorMessage: ApiServiceError;

    constructor(public authenticationService: AuthenticationService,
                private _router: Router){
        // override the route reuse strategy
        this._router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };

        this._router.events.subscribe((evt) => {
            if (evt instanceof NavigationEnd) {
                // trick the Router into believing it's last link wasn't previously loaded
                this._router.navigated = false;
                // if you need to scroll back to top, here is the right place
                window.scrollTo(0, 0);
            }
        });

    }

    ngOnInit() {
        this.simulateAuthentication();
    }

    simulateAuthentication() {
        this.authenticationService.authenticate()
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

        this.authenticationService.login(data.email, data.password)
            .subscribe(
                (result: any) => {
                    console.log('simulateLogin: ', result);
                    window.location.reload();
                },
                (error: ApiServiceError) => {
                    console.error('simulateLogin: ', error);
                    this.errorMessage = error;
                }
            );
    }

    logout() {
        this.authenticationService.logout();
        this.simulateAuthentication();
    }

}
