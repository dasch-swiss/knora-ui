import {Component, OnInit} from '@angular/core';
import {ApiServiceError, User, UsersService} from '@knora/core';
import {Example} from '../../../app.interfaces';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    exampleGetAllUsers: Example = {
        title: 'getAllUsers()',
        subtitle: 'returns a list of all users in Knora',
        name: 'getAllUsers',
        code: {
            html: `
        <div *ngIf="allUsers && !usersService.loading">
            <mat-card-subtitle>Result</mat-card-subtitle>

            <ul>
                <li class="link" *ngFor="let u of allUsers" (click)="getUser(u.email)" >
                    <strong>{{u.familyName}}, </strong>
                    {{u.givenName}} ({{u.email}})
                </li>
            </ul>
        </div>
            `,
            ts: `public allUsers: User[];
            [...]
            this.usersService.getAllUsers()
                .subscribe(
                    (result: User[]) => {
                        this.allUsers = result;
                    },
                    (error: ApiServiceError) => {
                        console.error(error);
                    }
            );`,
            scss: ``
        }
    };


    allUsers: User[];

    user: User;

    constructor(public usersService: UsersService) {
    }

    ngOnInit() {
        this.getAllUsers();
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

    getUser(email: string) {
        this.usersService.getUserByEmail(email)
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
