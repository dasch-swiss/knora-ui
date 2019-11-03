import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, LoginResponse, LogoutResponse } from '@knora/api';
import { KnoraApiConnectionToken } from '@knora/core';
import { AuthenticationService } from '../authentication.service';
import { SessionService } from '../session/session.service';

@Component({
    selector: 'kui-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    /**
     * @deprecated This will be removed in the next major release; this should be handled by the app itself with the new Output parameter called 'status'
     * @param {string} [navigate]
     * navigate to the defined url after successful login
     */
    @Input() navigate?: string;

    /**
     * @param {string} [color]
     * set your theme color here,
     * it will be used in the progress-indicator and login button
     */
    @Input() color?: string;

    /**
     * @param  {EventEmitter<boolean>} status
     *
     * Emits true when the login process was successful and false in case of error on login or false after logout process
     */
    @Output() status: EventEmitter<boolean> = new EventEmitter<boolean>();

    returnUrl: string;

    // is there already a valid session?
    loggedInUser: string;

    // form
    form: FormGroup;

    loading = false;

    // general error message
    errorMessage: any;

    // specific error messages
    loginErrorUser = false;
    loginErrorPw = false;
    loginErrorServer = false;

    // labels for the login form
    formLabel = {
        title: 'Login here',
        name: 'Username',
        pw: 'Password',
        submit: 'Login',
        retry: 'Retry',
        logout: 'LOGOUT',
        remember: 'Remember me',
        forgot_pw: 'Forgot password?',
        error: {
            failed: 'Password or username is wrong',
            server: 'There\'s an error with the server connection. Try it again later or inform the Knora Team'
        }
    };

    // error definitions for the following form fields
    formErrors = {
        'username': '',
        'password': ''
    };

    // error messages for the form fields defined in formErrors
    validationMessages = {
        'username': {
            'required': 'user name is required.'
        },
        'password': {
            'required': 'password is required'
        }
    };


    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
        private _auth: AuthenticationService,
        private _session: SessionService,
        private _fb: FormBuilder) {
    }


    ngOnInit() {

        // check if a user is already logged in
        if (this._session.validateSession()) {
            this.loggedInUser = JSON.parse(localStorage.getItem('session')).user.name;
        } else {
            this.buildForm();
        }
    }

    buildForm(): void {
        this.form = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

    }

    login() {

        this.loading = true;

        // reset the error messages
        this.errorMessage = undefined;

        // Grab values from form
        const username = this.form.get('username').value;
        const password = this.form.get('password').value;

        this.knoraApiConnection.v2.auth.login(username, password).subscribe(
            (response: ApiResponseData<LoginResponse>) => {

                this._session.setSession(response.body.token, username);

                setTimeout(() => {
                    this.status.emit(true);
                    this.loading = false;
                }, 2200);
            },
            (error: ApiResponseError) => {
                console.error(error);
                // TODO: update error handling similar to the old method (see commented code below)
            }
        );

        /*
        this._auth.login(username, password).subscribe(
            (response: string) => {

                this._session.setSession(response, username);

                // successfull login: send status true to parent after a short timeout,
                // because of the localStorage session setup which needs some time
                setTimeout(() => {
                    this.status.emit(true);
                    this.loading = false;
                }, 2200);

            },
            (error: ApiServiceError) => {
                // error handling
                this.loginErrorUser = (error.status === 404);
                this.loginErrorPw = (error.status === 401);
                this.loginErrorServer = (error.status === 0);

                this.errorMessage = <any>error;
                this.loading = false;
            }
        );
        */

    }

    logout() {

        this.knoraApiConnection.v2.auth.logout().subscribe(
            (response: ApiResponseData<LogoutResponse>) => {
                this.status.emit(response.body.status === 0);
                this.loading = false;
            },
            (error: ApiResponseError) => {
                console.error(error);
                this.loading = false;
            }
        );

    }

}
