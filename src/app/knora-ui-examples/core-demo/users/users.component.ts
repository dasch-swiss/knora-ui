import { Component, OnInit } from '@angular/core';
import { ApiServiceError, User, UsersService } from '@knora/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    module = AppDemo.coreModule;

    exampleGetAllUsers: Example = {
        title: 'getAllUsers()',
        subtitle: 'returns a list of all users in Knora',
        name: 'getAllUsers',
        code: {
            html: `
<div *ngIf="allUsers && !usersService.loading">
    <ul>
        <li *ngFor="let u of allUsers">
            <strong>{{u.familyName}}, </strong>
            {{u.givenName}} ({{u.email}})
        </li>
    </ul>
</div>
            `,
            ts: `
public allUsers: User[];

constructor(public usersService: UsersService) { }

ngOnInit() {

    this.usersService.getAllUsers().subscribe(
        (result: User[]) => {
            this.allUsers = result;
        },
        (error: ApiServiceError) => {
            console.error(error);
        }
    );
}`,
            scss: ``
        }
    };

    exampleGetUser: Example = {
        title: 'getUser(username || email || iri)',
        subtitle: 'returns a user object',
        name: 'getUser',
        code: {
            html: `
<div *ngIf="user && !usersService.loading">
    <p><strong>{{user.familyName}},</strong> {{user.givenName}} ({{user.username}})</p>
</div>
            `,
            ts: `
username: string = 'multiuser';
user: User;

            
// the services from @knora/core should be public,
// if you want to use the loading status in the html template
// --> usersService.loading = true || false
constructor(public usersService: UsersService) { }

ngOnInit() {            
    this.usersService.getUser(this.username).subscribe(
        (result: User) => {
            this.user = result;
        },
        (error: ApiServiceError) => {
            console.error(error);
        }
    );
}`,
            scss: ``
        }
    };

    allUsers: User[];

    user: User;

    isLoggedIn: boolean = false;

    errorMessage: ApiServiceError;

    constructor(public usersService: UsersService) {
    }

    ngOnInit() {
        this.getAllUsers();
        this.getUser('multiuser');
    }

    getAllUsers() {
        this.usersService.getAllUsers()
            .subscribe(
                (result: User[]) => {
                    this.allUsers = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

    getUser(identifier: string) {
        this.usersService.getUser(identifier)
            .subscribe(
                (result: User) => {
                    this.user = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );
    }

}
