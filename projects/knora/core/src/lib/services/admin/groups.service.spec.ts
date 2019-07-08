import { async, inject, TestBed } from '@angular/core/testing';

import { GroupsService } from './groups.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { ApiServiceError, ApiServiceResult, Group } from '../../declarations';
import { groupsResponseJson, imagesReviewerGroupResponseJson } from '../../test-data/admin/shared-test-data';
import { Observable, of } from 'rxjs';


describe('GroupsService', () => {

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let groupsService: GroupsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '', ontologyIRI: '' })
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

        it('should be created', inject([GroupsService], (service: GroupsService) => {
            expect(service).toBeTruthy();
        }));

        it('should return all groups', async(inject([GroupsService], (service) => {

            spyOn(service, 'getAllGroups').and.callFake(() => {
                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = groupsResponseJson;

                return of(result);
            });

            expect(groupsService).toBeDefined();

            const allGroups: Observable<Group[]> = groupsService.getAllGroups();

            const groups = {
                'groups': [{ 'name': 'Image reviewer', 'project': { 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }, 'description': 'A group for image reviewers.', 'id': 'http://rdfh.ch/groups/00FF/images-reviewer', 'status': true, 'selfjoin': false }]
            };

            allGroups.subscribe(
                (result: any) => {
                    const groupsResult = result.body;
                    expect(groupsResult).toEqual(groups);
                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));

        it('should return one group by iri', async(inject([GroupsService], (service) => {

            spyOn(service, 'getGroupByIri').and.callFake(() => {
                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = imagesReviewerGroupResponseJson;

                return of(result);
            });

            expect(groupsService).toBeDefined();

            const groupByIri: Observable<Group> = groupsService.getGroupByIri('http://rdfh.ch/groups/00FF/images-reviewer');

            const group = {
                'group': { 'name': 'Image reviewer', 'project': { 'ontologies': ['http://www.knora.org/ontology/00FF/images'], 'shortname': 'images', 'description': [{ 'value': 'A demo project of a collection of images', 'language': 'en' }], 'shortcode': '00FF', 'logo': null, 'id': 'http://rdfh.ch/projects/00FF', 'status': true, 'selfjoin': false, 'keywords': ['collection', 'images'], 'longname': 'Image Collection Demo' }, 'description': 'A group for image reviewers.', 'id': 'http://rdfh.ch/groups/00FF/images-reviewer', 'status': true, 'selfjoin': false }
            };

            groupByIri.subscribe(
                (result: any) => {
                    expect(result.body).toEqual(group);
                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })));
    });

});
