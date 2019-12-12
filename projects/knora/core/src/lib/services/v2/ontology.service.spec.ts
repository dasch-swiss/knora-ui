import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { async, TestBed } from '@angular/core/testing';
import { Constants, KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '../../core.module';
import { ApiServiceResult } from '../../declarations';
import { NewOntology } from '../../declarations/api/v2/ontology/new-ontology';
import { ApiService } from '../api.service';
import { OntologyService } from './ontology.service';

xdescribe('OntologyService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let ontologyService: OntologyService;

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
                OntologyService,
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

    describe('Get all ontologies', () => {
        let expectedOntologiesMetadata;

        beforeEach(() => {
            expectedOntologiesMetadata = require('../../test-data/ontologycache/ontology-metadata.json');
        });

        it('Get metadata about all ontologies', () => {

            expect(ontologyService).toBeDefined();

            const ontoMetadata = ontologyService.getAllOntologies();

            ontoMetadata.subscribe(
                (metadata: ApiServiceResult) => {
                    expect(metadata.body).toEqual(expectedOntologiesMetadata);
                }
            );

            const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies/metadata');

            expect(httpRequest.request.method).toEqual('GET');

            httpRequest.flush(expectedOntologiesMetadata);

        });

    });

    describe('Get all ontologies from one project', () => {
        let expectedOntologiesMetadata;

        beforeEach(() => {
            expectedOntologiesMetadata = require('../../test-data/ontologycache/something-ontology-metadata.json');
        });

        it('Get metadata about all ontologies of "something" project', () => {

            expect(ontologyService).toBeDefined();

            const ontoMetadata = ontologyService.getProjectOntologies('https://rdfh.ch/projects/0001');

            ontoMetadata.subscribe(
                (metadata: ApiServiceResult) => {
                    expect(metadata.body).toEqual(expectedOntologiesMetadata);
                }
            );

            const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies/metadata/https%3A%2F%2Frdfh.ch%2Fprojects%2F0001');

            expect(httpRequest.request.method).toEqual('GET');

            httpRequest.flush(expectedOntologiesMetadata);

        });

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

        it('get an ontology', () => {

            expect(ontologyService).toBeDefined();

            const beolOnto = ontologyService.getAllEntityDefinitionsForOntologies('http://0.0.0.0:3333/ontology/0801/beol/v2');

            beolOnto.subscribe(
                (onto: ApiServiceResult) => {
                    expect(onto.body).toEqual(expectedOntologyBEOL);
                }
            );

            const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies/allentities/' + encodeURIComponent('http://0.0.0.0:3333/ontology/0801/beol/v2'));

            expect(httpRequest.request.method).toEqual('GET');

            httpRequest.flush(expectedOntologyBEOL);

        });
    });

    describe('Create new ontology: ', () => {

        let expectedOntologiesMetadata;

        const newOntologyPostData: NewOntology = {
            projectIri: 'http://rdfh.ch/projects/0001',
            name: 'anything-data-model-1',
            label: 'Ontology for anything'
        };

        // request body
        const newOntologyRequestBody = {
            'knora-api:ontologyName': newOntologyPostData.name,
            'knora-api:attachedToProject': {
                '@id': newOntologyPostData.projectIri,
            },
            'rdfs:label': newOntologyPostData.label,
            '@context': {
                'rdfs': Constants.Rdfs,
                'knora-api': Constants.KnoraApiV2 + Constants.Delimiter
            }
        };

        beforeEach(() => {
            expectedOntologiesMetadata = require('../../test-data/ontology/new-ontology.json');
        });

        it('Should return an Observable<ApiServiceResult> with status 200', async(() => {

            expect(ontologyService).toBeDefined();

            ontologyService.createOntology(newOntologyPostData).subscribe(
                (res: any) => {
                    expect(res).toEqual(expectedOntologiesMetadata);
                    // expect(res.statusText).toEqual();
                },
                (error: any) => {
                    console.error(error);
                }
            );

            const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/ontologies');

            expect(httpRequest.request.method).toEqual('POST');

            expect(httpRequest.request.body).toEqual(newOntologyRequestBody);

            httpRequest.flush(expectedOntologiesMetadata);


        }));

    });
});
