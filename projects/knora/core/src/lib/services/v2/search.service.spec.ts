import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { SearchService } from './search.service';
import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';
import { OntologyCacheService } from './ontology-cache.service';

describe('SearchService', () => {
    let httpTestingController: HttpTestingController;
    let searchService: SearchService;

    let expectedResources;

    beforeEach(() => {
        const spyOntoCache = jasmine.createSpyObj('OntologyCacheService', ['getResourceClassDefinitions']);

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ApiService,
                SearchService,
                {provide: OntologyCacheService, useValue: spyOntoCache}
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        searchService = TestBed.get(SearchService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(searchService).toBeDefined();
    });

    it('should search for the term "Narr"', async(() => {
        expectedResources = require('../../test-data/resources/SearchResultNarr.json');

        searchService.doFulltextSearch('Narr').subscribe(
            (res) => {
                expect(res.body).toEqual(expectedResources);
            }
        );

        const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/search/Narr?offset=0');

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.flush(expectedResources);

    }));

});
