import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '@knora/core';
import { first } from 'rxjs/operators';

@Component({
    selector: 'kui-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    loginForm: FormGroup;

    loading = false;
    submitted = false;
    returnUrl: string;

    errorMessage: any;
    loginErrorUser = false;
    loginErrorPw = false;
    loginErrorServer = false;


    // labels for the login form
    label = {
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

    formErrors = {
        'email': '',
        'password': ''
    };

    validationMessages = {
        'email': {
            'required': 'user name is required.'
        },
        'password': {
            'required': 'password is required'
        }
    };

    constructor(
        private _formBuilder: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _authService: AuthService) {
    }

    ngOnInit() {
        this.buildForm();

        // reset login status
        // TODO: uncomment later; this makes sense in case of an own /login page
        // this._authenticationService.logout();

        // get return url from route parameters or default to '/'
        this.returnUrl = this._route.snapshot.queryParams['returnUrl'] || '/';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    // WARNING: TODO: remove the email and password before publishing!!!!!!!!!!!!!
    buildForm(): void {
        this.loginForm = this._formBuilder.group({
            email: ['root@example.com', Validators.required],
            password: ['test', Validators.required]
        });

        this.loginForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }

    /**
     * check for errors while using the form
     * @param data
     */
    onValueChanged(data?: any) {

        if (!this.loginForm) {
            return;
        }

        const form = this.loginForm;

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


    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.loginForm.invalid) {
            return;
        }

        this.loading = true;
        this._authService.login(this.f.email.value, this.f.password.value)
            .pipe(first())
            .subscribe(
                data => {
                    this._router.navigate([this.returnUrl]);
                },
                error => {
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
                    this.errorMessage = <any> error;
                    this.loading = false;
                });
    }

}
