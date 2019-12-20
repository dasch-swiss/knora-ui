import { Component, OnInit } from '@angular/core';

import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    module = AppDemo.actionModule;

    example: Example = {
        title: 'kui-login-form',
        subtitle: 'Creates a login form, if the user is not yet logged-in. Otherwise it shows a logout button',
        name: 'loginform',
        code: {
            html: `
<kui-login-form></kui-login-form>`,
            ts: ``,
            scss: ``
        }
    };

    constructor() {
    }

    ngOnInit() {

    }

}
