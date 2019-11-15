import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiResponseData, ApiResponseError, KnoraApiConnection, LoginResponse, LogoutResponse } from '@knora/api';
import { KnoraApiConnectionToken, Session, SessionService } from '@knora/core';

@Component({
    selector: 'kui-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {
    /**
     * Navigate to the defined url (or path) after successful login
     *
     * @param  {string} [navigate]
     */
    @Input() navigate?: string;

    /**
     * Set your theme color here,
     * it will be used in the progress-indicator and the buttons
     *
     * @param {string} [color]
     */
    @Input() color?: string;

    /**
     * Emits true when the login process was successful and false in case of error on login or false after logout process
     *
     * @param  {EventEmitter<boolean>} status
     *
     */
    @Output() status: EventEmitter<boolean> = new EventEmitter<boolean>();

    // is there already a valid session?
    session: Session;

    // form
    form: FormGroup;

    // show progress indicator
    loading: boolean = false;

    // general error message
    errorMessage: ApiResponseError;

    // specific error messages
    loginErrorUser = false;
    loginErrorPw = false;
    loginErrorServer = false;

    // labels for the login form
    // TODO: should be handled by translation service (i18n)
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
        private _session: SessionService,
        private _fb: FormBuilder
    ) { }

    ngOnInit() {
        // if session is valid (a user is logged-in) show a message, otherwise build the form
        if (this._session.validateSession()) {
            this.session = JSON.parse(localStorage.getItem('session'));
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

    /**
     * Login and set session
     */
    login() {

        this.loading = true;

        // reset the error messages
        this.errorMessage = undefined;

        // Grab values from form
        const identifier = this.form.get('username').value;
        const password = this.form.get('password').value;

        const identifierType: 'iri' | 'email' | 'username' = (identifier.indexOf('@') > -1 ? 'email' : 'username');

        this.knoraApiConnection.v2.auth.login(identifierType, identifier, password).subscribe(
            (response: ApiResponseData<LoginResponse>) => {

                this._session.setSession(response.body.token, identifier, identifierType);

                setTimeout(() => {
                    this.status.emit(true);
                    this.loading = false;
                }, 2200);
            },
            (error: ApiResponseError) => {
                // error handling
                this.loginErrorUser = (error.status === 404);
                this.loginErrorPw = (error.status === 401);
                this.loginErrorServer = (error.status === 0);

                this.errorMessage = error;

                this.loading = false;
                // TODO: update error handling similar to the old method (see commented code below)
            }
        );
    }

    /**
     * Logout and destroy session
     *
     */
    logout() {
        this.loading = true;

        this.knoraApiConnection.v2.auth.logout().subscribe(
            (response: ApiResponseData<LogoutResponse>) => {
                this.status.emit(response.body.status === 0);
                this._session.destroySession();
                this.loading = false;
            },
            (error: ApiResponseError) => {
                console.error(error);
                this.loading = false;
            }
        );

    }

}
