import {Component, OnInit} from '@angular/core';
import {ApiServiceError, Project, User, UsersService} from '@knora/core';

@Component({
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

    allUsers: User[];

    user: User;

    tsExampleGetAllUsers = `
        this.usersService.getAllUsers()
            .subscribe(
                (result: User[]) => {
                    this.allUsers = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );`;

    tsExampleGetProjectByEmail = `
        this.usersService.getUserByEmail(email)
            .subscribe(
                (result: User) => {
                    this.user = result;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                }
            );`;

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
