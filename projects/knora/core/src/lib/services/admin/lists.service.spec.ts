import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, inject, TestBed } from '@angular/core/testing';
import { Observable, of } from 'rxjs';
import { KuiCoreModule } from '../../core.module';
import { ApiServiceError, ApiServiceResult, List, ListNode } from '../../declarations';
import { incunabulaProjectIri, listsResponseJson, yesNoMaybeListResponseJson } from '../../test-data/admin/shared-test-data';
import { ApiService } from '../api.service';
import { ListsService } from './lists.service';

describe('ListsService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let listsService: ListsService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '', ontologyIRI: '' })
            ],
            providers: [
                ApiService,
                ListsService
            ]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        listsService = TestBed.get(ListsService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('#getLists', () => {

        it('should be created', inject([ListsService], (service: ListsService) => {
            expect(service).toBeTruthy();
        }));

        it('should return all lists', async(inject([ListsService], (service) => {

            spyOn(service, 'getLists').and.callFake(() => {
                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = listsResponseJson;

                return of(result);
            });

            expect(listsService).toBeDefined();

            const allLists: Observable<ListNode[]> = listsService.getLists(incunabulaProjectIri);

            const lists = { 'lists': [{ 'id': 'http: //rdfh.ch/lists/FFFF/ynm01', 'labels': [{ 'value': 'Die Ja,  Nein,  Vielleicht Liste', 'language': 'de' }, { 'value': 'The Yes,  No,  Maybe List', 'language': 'en' }], 'projectIri': 'http: //www.knora.org/ontology/knora-base#SystemProject', 'isRootNode': true, 'comments': [{ 'value': 'Diese Liste kann von allen Projekten verwendet werden.', 'language': 'de' }, { 'value': 'This list can be used by all projects.', 'language': 'en' }] }] };

            /*
            const lists = {
                'lists': [{ 'listinfo': { 'id': 'http://rdfh.ch/lists/FFFF/ynm01', 'projectIri': 'http://www.knora.org/ontology/knora-base#SystemProject', 'labels': [{ 'value': 'The Yes, No, Maybe List', 'language': 'en' }, { 'value': 'Die Ja, Nein, Vielleicht Liste', 'language': 'de' }], 'comments': [{ 'value': 'This list can be used by all projects.', 'language': 'en' }, { 'value': 'Diese Liste kann von allen Projekten verwendet werden.', 'language': 'de' }] }, 'children': [] }]
            };
            */

            allLists.subscribe(
                (result: any) => {
                    const listsResult = result.body;
                    expect(listsResult).toEqual(lists);
                },
                (error: ApiServiceError) => {
                    fail(error);
                });

        })));

        it('should return one list by iri', async(inject([ListsService], (service) => {

            spyOn(service, 'getList').and.callFake(() => {
                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = yesNoMaybeListResponseJson;

                return of(result);
            });

            expect(listsService).toBeDefined();

            const getList: Observable<List> = listsService.getList('http://rdfh.ch/lists/FFFF/ynm01');

            const list = {
                'list': { 'listinfo': { 'id': 'http://rdfh.ch/lists/FFFF/ynm01', 'projectIri': 'http://www.knora.org/ontology/knora-base#SystemProject', 'labels': [{ 'value': 'The Yes, No, Maybe List', 'language': 'en' }, { 'value': 'Die Ja, Nein, Vielleicht Liste', 'language': 'de' }], 'comments': [{ 'value': 'This list can be used by all projects.', 'language': 'en' }, { 'value': 'Diese Liste kann von allen Projekten verwendet werden.', 'language': 'de' }] }, 'children': [{ 'children': [], 'name': 'yes', 'id': 'http://rdfh.ch/lists/FFFF/ynm01-01', 'labels': [{ 'value': 'Yes' }], 'position': 0, 'comments': [] }, { 'children': [], 'name': 'no', 'id': 'http://rdfh.ch/lists/FFFF/ynm01-02', 'labels': [{ 'value': 'No' }], 'position': 1, 'comments': [] }, { 'children': [], 'name': 'maybe', 'id': 'http://rdfh.ch/lists/FFFF/ynm01-03', 'labels': [{ 'value': 'Maybe' }], 'position': 2, 'comments': [] }] }
            };

            getList.subscribe(
                (result: any) => {
                    const listResult = result.body;
                    expect(listResult).toEqual(list);
                },
                (error: ApiServiceError) => {
                    fail(error);
                });
        })));

    });

});
