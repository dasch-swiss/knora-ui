import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    module = AppDemo.authenticationModule;

    errorMessage: any;

    constructor() {
    }

    ngOnInit() {

    }

}
