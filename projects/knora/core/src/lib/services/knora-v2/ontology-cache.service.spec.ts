import { async, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpResponse } from '@angular/common/http';

import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';
import { OntologyCacheService, OntologyInformation } from './ontology-cache.service';
import { OntologyService } from './ontology.service';
import { Observable } from 'rxjs';
import { inject } from '../../../../../../../node_modules/@angular/core/testing';


describe('OntologyCacheService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let ontologyCacheService: OntologyCacheService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ApiService,
                OntologyCacheService,
                OntologyService
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
        let expectedOntology;

        beforeEach(() => {
            ontologyCacheService = TestBed.get(OntologyCacheService);
            expectedOntology = require('../../test-data/ontologycache/beol-complex-onto.json') as String;
        });

        it('should convert and cache the BEOL ontology complex', async(() => {
/*

            heroService.getHeroes().subscribe(
                heroes => expect(heroes).toEqual(expectedHeroes, 'should return expected heroes'),
                fail
            );

            // HeroService should have made one request to GET heroes from expected URL
            const req = httpTestingController.expectOne(heroService.heroesUrl);
            expect(req.request.method).toEqual('GET');
*/

            // expected resources classes defined in the BEOL ontology
            const resClassesInBEOL = [
                'http://0.0.0.0:3333/ontology/0801/beol/v2#Archiv',
                'http://0.0.0.0:3333/ontology/0801/beol/v2#endnote',
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

                    console.log(ontoRes);

                    expect(ontoRes.getResourceClassForOntology()['http://0.0.0.0:3333/ontology/0801/beol/v2']).toEqual(resClassesInBEOL, 'should get resource classes for beol');

                },
                (error) => {
                    console.error(error);
                }
/*                (ontoRes: OntologyInformation) => {

                    console.log(ontoRes);

                    const resClassesForBEOL = ontoRes.getResourceClassForOntology();

                    expect(resClassesForBEOL['http://0.0.0.0:3333/ontology/0801/beol/v2']).toEqual(resClassesInBEOL, 'should get resource classes for beol');
                }, fail*/
            );

            const req = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies/allentities/http%3A%2F%2F0.0.0.0%3A3333%2Fontology%2F0801%2Fbeol%2Fv2');
            expect(req.request.method).toEqual('GET');

            req.flush(expectedOntology);

        }));

        afterEach(() => {
            httpTestingController.verify();
        });

    });

});
