import { inject, TestBed } from '@angular/core/testing';

import { OntologyService } from './ontology.service';
import { HttpClient } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import {ApiServiceResult} from '../../declarations';

describe('OntologyService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let ontologyService: OntologyService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ApiService,
                OntologyService,
            ]
        });

        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        ontologyService = TestBed.get(OntologyService);

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('Get a specific ontology', () => {
        let expectedOntologyBEOL;
        let expectedOntologyKnoraApi;
        let expectedOntologyAnything;
        let expectedOntologySomething;


        beforeEach(() => {
            expectedOntologyBEOL = require('../../test-data/ontologycache/beol-complex-onto.json') as String;
            expectedOntologyKnoraApi = require('../../test-data/ontologycache/knora-api-complex-onto.json') as String;
            expectedOntologyAnything = require('../../test-data/ontologycache/anything-complex-onto.json') as String;
            expectedOntologySomething = require('../../test-data/ontologycache/something-complex-onto.json') as String;
        });

        it('should be created', inject([OntologyService], (service: OntologyService) => {
            expect(service).toBeTruthy();
        }));

        it('get an ontology', () => {

            let beolOnto = ontologyService.getAllEntityDefinitionsForOntologies('http://0.0.0.0:3333/ontology/0801/beol/v2');

            beolOnto.subscribe(
                (onto: ApiServiceResult) => {
                    expect(onto.body).toBe(expectedOntologyBEOL);
                }
            );

            let httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies/allentities/' + encodeURIComponent('http://0.0.0.0:3333/ontology/0801/beol/v2'));

            expect(httpRequest.request.method).toEqual('GET');

            httpRequest.flush(expectedOntologyBEOL);

        });
    });
});
