import {Component, Inject, OnInit} from '@angular/core';
import {ApiServiceError, KuiCoreConfig, UsersService} from '@knora/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

@Component({
    selector: 'kui-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    errorMessage: any;
    isLoading = false;
    isLoggin: boolean = false;

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

    // signup labels
    signup = {
        title: 'New to Salsah?',
        subtitle: 'Sign up to avail all of our services',
        button: 'Contact us on how'
    };

    loginForm: FormGroup;

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

    constructor(public usersService: UsersService,
                @Inject('config') public config: KuiCoreConfig,
                private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        if (this.config.name !== undefined && this.config.name !== '') {
            this.login.title += ' to ' + this.config.name;
        }
        this.buildForm();
    }


    buildForm(): void {
        this.loginForm = this._formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });

        this.loginForm.valueChanges
            .subscribe(data => this.onValueChanged(data));

    }

    /**
     *
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


    submitData(): void {

        console.log(this.loginForm.value);


        this.usersService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).subscribe(
            (result: boolean) => {

                console.log(result);

                // after successful login, we want to go back to the previous page e.g. search incl. query
                // for this case, we stored the previous url parameters in the current login url as query params
                // let goToUrl = '/';

                /*
                this._route.queryParams.subscribe(
                    data => goToUrl = (data['h'] === undefined ? '/' : data['h'])
                );
                window.location.replace(goToUrl);
                */


            },
            (error: ApiServiceError) => {
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
            }
        );

    }

}
