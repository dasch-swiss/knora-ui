import { Component, Input, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { AuthenticationCacheService, CurrentUser, UsersService } from '@knora/core';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    module = AppDemo.authenticationModule;

    user: any;

    @Input()
    set id(id: string) {
        /*
        this.user = this._acs.get(id, this._usersService.getUserByEmail(id));
        console.log('login comp in demo app: this.user from acs', this.user);
        */
    }

    constructor(// private _acs: AuthenticationCacheService,
                private _usersService: UsersService) {
    }

    ngOnInit() {

//        this._acs.get('token');
/*
            .subscribe(
            data => {
                // data from child component: projectComponent
                console.log('login component (get Data)', data);
            },
            error => {
                console.error(error);
            }
        );
*/

    }

    public getUserInfo(user: CurrentUser): void {
        console.log('login component (output)', user);
    }

}
