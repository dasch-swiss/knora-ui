import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { Observable, of } from 'rxjs';

import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '../../core.module';
import { ApiServiceError, ApiServiceResult, User } from '../../declarations';
import { imagesUserResponseJson, usersResponseJson } from '../../test-data/admin/shared-test-data';
import { ApiService } from '../api.service';

import { UsersService } from './users.service';

describe('UsersService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let usersService: UsersService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Import the HttpClient mocking services
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({
                    knora: {
                        apiProtocol: 'http',
                        apiHost: '0.0.0.0',
                        apiPort: 3333,
                        apiUrl: '',
                        apiPath: '',
                        jsonWebToken: '',
                        logErrors: true
                    },
                    app: {
                        name: 'Knora-UI-APP',
                        url: 'localhost:4200'
                    }
                })
            ],
            // Provide the service-under-test and its dependencies
            providers: [
                ApiService,
                UsersService,
                {
                    provide: KnoraApiConfigToken,
                    useValue: KnoraApiConfig
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: KnoraApiConnection
                }
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
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = usersResponseJson;

                return of(result);
            });

            expect(usersService).toBeDefined();

            const allUsers: Observable<User[]> = usersService.getAllUsers();

            const users = { 'users': [{ 'familyName': 'Admin-alt', 'givenName': 'Administrator-alt', 'email': 'root-alt@example.com', 'username': 'root-alt', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/91e19f1e01', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'User02', 'email': 'user02.user@example.com', 'username': 'user02.user', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/97cec4000f', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User01', 'givenName': 'Anything', 'email': 'anything.user01@example.org', 'username': 'anything.user01', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/9XBCrDV3SRa7kS1WwynB4Q', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Admin', 'givenName': 'Anything', 'email': 'anything.admin@example.org', 'username': 'anything.admin', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/AnythingAdminUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User02', 'givenName': 'Anything', 'email': 'anything.user02@example.org', 'username': 'anything.user02', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/BhkfBc3hTeS_IDo-JgXRbQ', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'BEOL', 'givenName': 'BEOL', 'email': 'beol@example.com', 'username': 'beol', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'BEOL', 'givenName': 'BEOL', 'email': 't.schweizer@unibas.ch', 'username': 't.schweizer', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGF', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Test', 'givenName': 'User', 'email': 'user.test@example.com', 'username': 'user.test', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/b83acc5f05', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'User01', 'email': 'user01.user1@example.com', 'username': 'user01.user1', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/c266a56709', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'User03', 'email': 'images-reviewer-user@example.com', 'username': 'images-reviewer-user', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/images-reviewer-user', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Inactive', 'email': 'inactive.user@example.com', 'username': 'inactiveuser', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/inactiveuser', 'status': false, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User2', 'givenName': 'Test', 'email': 'test.user2@test.ch', 'username': 'incunabulaMemberUser', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/incunabulaMemberUser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Multi', 'email': 'multi.user@example.com', 'username': 'multiuser', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/multiuser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Normal', 'email': 'normal.user@example.com', 'username': 'normaluser', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/normaluser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Administrator', 'givenName': 'System', 'email': 'root@example.com', 'username': 'root', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/root', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'User', 'givenName': 'Super', 'email': 'super.user@example.com', 'username': 'superuser', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/superuser', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Webern', 'givenName': 'Admin', 'email': 'webern-admin@example.ch', 'username': 'webern-admin', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/webernProjectAdmin', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }, { 'familyName': 'Webern', 'givenName': 'Nutzer', 'email': 'webern-nutzer@example.ch', 'username': 'webern-nutzer', 'permissions': { 'groupsPerProject': {}, 'administrativePermissionsPerProject': {} }, 'groups': [], 'id': 'http://rdfh.ch/users/webernProjectMember', 'status': true, 'token': null, 'sessionId': null, 'projects': [], 'lang': 'de', 'password': null }] };

            allUsers.subscribe(
                (result: any) => {
                    const userResult = result.body;
                    expect(userResult.users.length).toBe(18);
                    expect(userResult).toEqual(users);
                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));

        it('should return one user by email', async(inject([UsersService], (service) => {

            spyOn(service, 'getUserByEmail').and.callFake(() => {
                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = imagesUserResponseJson;

                return of(result);
            });

            expect(usersService).toBeDefined();

            const userByEmail: Observable<User> = usersService.getUserByEmail('images-reviewer-user@example.com');

            const user = { 'user': { 'familyName': 'User', 'givenName': 'User03', 'email': 'images-reviewer-user@example.com', 'username': 'images-reviewer-user', 'permissions': { 'groupsPerProject': { 'http://rdfh.ch/projects/00FF': ['http://rdfh.ch/groups/00FF/images-reviewer', 'http://www.knora.org/ontology/knora-base#ProjectMember'] }, 'administrativePermissionsPerProject': { 'http://rdfh.ch/projects/00FF': [{ 'name': 'ProjectResourceCreateRestrictedPermission', 'additionalInformation': 'http://www.knora.org/ontology/00FF/images#bildformat', 'permissionCode': null }, { 'name': 'ProjectResourceCreateRestrictedPermission', 'additionalInformation': 'http://www.knora.org/ontology/00FF/images#bild', 'permissionCode': null }] } }, 'groups': [{ 'name': 'Image reviewer', 'project': { 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }, 'description': 'A group for image reviewers.', 'id': 'http://rdfh.ch/groups/00FF/images-reviewer', 'status': true, 'selfjoin': false }], 'id': 'http://rdfh.ch/users/images-reviewer-user', 'status': true, 'token': null, 'sessionId': null, 'projects': [{ 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }], 'lang': 'de', 'password': null } };

            userByEmail.subscribe(
                (result: any) => {
                    expect(result.body).toEqual(user);
                }
            );

        })));

        it('should return one user by iri', async(inject([UsersService], (service) => {

            spyOn(service, 'getUserByIri').and.callFake(() => {
                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = imagesUserResponseJson;

                return of(result);
            });

            expect(usersService).toBeDefined();

            const userByIri: Observable<User> = usersService.getUserByIri('http://rdfh.ch/users/c266a56709');

            const user = { 'user': { 'familyName': 'User', 'givenName': 'User03', 'email': 'images-reviewer-user@example.com', 'username': 'images-reviewer-user', 'permissions': { 'groupsPerProject': { 'http://rdfh.ch/projects/00FF': ['http://rdfh.ch/groups/00FF/images-reviewer', 'http://www.knora.org/ontology/knora-base#ProjectMember'] }, 'administrativePermissionsPerProject': { 'http://rdfh.ch/projects/00FF': [{ 'name': 'ProjectResourceCreateRestrictedPermission', 'additionalInformation': 'http://www.knora.org/ontology/00FF/images#bildformat', 'permissionCode': null }, { 'name': 'ProjectResourceCreateRestrictedPermission', 'additionalInformation': 'http://www.knora.org/ontology/00FF/images#bild', 'permissionCode': null }] } }, 'groups': [{ 'name': 'Image reviewer', 'project': { 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }, 'description': 'A group for image reviewers.', 'id': 'http://rdfh.ch/groups/00FF/images-reviewer', 'status': true, 'selfjoin': false }], 'id': 'http://rdfh.ch/users/images-reviewer-user', 'status': true, 'token': null, 'sessionId': null, 'projects': [{ 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }], 'lang': 'de', 'password': null } };

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
