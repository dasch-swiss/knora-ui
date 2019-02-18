import { TestBed } from '@angular/core/testing';

import { ListCacheService, ListNodeV2 } from './list-cache.service';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';

describe('ListCacheService', () => {
    let httpTestingController: HttpTestingController;
    let listService: ListCacheService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ApiService,
                ListCacheService
            ]
        })
            .compileComponents();

        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpTestingController = TestBed.get(HttpTestingController);
        listService = TestBed.get(ListCacheService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(listService).toBeTruthy();
    });

    it('should get a list from Knora and cache it', () => {
        const expectedList = require('../../test-data/list/treeList.json');

        listService.getList('http://rdfh.ch/lists/0001/treeList').subscribe(
            (list: ListNodeV2) => {

                expect(list.id).toEqual('http://rdfh.ch/lists/0001/treeList');
                expect(list.label).toEqual('Tree list root');
                expect(list.children.length).toEqual(3);

                expect(list.children[2].id).toEqual('http://rdfh.ch/lists/0001/treeList03');
                expect(list.children[2].children.length).toEqual(2);

                expect(list.children[2].children[0].id).toEqual('http://rdfh.ch/lists/0001/treeList10');
                expect(list.children[2].children[1].id).toEqual('http://rdfh.ch/lists/0001/treeList11');

                // do the same request again (should read from cache)
                // NOTE: the requests have to be chained and cannot be executed concurrently
                listService.getList('http://rdfh.ch/lists/0001/treeList').subscribe(
                    (list2) => {
                        expect(list2.id).toEqual('http://rdfh.ch/lists/0001/treeList');
                        expect(list2.label).toEqual('Tree list root');
                    }
                );
            }
        );

        // only one request to Knora is expected
        const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/lists/' + encodeURIComponent('http://rdfh.ch/lists/0001/treeList'));

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.flush(expectedList);

    });


});
