import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';
import { OntologyCacheService, OntologyInformation, ResourceClassIrisForOntology } from './ontology-cache.service';
import { OntologyService } from './ontology.service';
import { Observable, of } from 'rxjs';
import { ApiServiceError, ApiServiceResult } from '../../declarations';


describe('OntologyCacheService', () => {
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
        httpTestingController.verify();
    });

    describe('BEOL ontology complex', () => {
        let expectedOntologyBEOL;
        let expectedOntologyKnoraApi;
        let expectedOntologyAnything;

        beforeEach(() => {
            expectedOntologyBEOL = require('../../test-data/ontologycache/beol-complex-onto.json') as String;
            expectedOntologyKnoraApi = require('../../test-data/ontologycache/knora-api-complex-onto.json') as String;
            expectedOntologyAnything = require('../../test-data/ontologycache/anything-complex-onto.json') as String;
        });

        it('should convert and cache the beol ontology complex', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake((param) => {

                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = (param === 'http://0.0.0.0:3333/ontology/0801/beol/v2' ? expectedOntologyBEOL : expectedOntologyKnoraApi); // return json file depending on ontology requested

                return of(
                    result
                );

            });

            expect(ontologyCacheService).toBeDefined();

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


            ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0801/beol/v2']).subscribe(

                (ontoRes) => {

                    expect(ontoRes.getResourceClassForOntology()['http://0.0.0.0:3333/ontology/0801/beol/v2']).toEqual(resClassesInBEOL, 'should get resource classes for beol');

                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        }));

        it('should convert and cache the anything ontology complex', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake((param) => {

                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = (param === 'http://0.0.0.0:3333/ontology/0001/anything/v2' ? expectedOntologyAnything : expectedOntologyKnoraApi); // return json file depending on ontology requested

                return of(
                    result
                );

            });

            expect(ontologyCacheService).toBeDefined();

            const resClassesInAnything = [
                'http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#ThingPicture'
            ];

            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0001/anything/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const resClassesForAnything: ResourceClassIrisForOntology = ontoRes.getResourceClassForOntology();

                    expect(resClassesForAnything['http://0.0.0.0:3333/ontology/0001/anything/v2']).toEqual(resClassesInAnything);

                }
            );


        }));


    });

});
