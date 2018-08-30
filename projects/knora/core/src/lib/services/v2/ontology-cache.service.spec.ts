import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';
import { OntologyCacheService } from './ontology-cache.service';
import { OntologyService } from './ontology.service';
import { Observable } from 'rxjs';
import { inject } from '@angular/core/testing';
import { ApiServiceError } from '../../declarations';


fdescribe('OntologyCacheService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let ontologyCacheService: OntologyCacheService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [
                ApiService,
                OntologyCacheService,
                OntologyService,
            ]
        });

        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        ontologyCacheService = TestBed.get(OntologyCacheService);

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        // httpTestingController.verify();
    });

    describe('BEOL ontology complex', () => {
        let expectedOntology;
        let expectedOntology2;

        beforeEach(() => {
            ontologyCacheService = TestBed.get(OntologyCacheService);
            expectedOntology = require('../../test-data/ontologycache/beol-complex-onto.json') as String;
            expectedOntology2 = require('../../test-data/ontologycache/knora-api-complex-onto.json') as String;
        });

        fit('should convert and cache the BEOL ontology complex', async(inject(
            [OntologyCacheService], (service) => {


                /*service.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0801/beol/v2']).subscribe(
                    (ontologies) => {
                        console.log(ontologies);
                        expect(ontologies).toEqual(expectedOntology, 'should return expected heroes');
                    },
                    (error) => {
                          console.error(error);
                      }
                );*/


            expect(service).toBeDefined();

            // expected resources classes defined in the BEOL ontology
            const resClassesInBEOL = [
                'http://0.0.0.0:3333/ontology/0801/beol/v2#Archive',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#documentImage',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#facsimile',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#figure',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#introduction',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#letter',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#manuscript',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#page',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#publishedLetter',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#section',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#writtenSource'];


            service.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0801/beol/v2']).subscribe(
                (ontoRes) => {

                    // console.log(ontoRes);

                    expect(ontoRes.getResourceClassForOntology()['http://0.0.0.0:3333/ontology/0801/beol/v2']).toEqual(resClassesInBEOL, 'should get resource classes for beol');

                },
                (error: ApiServiceError) => {
                    console.error(error);
                    fail(error);
                }
            );

            const call1 = httpTestingController.match(
                (request) => {


                    return request.url === 'http://0.0.0.0:3333/v2/ontologies/allentities/http%3A%2F%2F0.0.0.0%3A3333%2Fontology%2F0801%2Fbeol%2Fv2' && request.method === 'GET';
                }
            );

            /*const call2 = httpTestingController.match(
                (request) => {
                    console.log(request);

                    return request.url === 'http://0.0.0.0:3333/v2/ontologies/allentities/http%3A%2F%2Fapi.knora.org%2Fontology%2Fknora-api%2Fv2' && request.method === 'GET';
                }
            );*/

            expect(call1.length).toEqual(2);
            // expect(call2.length).toEqual(1);



            // const req = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies/allentities/http%3A%2F%2F0.0.0.0%3A3333%2Fontology%2F0801%2Fbeol%2Fv2');

            // expect(req.request.method).toEqual('GET');

            // req.flush(expectedOntology);

            // const req2 = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies/allentities/http%3A%2F%2Fapi.knora.org%2Fontology%2Fknora-api%2Fv2');
            // expect(req2.request.method).toEqual('GET');

            // req2.flush(expectedOntology2);

        })));


    });

});
