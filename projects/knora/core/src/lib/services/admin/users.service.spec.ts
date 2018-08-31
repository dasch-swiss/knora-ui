import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { UsersService } from './users.service';
import { async, inject, TestBed } from '@angular/core/testing';
import { User } from '../../declarations';
import { KuiCoreModule } from '../../core.module';
import { usersTestData } from '../../test-data/admin/shared-test-data';

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
        const expectedUsers: User[] = usersTestData;

        beforeEach(() => {


        });

        it('should be created', async(inject(
            [UsersService], (service) => {
                expect(service).toBeDefined();
            }))
        );

        it('#getAllUsers should return all users', async(inject(
            [UsersService], (service) => {

                expect(service).toBeDefined();

                service.getAllUsers().subscribe(
                    /*
                    (users: User[]) => {

                        // expect(users.length).toBe(8);
                        expect(users).toEqual(expectedUsers, 'should return expected users');
                    },
                    (error: ApiServiceError) => {
                        fail(error);
                    }
                    */
                );

                // usersService should have made one request to GET users from expected URL
                const req = httpTestingController.expectOne( (request) => {
                    return request.url.match(service.usersUrl) && request.method === 'GET';
                });

                console.log(req);


                // Respond with the mock users
//                req.flush(expectedUsers);
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
