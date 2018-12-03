import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { UsersService } from './users.service';
import { async, inject, TestBed } from '@angular/core/testing';
import { ApiServiceError, ApiServiceResult, User } from '../../declarations';
import { KuiCoreModule } from '../../core.module';
import { imagesUserResponseJson, usersResponseJson } from '../../test-data/admin/shared-test-data';
import { Observable, of } from 'rxjs';

describe('UsersService', () => {
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
                UsersService
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

    describe('#getUsers', () => {

        it('should be created', async(inject(
            [UsersService], (service) => {
                expect(service).toBeDefined();
            }))
        );

        it('should return all users', async(inject([UsersService], (service) => {

            spyOn(service, 'getAllUsers').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = usersResponseJson;

                return of(result);
            });

            expect(usersService).toBeDefined();

            const allUsers: Observable<User[]> = usersService.getAllUsers();

            const users = {
                'users': [{ 'familyName': 'Admin-alt', 'givenName': 'Administrator-alt', 'email': 'root-alt@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/91e19f1e01', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'User02', 'email': 'user02.user@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/97cec4000f', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User01', 'givenName': 'Anything', 'email': 'anything.user01@example.org', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/9XBCrDV3SRa7kS1WwynB4Q', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Admin', 'givenName': 'Anything', 'email': 'anything.admin@example.org', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/AnythingAdminUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User02', 'givenName': 'Anything', 'email': 'anything.user02@example.org', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/BhkfBc3hTeS_IDo-JgXRbQ', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'BEOL', 'givenName': 'BEOL', 'email': 'beol@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'BEOL', 'givenName': 'BEOL', 'email': 't.schweizer@unibas.ch', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGF', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'biblio', 'givenName': 'biblio', 'email': 'biblio@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/Q-6Sssu8TBWrcCGuVJ0lVw', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Test', 'givenName': 'User', 'email': 'user.test@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/b83acc5f05', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'User01', 'email': 'user01.user1@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/c266a56709', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'User03', 'email': 'images-reviewer-user@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/images-reviewer-user', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Inactive', 'email': 'inactive.user@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/inactiveuser', 'status': false, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User2', 'givenName': 'Test', 'email': 'test.user2@test.ch', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/incunabulaMemberUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Multi', 'email': 'multi.user@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/multiuser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Normal', 'email': 'normal.user@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/normaluser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Administrator', 'givenName': 'System', 'email': 'root@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/root', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Super', 'email': 'super.user@example.com', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/superuser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Webern', 'givenName': 'Admin', 'email': 'webern-admin@example.ch', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/webernProjectAdmin', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Webern', 'givenName': 'Nutzer', 'email': 'webern-nutzer@example.ch', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/webernProjectMember', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Anonymous', 'givenName': 'Knora', 'email': 'anonymous@localhost', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://www.knora.org/ontology/knora-base#AnonymousUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'en', 'password': null }, { 'familyName': 'System', 'givenName': 'Knora', 'email': 'system@localhost', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://www.knora.org/ontology/knora-base#SystemUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'en', 'password': null }]
            };

            allUsers.subscribe(
                (result: any) => {
                    const userResult = result.body;
                    expect(userResult.users.length).toBe(21);
                    expect(userResult).toEqual(users);
                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));

        it('should return one user by email', async(inject([UsersService], (service) => {

            spyOn(service, 'getUser').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = imagesUserResponseJson;

                return of(result);
            });

            expect(usersService).toBeDefined();

            const userByEmail: Observable<User> = usersService.getUser('root-alt@example.com');

            const user = {
                'user': { 'familyName': 'User', 'givenName': 'User01', 'email': 'user01.user1@example.com', 'permissions': { 'groupsPerProject': { 'http://rdfh.ch/projects/00FF': ['http://www.knora.org/ontology/knora-base#ProjectMember', 'http://www.knora.org/ontology/knora-base#ProjectAdmin'] }, 'administrativePermissionsPerProject': { 'http://rdfh.ch/projects/00FF': [{ 'name': 'ProjectAdminAllPermission', 'additionalInformation': null, 'v1Code': null }, { 'name': 'ProjectResourceCreateAllPermission', 'additionalInformation': null, 'v1Code': null }] } }, 'groups': [], 'id': 'http://rdfh.ch/users/c266a56709', 'status': true, 'token': null, 'sessionId': null, 'projects': [{ 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }], 'lang': 'de', 'password': null }
            };

            userByEmail.subscribe(
                (result: any) => {
                    expect(result.body).toEqual(user);
                }
            );

        })));

        it('should return one user by iri', async(inject([UsersService], (service) => {

            spyOn(service, 'getUser').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = imagesUserResponseJson;

                return of(result);
            });

            expect(usersService).toBeDefined();

            const userByIri: Observable<User> = usersService.getUser('http://rdfh.ch/users/c266a56709');

            const user = {
                'user': { 'familyName': 'User', 'givenName': 'User01', 'email': 'user01.user1@example.com', 'permissions': { 'groupsPerProject': { 'http://rdfh.ch/projects/00FF': ['http://www.knora.org/ontology/knora-base#ProjectMember', 'http://www.knora.org/ontology/knora-base#ProjectAdmin'] }, 'administrativePermissionsPerProject': { 'http://rdfh.ch/projects/00FF': [{ 'name': 'ProjectAdminAllPermission', 'additionalInformation': null, 'v1Code': null }, { 'name': 'ProjectResourceCreateAllPermission', 'additionalInformation': null, 'v1Code': null }] } }, 'groups': [], 'id': 'http://rdfh.ch/users/c266a56709', 'status': true, 'token': null, 'sessionId': null, 'projects': [{ 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }], 'lang': 'de', 'password': null }
            };

            userByIri.subscribe(
                (result: any) => {
                    expect(result.body).toEqual(user);
                }
            );

        })));

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
