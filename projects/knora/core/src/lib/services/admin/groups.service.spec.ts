import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { Observable, of } from 'rxjs';

import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '../../core.module';
import { ApiServiceError, ApiServiceResult, Group } from '../../declarations';
import { groupsResponseJson, imagesReviewerGroupResponseJson } from '../../test-data/admin/shared-test-data';
import { ApiService } from '../api.service';

import { GroupsService } from './groups.service';

describe('GroupsService', () => {

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let groupsService: GroupsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
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
            providers: [
                ApiService,
                GroupsService,
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
