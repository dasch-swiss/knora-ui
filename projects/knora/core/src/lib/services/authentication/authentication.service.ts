import {Inject, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ApiService} from '../api.service';

import {KuiCoreModule} from '../../core.module';
import {
    ApiServiceError,
    ApiServiceResult,
    AuthenticationRequestPayload,
    KnoraApiConfig,
    KuiCoreConfig,
    User
} from '../../declarations';
import {UsersService} from '..';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: KuiCoreModule
})
export class AuthenticationService extends ApiService {

    private token: string;

    protected constructor(public http: HttpClient,
                          @Inject('config') public config: KuiCoreConfig,
                          private _usersService: UsersService) {
        super(http, config);
    }


    /**
     * Checks if the user is logged in or not.
     *
     * @returns {Observable<boolean>}
     */
    authenticate(): Observable<boolean> {
        return this.httpGet('/v2/authentication').pipe(
            map((result: ApiServiceResult) => {
                // console.log('AuthenticationService - authenticate - result: : ', result);
                // return true || false
                return result.status === 200;
            })
        );
    }

    doAuthentication(payload: AuthenticationRequestPayload): Observable<any> {

        const url: string = '/v2/authentication';
        return this.httpPost(url, payload).pipe(
            map((result: ApiServiceResult) => {
                const token = result.body && result.body.token;

                // console.log('AuthenticationService - doAuthentication - result: ', result);

                if (token) {
                    // console.log('AuthenticationService - doAuthentication - token: : ', token);
                    return token;
                } else {
                    // If login does fail, then we would gotten an error back. This case covers
                    // a `positive` login outcome without a returned token. This is a bug in `webapi`
                    throw new Error('Token not returned. Please report this as a possible bug.');
                }
//                result.getBody(AuthenticationResponse);
            }),
            catchError(this.handleJsonError)
        );
    }

