import { Component, OnInit } from '@angular/core';
import { ApiServiceError, AuthenticationRequestPayload, User, UsersService } from '@knora/core';
import { Example } from '../../../app.interfaces';

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
            
            // the services from @knora/core should be public,
            // if you want to use the loading status in the html template
            // --> usersService.loading = true | false
            constructor(public usersService: UsersService) { }

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

    exampleAuthenticate: Example = {
        title: 'authenticate() / login(\'email\',\'password\') / logout()',
        subtitle: 'returns if a user is logged-in or not',
        name: 'authenticate',
        code: {
            html: ``,
            ts: `
            isLoggedIn: boolean = false;
            errorMessage: ApiServiceError;

            // the services from @knora/core should be public,
            // if you want to use the loading status in the html template
            // --> usersService.loading = true | false
            constructor(public usersService: UsersService) { }

            [...]
            
            this.usersService.authenticate()
            .subscribe(
                (result: any) => {
                    // if result == true: a user is logged-in,
                    // in case of an error (ApiServiceError), the current user is not authorized to do something
                    this.isLoggedIn = result;
                },
                (error: ApiServiceError) => {
                    this.isLoggedIn = false;
                    this.errorMessage = error;
                }
            );`,
            scss: ``
        }
    }

    userSimData: AuthenticationRequestPayload = {
        email: 'root@example.com',
        password: 'test1234'
    };

    allUsers: User[];

    user: User;

    isLoggedIn: boolean = false;

    errorMessage: ApiServiceError;

    constructor(public usersService: UsersService) {
    }

    ngOnInit() {
        this.getAllUsers();
        this.simulateAuthentication();
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

    simulateAuthentication() {
        this.usersService.authenticate()
            .subscribe(
                (result: any) => {
                    // if result == true: a user is logged-in,
                    // in case of an error (ApiServiceError), the current user is not authorized to do something
                    this.isLoggedIn = result;
                },
                (error: ApiServiceError) => {
                    this.isLoggedIn = false;
                    this.errorMessage = error;
                }
            );
    }

    login(data: AuthenticationRequestPayload) {
        this.usersService.login(data.email, data.password)
            .subscribe(
                (result: any) => {
                    this.isLoggedIn = result;
                    // console.log('simulateLogin: ', result);
                },
                (error: ApiServiceError) => {
                    this.errorMessage = error;
                    // console.error('simulateLogin: ', error);
                }
            );
    }

    logout() {
        this.usersService.logout();
        this.simulateAuthentication();
    }
}
