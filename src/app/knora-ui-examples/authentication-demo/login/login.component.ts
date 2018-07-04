import { Component, OnInit, OnChanges } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { ApiServiceError, UsersService } from '@knora/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnChanges {

    module = AppDemo.authenticationModule;

    loggedIn: boolean;

    errorMessage: any;

    constructor(private _usersService: UsersService) { }

    ngOnInit() {

    }

    ngOnChanges() {
    }

}
