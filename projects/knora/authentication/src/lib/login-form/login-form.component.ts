import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiServiceError, KuiCoreConfig, SimpleCacheService, UsersService } from '@knora/core';

@Component({
    selector: 'kui-login-form',
    templateUrl: './login-form.component.html',
    styleUrls: ['./login-form.component.scss']
})
export class LoginFormComponent implements OnInit {

    /**
     * navigate to the defined url after login
     */
    @Input() navigate: string;

    @Output() authenticate: EventEmitter<any> = new EventEmitter<any>();

    loading: boolean = false;

    errorMessage: any;
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

    // reactive form setup
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

    constructor(@Inject('config') public config: KuiCoreConfig,
                private _scs: SimpleCacheService,
                private _usersService: UsersService,
                //                public dialogRef: MatDialogRef<LoginFormComponent>,
                private _formBuilder: FormBuilder) {
    }

    ngOnInit() {
        if (this.config.name !== undefined && this.config.name !== '') {
            this.login.title += ' to ' + this.config.name;
        }
        this.buildForm();
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


    submitData(): void {
        // reset the error messages
        this.loginErrorUser = false;
        this.loginErrorPw = false;
        this.loginErrorServer = false;

        // show the progress indicator
        this.loading = true;

        // login by using the usersService from @knora/core
        this._usersService.login(this.loginForm.controls['email'].value, this.loginForm.controls['password'].value).subscribe(
            (result: any) => {
                // the result will be set in local storage
                // (as a temporary solution only!) TODO: replace it with a cache service (e.g. http://www.syntaxsuccess.com/viewarticle/caching-with-rxjs-observables-in-angular-2.0)
                // here I should get back the user data or at least the currentUserObject incl.
                // email, token, sysAdmin (true || false), language
                console.log('login-form', result);
                // send the data to the parent component (output)
                this.authenticate.emit(result);

                // store the data in the cache service (authentication cache service)
                this._scs.sendData(result);


                // get the information from the cache, because the login is handled by the usersService (from core module), which has all the user's information

                /*
                this.loading = false;
                // after successful login, go to the defined url (if there's one)
                if (this.navigate) {
                    window.location.replace(this.navigate);
                } else {
//                    this.dialogRef.close();
                }
                */
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
                this.errorMessage = <any> error;
                this.loading = false;
            }
        );

    }

}
