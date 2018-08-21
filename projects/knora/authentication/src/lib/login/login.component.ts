import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiServiceError, AuthenticationResponse, User, UsersService } from '@knora/core';
import { AuthenticationService } from '../authentication.service';
import { SessionService } from '../session/session.service';

@Component({
    selector: 'kui-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public frm: FormGroup;

    public loading = false;
    public hasFailed = false;
    public showInputErrors = false;


    constructor(private _auth: AuthenticationService,
                private _session: SessionService,
                private _users: UsersService,
                private _fb: FormBuilder,
                private _router: Router) {
        this.frm = _fb.group({
            username: ['root@example.com', Validators.required],
            password: ['test', Validators.required]
        });
    }

    ngOnInit() {
    }


    public doSignIn() {

        // make sure form values are valid
        if (this.frm.invalid) {
            this.showInputErrors = true;
            return;
        }

        // Reset status
        this.loading = true;
        this.hasFailed = false;

        // Grab values from form
        const username = this.frm.get('username').value;
        const password = this.frm.get('password').value;

        this._auth.login(username, password)
            .subscribe(
                (response: any) => {

                    // console.log('login component -- login -- _auth.login response', response);

                    this.loading = false;
                    // TODO: go back to the previous route
                    this._router.navigate(['/']);
                },
                (error) => {
                    this.loading = false;
                    this.hasFailed = true;
                }
            );

    }


}
