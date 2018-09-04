import { async, inject, TestBed } from '@angular/core/testing';

import { GroupsService } from './groups.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { Group } from '../../declarations';
import { groupsResponseJson, groupsTestData } from '../../test-data/admin/shared-test-data';


describe('GroupsService', () => {

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let groupsService: GroupsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [ApiService, GroupsService]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        groupsService = TestBed.get(GroupsService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('#getGroups', () => {
        const expectedGroups: Group[] = groupsTestData;
        const expectGroup: Group = groupsResponseJson;

        it('should be created', inject([GroupsService], (service: GroupsService) => {
            expect(service).toBeTruthy();
        }));

        it('should return all the groups', async(inject([GroupsService], (service) => {

            expect(service).toBeDefined();

            service.getAllGroups().subscribe((result) => {
                expect(result.body).toEqual(expectedGroups);
            });

            const req = httpTestingController.expectOne((request) => {
            return request.url.match(service.url) && request.method === 'GET';
          });

        })));

        it('should return one group by iri', async(inject([GroupsService], (service) => {

            expect(service).toBeDefined();

            service.getGroupByIri('http://rdfh.ch/groups/00FF/images-reviewer').subscribe((result) => {
                expect(result.body).toEqual(expectGroup);
            });

            const req = httpTestingController.expectOne((request) => {
            return request.url.match(service.url) && request.method === 'GET';
            });

        })));


    });

});
