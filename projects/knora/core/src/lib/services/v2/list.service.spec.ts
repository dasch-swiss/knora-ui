import { TestBed } from '@angular/core/testing';

import { ListService } from './list.service';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';

fdescribe('ListService', () => {
    let httpTestingController: HttpTestingController;
    let listService: ListService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ApiService,
                ListService
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
        expect(listService).toBeTruthy();
    });

    it('should get a list from Knora and cache it', () => {
        const expectedList = require('../../test-data/list/treeList.json');

        listService.getList('http://rdfh.ch/lists/0001/treeList').subscribe(
            (list) => {
                console.log(list);
            }
        );

        const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/lists/' + encodeURIComponent('http://rdfh.ch/lists/0001/treeList'));

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.flush(expectedList);

    });


});
