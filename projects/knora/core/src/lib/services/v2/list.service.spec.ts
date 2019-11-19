import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';

import { ListService } from './list.service';

describe('ListService', () => {
    let httpTestingController: HttpTestingController;
    let listService: ListService;

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
                ListService,
                {
                    provide: KnoraApiConfigToken,
                    useValue: KnoraApiConfig
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: KnoraApiConnection
                }
            ]
        })
            .compileComponents();

        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpTestingController = TestBed.get(HttpTestingController);
        listService = TestBed.get(ListService);

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('should be created', () => {
        const service: ListService = TestBed.get(ListService);
        expect(service).toBeTruthy();
    });

    it('should get a list from Knora', () => {
        const listJSONLD = require('../../test-data/list/treeList.json');

        const listExpanded = require('../../test-data/list/treeList-expanded.json');

        listService.getList('http://rdfh.ch/lists/0001/treeList').subscribe(
            (list: object) => {
                expect(list).toEqual(listExpanded);
            }
        );

        // only one request to Knora is expected
        const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/lists/' + encodeURIComponent('http://rdfh.ch/lists/0001/treeList'));

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.flush(listJSONLD);

    });

    it('should get a list node from Knora', () => {

        const listNodeJSONLD = require('../../test-data/list/treeListNode.json');

        const listNodeExpanded = require('../../test-data/list/treeListNode-expanded.json');

        listService.getListNode('http://rdfh.ch/lists/0001/treeList11').subscribe(
            (list: object) => {
                expect(list).toEqual(listNodeExpanded);
            }
        );

        // only one request to Knora is expected
        const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/node/' + encodeURIComponent('http://rdfh.ch/lists/0001/treeList11'));

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.flush(listNodeJSONLD);

    });
});
