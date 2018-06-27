import {Component, OnInit} from '@angular/core';
import {UsersService} from '@knora/core';

@Component({
    selector: 'kui-logout',
    templateUrl: './logout.component.html',
    styleUrls: ['./logout.component.scss']
})
export class LogoutComponent implements OnInit {

    constructor(private _usersService: UsersService) {
    }

    ngOnInit() {

    }

    logout() {
        this._usersService.logout();
    }

}
