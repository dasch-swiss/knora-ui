import { Component, Input, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.demo';
import { CurrentUser } from '@knora/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    module = AppDemo.authenticationModule;

    user: any;

    constructor() {
    }

    ngOnInit() {

    }

}
