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

        it('should return all groups', () => {

            expect(groupsService).toBeDefined();

            const groups = groupsService.getAllGroups();

            groups.subscribe((result: Group[]) => {
                expect(result).toEqual(expectedGroups);
            });

            const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/admin/groups');

            expect(httpRequest.request.method).toEqual('GET');

            httpRequest.flush(expectedGroups);

        });

        it('should return one group by iri', () => {

            expect(groupsService).toBeDefined();

            const groupByIri = groupsService.getGroupByIri('http://rdfh.ch/groups/00FF/images-reviewer');

            groupByIri.subscribe((result: Group) => {
                expect(result).toEqual(expectGroup);
            });

            const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/admin/groups/' + encodeURIComponent('http://rdfh.ch/groups/00FF/images-reviewer'));

            expect(httpRequest.request.method).toEqual('GET');

            httpRequest.flush(expectGroup);

        });
    });

});