    login(email: string, password: string): Observable<any> {

        // new login, so remove anything stale
        this.clearEverything();

        return this.doAuthentication({email, password}).pipe(
            map((token: string) => {
                // console.log('AuthenticationService - login - token: : ', token);

                return this._usersService.getUserByEmail(email)
                    .subscribe(
                        (user: User) => {
                            // console.log('AuthenticationService - login - user: ', user);
                            let isSysAdmin: boolean = false;

                            const permissions = user.permissions;

                            if (permissions.groupsPerProject[KnoraApiConfig.SystemProjectIRI]) {
                                isSysAdmin = permissions.groupsPerProject[KnoraApiConfig.SystemProjectIRI]
                                    .indexOf(KnoraApiConfig.SystemAdminGroupIRI) > -1;
                            }

                            const currentUserObject: any = {
                                email: user.email,
                                token: token,
                                sysAdmin: isSysAdmin,
                                lang: user.lang
                            };

                            // store username and jwt token in local storage to keep user logged in between page refreshes
                            // and set the system admin property to true or false
                            localStorage.setItem('currentUser', JSON.stringify(currentUserObject));

                            return true;
                        },
                        (error: ApiServiceError) => {
                            // console.error('AuthenticationService - login - error: ', error);
                            throw error;
                        }
                    );

            }),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Sends a logout request to the server and removes any variables.
     *
     */
    logout(): void {

        this.httpDelete('/v2/authentication').pipe(
            map((result: ApiServiceResult) => {
                // console.log('AuthenticationService - logout - result:', result);
            }),
            catchError(this.handleJsonError)
        );

        // clear token remove user from local storage to log user out
        this.clearEverything();
    }

    /**
     * Clears any variables set during authentication in local and session storage
     *
     */
    protected clearEverything(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
        localStorage.removeItem('lang');
        sessionStorage.clear();
    }

    /*
    protected extractCurrentUser(user: User, token: string): void {

        // console.log('AuthenticationService - extractCurrentUser - user / token ', user, token);

        let isSysAdmin: boolean = false;

        const permissions = user.permissions;
        if (permissions.groupsPerProject[AppConfig.SystemProject]) {
            isSysAdmin = permissions.groupsPerProject[AppConfig.SystemProject].indexOf(AppConfig.SystemAdminGroup) > -1;
        }

        const currentUserObject: CurrentUser = {
            email: user.email,
            token: token,
            sysAdmin: isSysAdmin
        };

        // store username and jwt token in local storage to keep user logged in between page refreshes
        // and set the system admin property to true or false
        localStorage.setItem('currentUser', JSON.stringify(currentUserObject));
        localStorage.setItem('lang', user.lang);

    }
    */

    /*

    login(email: string, password: string): Observable<any> {

        // new login, so remove anything stale
//        this.clearEverything();

        const authRequest: AuthenticationRequestPayload = {
            email: email,
            password: password
        };

        /*
        this.doAuthentication(authRequest)
            .subscribe(
                (result: any) => {
                    console.log('login: ', result);
                },
                (error: ApiServiceError) => {
                    console.error('login: ', error);
                }
            );
            *
    }


/*

        return this.doAuthentication(authRequest)
        // end of first observable. now we need to chain it with the second.
        // the flatMap has the return value of the first observable as the input parameter.
            .flatMap(
                (token: string) => {
                    // get the user information
                    return this._userService.getUserByEmail(email)
                        .map(
                            (user: User) => {

                                // console.log("AuthenticationService - login - user: ", user);

                                // extract user information and and write them to local storage
                                this.extractCurrentUser(user, token);

                                // get the project permissions and write them to session storage
                                this.extractProjectPermissions(user);

                                // return true to indicate successful login
                                return true;
                            },
                            (error: ApiServiceError) => {
                                console.log(error);
                                console.error('AuthenticationService - login - getUserByEmail error: ' + error);

                                // there was an error during login. remove anything from local storage
                                localStorage.removeItem('currentUser');
                                localStorage.removeItem('lang');

                                // throw error
                                throw error;
                            });
                });
    };

    /*
        return this.httpGet('/v2/authentication')
            .map(
                (result: ApiServiceResult) => {

                    if (result.status === 200) {
                        // the stored credentials (token) is valid and a user is authenticated by the api server
                        return true;
                    } else {
                        // the session is not valid!
                        this.clearEverything();
                        return false;
                    }
                },
                (error: ApiServiceError) => {
                    const errorMessage = <any>error;
                    console.error('AuthenticationService - authenticate - error: ' + errorMessage);
                    throw error;
                });
    }

    /*

    createProject(data: any): Observable<Project> {
        const url: string = '/admin/projects';
        return this.httpPost(url, data).pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectResponse).project),
            catchError(this.handleJsonError)
        );
    }

    */

    /*
    constructor(_httpClient: HttpClient,
                private _userService: UsersService) {
        super({}, _httpClient);

    }




    /**
     * Sends the authentication payload and returns the authentication token if successful.
     *
     * @param {AuthenticationRequestPayload} payload
     * @returns {Observable<string>}
     *
    doAuthentication(payload: AuthenticationRequestPayload): Observable<any> {

        const url: string = '/admin/projects';
        return this.httpPost(url, payload).pipe(
            map((result: ApiServiceResult) => {
                console.log(result);
                result.getBody(AuthenticationResponse);
            }),
            catchError(this.handleJsonError)
        );
/*

        // console.log('AuthenticationService - doAuthentication - payload: ', payload);

        return this.httpPost('/v2/authentication', payload)
            .map(
                (result: ApiServiceResult) => {
                    // console.log('AuthenticationService - login - result:', result);

                    const token = result.body && result.body.token;

                    if (token) {
                        return token;
                    } else {
                        // If login does fail, then we would gotten an error back. This case covers
                        // a `positive` login outcome without a returned token. This is a bug in `webapi`
                        throw new Error('Token not returned. Please report this as a possible bug.');
                    }
                },
                (error: ApiServiceError) => {
                    const errorMessage = <any>error;
                    console.error('AuthenticationService - doAuthentication - error: ' + errorMessage);
                    throw error;
                });

                *
    }



    /**
     * Extracts email and token, and stores it in local storage under current user.
     *
     * @param {User} user
     * @param {string} token
     *
    extractCurrentUser(user: User, token: string): void {

        // console.log('AuthenticationService - extractCurrentUser - user / token ', user, token);

        let isSysAdmin: boolean = false;

        const permissions = user.permissions;
        if (permissions.groupsPerProject[AppConfig.SystemProject]) {
            isSysAdmin = permissions.groupsPerProject[AppConfig.SystemProject].indexOf(AppConfig.SystemAdminGroup) > -1;
        }

        const currentUserObject: CurrentUser = {
            email: user.email,
            token: token,
            sysAdmin: isSysAdmin
        };

        // store username and jwt token in local storage to keep user logged in between page refreshes
        // and set the system admin property to true or false
        localStorage.setItem('currentUser', JSON.stringify(currentUserObject));
        localStorage.setItem('lang', user.lang);

    }

    /**
     * Extracts permission information from the user object and writes them to session storage
     *
     * @param {User} user
     * @returns {any}
     *
    extractProjectPermissions(user: User): void {

        // console.log('AuthenticationService - extractProjectPermissions - user ', user);

        const permissions: PermissionData = user.permissions;
        const projectsList: string[] = [];
        let isSysAdmin: boolean = false;

        if (permissions.groupsPerProject[AppConfig.SystemProject]) {
            isSysAdmin = permissions.groupsPerProject[AppConfig.SystemProject].indexOf(AppConfig.SystemAdminGroup) > -1;
        }

        if (isSysAdmin) {
            // the user is system admin and has all permission rights in every project
            // get all projects and set projectAdmin to true for every project
            this._projectsService.getAllProjects().subscribe(
                (projects: Project[]) => {
                    for (const p of projects) {
                        projectsList.push(p.id);
                    }
                    sessionStorage.setItem('projectAdmin', JSON.stringify(projectsList));
                },
                (error: ApiServiceError) => {
                    console.log(error);
                    sessionStorage.removeItem('projectAdmin');
                }
            );
        } else {
            // get the projects, where the user is admin of
            for (const project in permissions.groupsPerProject) {
                if (permissions.groupsPerProject[project].indexOf(AppConfig.ProjectAdminGroup) > -1) {
                    projectsList.push(project);
                }
            }
            sessionStorage.setItem('projectAdmin', JSON.stringify(projectsList));
        }

    }






    */

}
