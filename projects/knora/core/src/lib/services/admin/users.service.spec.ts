import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { HttpErrorHandler } from '../http-error-handler.service';
import { MessageService } from '../message.service';
import { UsersService } from './users.service';
import { async, TestBed } from '@angular/core/testing';
import { ApiServiceError, User, UsersResponse } from '../../declarations';
import { KuiCoreModule } from '../../core.module';

fdescribe('UsersService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let usersService: UsersService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Import the HttpClient mocking services
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            // Provide the service-under-test and its dependencies
            providers: [
                ApiService,
                UsersService,
                HttpErrorHandler,
                MessageService

            ]
        });

        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        usersService = TestBed.get(UsersService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    fdescribe('#getUsers', () => {
        let expectedUsers: User[];

        beforeEach(() => {
            usersService = TestBed.get(UsersService);
//            const adminData = require('../../test-data/admin/shared-test-data.ts');

            expectedUsers = [{'familyName': 'Admin-alt', 'givenName': 'Administrator-alt', 'email': 'root-alt@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/91e19f1e01', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User', 'givenName': 'User02', 'email': 'user02.user@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/97cec4000f', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User01', 'givenName': 'Anything', 'email': 'anything.user01@example.org', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/9XBCrDV3SRa7kS1WwynB4Q', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'Admin', 'givenName': 'Anything', 'email': 'anything.admin@example.org', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/AnythingAdminUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User02', 'givenName': 'Anything', 'email': 'anything.user02@example.org', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/BhkfBc3hTeS_IDo-JgXRbQ', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'BEOL', 'givenName': 'BEOL', 'email': 'beol@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'BEOL', 'givenName': 'BEOL', 'email': 't.schweizer@unibas.ch', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGF', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'biblio', 'givenName': 'biblio', 'email': 'biblio@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/Q-6Sssu8TBWrcCGuVJ0lVw', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'Test', 'givenName': 'User', 'email': 'user.test@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/b83acc5f05', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User', 'givenName': 'User01', 'email': 'user01.user1@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/c266a56709', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User', 'givenName': 'User03', 'email': 'images-reviewer-user@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/images-reviewer-user', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User', 'givenName': 'Inactive', 'email': 'inactive.user@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/inactiveuser', 'status': false, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User2', 'givenName': 'Test', 'email': 'test.user2@test.ch', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/incunabulaMemberUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User', 'givenName': 'Multi', 'email': 'multi.user@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/multiuser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User', 'givenName': 'Normal', 'email': 'normal.user@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/normaluser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'Administrator', 'givenName': 'System', 'email': 'root@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/root', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'User', 'givenName': 'Super', 'email': 'super.user@example.com', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/superuser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'Webern', 'givenName': 'Admin', 'email': 'webern-admin@example.ch', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/webernProjectAdmin', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'Webern', 'givenName': 'Nutzer', 'email': 'webern-nutzer@example.ch', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://rdfh.ch/users/webernProjectMember', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null}, {'familyName': 'Anonymous', 'givenName': 'Knora', 'email': 'anonymous@localhost', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://www.knora.org/ontology/knora-base#AnonymousUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'en', 'password': null}, {'familyName': 'System', 'givenName': 'Knora', 'email': 'system@localhost', 'permissions': {'groupsPerProject': {}, 'administrativePermissionsPerProject': {}}, 'groups': [], 'id': 'http://www.knora.org/ontology/knora-base#SystemUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'en', 'password': null}] as User[];

        });

        it('should return expected users (called once)', () => {

            usersService.getAllUsers()
                .subscribe(
                    (users: User[]) => {

                        console.log('users', users);
                        console.log('expected', expectedUsers);

                        expect(users).toEqual(expectedUsers, 'should return expected users');
                    },
                    (error: ApiServiceError) => {
                        fail(error);
                    }
                );

            // usersService should have made one request to GET users from expected URL
            const req = httpTestingController.expectOne( usersService.usersUrl, 'expect one url' );

            // TODO: fix the following setup. It doesn't work with our own ApiService configuration
            expect(req.request.method).toEqual('GET');

            // Respond with the mock users
            req.flush(expectedUsers);
        });


        /*
        it('should be OK returning no users', () => {

            usersService.getAllUsers().subscribe(
                users => expect(users.length).toEqual(0, 'should have empty users array'),
                fail
            );

            const req = httpTestingController.expectOne(usersService.usersUrl);
            req.flush([]); // Respond with no users
        });

        // This service reports the error but finds a way to let the app keep going.
        it('should turn 404 into an empty users result', () => {

            usersService.getAllUsers().subscribe(
                users => expect(users.length).toEqual(0, 'should return empty users array'),
                fail
            );

            const req = httpTestingController.expectOne(usersService.usersUrl);

            // respond with a 404 and the error message in the body
            const msg = 'deliberate 404 error';
            req.flush(msg, {status: 404, statusText: 'Not Found'});
        });

        it('should return expected users (called multiple times)', () => {

            usersService.getAllUsers().subscribe();
            usersService.getAllUsers().subscribe();
            usersService.getAllUsers().subscribe(
                users => expect(users).toEqual(expectedUsers, 'should return expected users'),
                fail
            );

            const requests = httpTestingController.match(usersService.usersUrl);
            expect(requests.length).toEqual(3, 'calls to getusers()');

            // Respond to each request with different mock hero results
            requests[0].flush([]);
            requests[1].flush([{id: 1, name: 'bob'}]);
            requests[2].flush(expectedUsers);
        });
        */
    });
});
