import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiServiceError, ApiServiceResult } from '@knora/core';
import { AuthenticationService } from '../authentication.service';
import { SessionService } from '../session/session.service';

@Component({
    selector: 'kui-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    /**
     * @param {string} [navigate]
     * navigate to the defined url after successful login
     */
    @Input() navigate?: string;

    /**
     * @param {string} [color]
     * set your theme color here,
     * it will be used in the progress-indicator
     */
    @Input() color?: string;

    @Output() status: EventEmitter<any> = new EventEmitter<any>();

    returnUrl: string;

    // is there already a valid session?
    loggedInUser: string;

    // form
    frm: FormGroup;

    loading = false;

    // general error message
    errorMessage: any;

    // specific error messages
    loginErrorUser = false;
    loginErrorPw = false;
    loginErrorServer = false;

    // labels for the login form
    login = {
        title: 'Login',
        name: 'Username',
        pw: 'Password',
        button: 'Login',
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


    constructor (private _auth: AuthenticationService,
        private _session: SessionService,
        private _fb: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router) {
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
        this.frm = this._fb.group({
            username: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.frm.valueChanges
            .subscribe(data => this.onValueChanged(data));
    }

    /**
     * @ignore
     *
     * check for errors while using the form
     * @param data
     */
    onValueChanged(data?: any) {

        if (!this.frm) {
            return;
        }

        const form = this.frm;

        Object.keys(this.formErrors).map(field => {
            this.formErrors[field] = '';
            const control = form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                Object.keys(control.errors).map(key => {
                    this.formErrors[field] += messages[key] + ' ';
                });
            }
        });
    }

    doLogin() {

        // reset the error messages
        this.errorMessage = undefined;
        this.loginErrorUser = false;
        this.loginErrorPw = false;
        this.loginErrorServer = false;

        // make sure form values are valid
        if (this.frm.invalid) {
            this.loginErrorPw = true;
            this.loginErrorUser = true;
            return;
        }

        // Reset status
        this.loading = true;

        // Grab values from form
        const username = this.frm.get('username').value;
        const password = this.frm.get('password').value;

        this._auth.login(username, password).subscribe(
            (response: ApiServiceResult) => {

                // we have a token; set the session now
                this._session.setSession(response.body.token, username);

                setTimeout(() => {
                    // get return url from route parameters or default to '/'
                    this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';


                    // go back to the previous route or to the route defined in the @Input if navigate exists
                    if (!this.navigate) {
                        this._router.navigate([this.returnUrl]);
                    } else {
                        this._router.navigate([this.navigate]);
                    }

                    this.loading = false;
                }, 2000);
            },
            (error: ApiServiceError) => {
                // error handling
                if (error.status === 0) {
                    this.loginErrorUser = false;
                    this.loginErrorPw = false;
                    this.loginErrorServer = true;
                }
                if (error.status === 401) {
                    this.loginErrorUser = false;
                    this.loginErrorPw = true;
                    this.loginErrorServer = false;
                }
                if (error.status === 404) {
                    this.loginErrorUser = true;
                    this.loginErrorPw = false;
                    this.loginErrorServer = false;
                }
                this.errorMessage = <any>error;
                this.loading = false;
            }
        );

    }

    logout() {
        this._session.destroySession();
        location.reload(true);
    }

}
