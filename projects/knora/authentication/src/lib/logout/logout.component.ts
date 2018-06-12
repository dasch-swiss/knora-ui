import { Component, OnInit } from '@angular/core';
import {UsersService} from '@knora/core';

@Component({
  selector: 'kui-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.css']
})
export class LogoutComponent implements OnInit {

  constructor(private _usersService: UsersService) { }

  ngOnInit() {
    this.logout();
  }

  logout() {
    this._usersService.logout();
    // console.log('I am logout');
  }

}
