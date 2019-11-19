import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { Observable, of } from 'rxjs';

import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '../../core.module';
import { ApiServiceError, ApiServiceResult } from '../../declarations';
import { ApiService } from '../api.service';

import { Cardinality, CardinalityOccurrence, GuiOrder, OntologyCacheService, OntologyInformation, OntologyMetadata, Properties, Property, ResourceClass, ResourceClasses, ResourceClassIrisForOntology } from './ontology-cache.service';
import { OntologyService } from './ontology.service';

describe('OntologyCacheService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let ontologyCacheService: OntologyCacheService;

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
                OntologyCacheService,
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
        ontologyCacheService = TestBed.get(OntologyCacheService);

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    describe('Ontology metadata handling', () => {
        let expectedOntologiesMetadata;

        beforeEach(() => {
            expectedOntologiesMetadata = require('../../test-data/ontologycache/ontology-metadata.json');
        });

        it('Get metadata about all ontologies', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getOntologiesMetadata').and.callFake(() => {
                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = expectedOntologiesMetadata;

                return of(
                    result
                );
            });

            expect(ontologyCacheService).toBeDefined();

            const metadataOntos: Observable<Array<OntologyMetadata>> = ontologyCacheService.getOntologiesMetadata();

            const ontologiesMetadata = [

                new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/anything/v2', 'The anything ontology'),
                new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/something/v2', 'The something ontology'),
                new OntologyMetadata('http://0.0.0.0:3333/ontology/00FF/images/v2', 'The images demo ontology'),
                new OntologyMetadata('http://0.0.0.0:3333/ontology/0801/beol/v2', 'The BEOL ontology'),
                new OntologyMetadata('http://0.0.0.0:3333/ontology/0801/biblio/v2', 'The Biblio ontology'),
                new OntologyMetadata('http://0.0.0.0:3333/ontology/0803/incunabula/v2', 'The incunabula ontology'),
                new OntologyMetadata('http://0.0.0.0:3333/ontology/0804/dokubib/v2', 'The dokubib ontology'),
                new OntologyMetadata('http://api.knora.org/ontology/knora-api/v2', 'The knora-api ontology in the complex schema')
            ];

            metadataOntos.subscribe(
                (metadata) => {
                    expect(metadata).toEqual(ontologiesMetadata);
                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        }));

    });

    describe('Ontology (complex) handling', () => {
        let expectedOntologyBEOL;
        let expectedOntologyKnoraApi;
        let expectedOntologyAnything;
        let expectedOntologySomething;

        let serveOntology: (ontologyIri: string) => Observable<ApiServiceResult>;

        beforeEach(() => {
            expectedOntologyBEOL = require('../../test-data/ontologycache/beol-complex-onto.json') as String;
            expectedOntologyKnoraApi = require('../../test-data/ontologycache/knora-api-complex-onto.json') as String;
            expectedOntologyAnything = require('../../test-data/ontologycache/anything-complex-onto.json') as String;
            expectedOntologySomething = require('../../test-data/ontologycache/something-complex-onto.json') as String;

            // mock method to get an ontology
            serveOntology = (ontologyIri: string) => {
                let onto;

                switch (ontologyIri) {

                    case 'http://0.0.0.0:3333/ontology/0801/beol/v2': {
                        onto = expectedOntologyBEOL;
                        break;
                    }

                    case 'http://0.0.0.0:3333/ontology/0001/anything/v2': {
                        onto = expectedOntologyAnything;
                        break;
                    }

                    case 'http://0.0.0.0:3333/ontology/0001/something/v2': {
                        onto = expectedOntologySomething;
                        break;
                    }

                    case 'http://api.knora.org/ontology/knora-api/v2': {
                        onto = expectedOntologyKnoraApi;
                        break;
                    }

                    default:
                        console.error('Unknown ontology ' + ontologyIri);
                        break;
                }

                const result = new ApiServiceResult();
                result.header = {};
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = onto; // return json file depending on ontology requested

                return of(
                    result
                );
            };

        });

        it('should convert and cache the beol ontology complex', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

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
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

            expect(ontologyCacheService).toBeDefined();

            const resClassesInAnything = [
                'http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#ThingPicture',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#ThingWithRepresentation',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#ThingWithSeqnum',
                'http://0.0.0.0:3333/ontology/0001/anything/v2#TrivialThing'
            ];

            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0001/anything/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const resClassesForAnything: ResourceClassIrisForOntology = ontoRes.getResourceClassForOntology();

                    expect(resClassesForAnything['http://0.0.0.0:3333/ontology/0001/anything/v2']).toEqual(resClassesInAnything);

                }
            );
        }));

        it('should convert and cache the something ontology complex', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

            expect(ontologyCacheService).toBeDefined();

            const resClassesInSomething = [
                'http://0.0.0.0:3333/ontology/0001/something/v2#Something'
            ];


            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0001/something/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const resClassesForSomething: ResourceClassIrisForOntology = ontoRes.getResourceClassForOntology();

                    expect(resClassesForSomething['http://0.0.0.0:3333/ontology/0001/something/v2']).toEqual(resClassesInSomething);

                    const resourceClasses: ResourceClasses = ontoRes.getResourceClasses();

                    const expectedCards = [
                        new Cardinality(
                            CardinalityOccurrence.card,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#arkUrl'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.card,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#attachedToProject'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.card,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#attachedToUser'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.card,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#creationDate'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.maxCard,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#deleteComment'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.maxCard,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#deleteDate'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.card,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#hasPermissions'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.card,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#isDeleted'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.maxCard,
                            1,
                            'http://api.knora.org/ontology/knora-api/v2#lastModificationDate'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.card,
                            1,
                            'http://www.w3.org/2000/01/rdf-schema#label'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.maxCard,
                            1,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeometry'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeoname'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPicture'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPictureValue'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThing'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThingValue'
                        )
                    ];

                    const expectedGuiOrder = [
                        new GuiOrder(
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem'
                        ),
                        new GuiOrder(
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem'
                        ),
                        new GuiOrder(
                            0,
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething'
                        ),
                        new GuiOrder(
                            0,
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue'
                        ),
                        new GuiOrder(
                            2,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext'
                        ),
                        new GuiOrder(
                            2,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'
                        ),
                        new GuiOrder(
                            3,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate'
                        ),
                        new GuiOrder(
                            4,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger'
                        ),
                        new GuiOrder(
                            5,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal'
                        ),
                        new GuiOrder(
                            6,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean'
                        ),
                        new GuiOrder(
                            7,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri'
                        ),
                        new GuiOrder(
                            9,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval'
                        ),
                        new GuiOrder(
                            10,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor'
                        ),
                        new GuiOrder(
                            11,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeometry'
                        ),
                        new GuiOrder(
                            12,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeoname'
                        ),
                        new GuiOrder(
                            13,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPicture'
                        ),
                        new GuiOrder(
                            13,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPictureValue'
                        ),
                        new GuiOrder(
                            15,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThing'
                        ),
                        new GuiOrder(
                            15,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThingValue'
                        )
                    ];


                    const expectedSomething = new ResourceClass(
                        'http://0.0.0.0:3333/ontology/0001/something/v2#Something',
                        'something.png',
                        'A something is a thing.',
                        'Something',
                        expectedCards,
                        expectedGuiOrder
                    );

                    expect(resourceClasses['http://0.0.0.0:3333/ontology/0001/something/v2#Something']).toEqual(expectedSomething);

                    const expectedProps = {
                        'http://api.knora.org/ontology/knora-api/v2#arkUrl': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#arkUrl',
                            'http://www.w3.org/2001/XMLSchema#anyURI',
                            'Provides the ARK URL of a resource.',
                            'ARK URL',
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#attachedToProject': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#attachedToProject',
                            'http://api.knora.org/ontology/knora-admin/v2#knoraProject',
                            'Connects something to a project',
                            'attached to project',
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#attachedToUser': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#attachedToUser',
                            'http://api.knora.org/ontology/knora-admin/v2#User',
                            'Connects something to a user',
                            'attached to user',
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#creationDate': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#creationDate',
                            'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
                            'Indicates when a resource was created',
                            undefined,
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            'Indicates that this resource referred to by another resource',
                            'has incoming link',
                            ['http://api.knora.org/ontology/knora-api/v2#hasLinkToValue'],
                            false,
                            false,
                            true,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#hasPermissions': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasPermissions',
                            'http://www.w3.org/2001/XMLSchema#string',
                            undefined,
                            undefined,
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo',
                            'http://api.knora.org/ontology/knora-api/v2#Resource',
                            'Represents a link in standoff markup from one resource to another.',
                            'has Standoff Link to',
                            ['http://api.knora.org/ontology/knora-api/v2#hasLinkTo'],
                            false,
                            true,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            'Represents a link in standoff markup from one resource to another.',
                            'has Standoff Link to',
                            ['http://api.knora.org/ontology/knora-api/v2#hasLinkToValue'],
                            false,
                            false,
                            true,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#lastModificationDate': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#lastModificationDate',
                            'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
                            undefined,
                            undefined,
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem',
                            'http://api.knora.org/ontology/knora-api/v2#ListValue',
                            undefined,
                            'List element',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            ['hlist=<http://rdfh.ch/lists/0001/treeList>']),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem',
                            'http://api.knora.org/ontology/knora-api/v2#ListValue',
                            undefined,
                            'Other list element',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            ['hlist=<http://rdfh.ch/lists/0001/otherTreeList>']),
                        'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething': new Property(
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething',
                            'http://0.0.0.0:3333/ontology/0001/something/v2#Something',
                            'Has another something.',
                            'has other something',
                            ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing'],
                            true,
                            true,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue': new Property(
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            'Has another something.',
                            'has other something',
                            ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue'],
                            true,
                            false,
                            true,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext',
                            'http://api.knora.org/ontology/knora-api/v2#TextValue',
                            undefined,
                            'Text',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText',
                            'http://api.knora.org/ontology/knora-api/v2#TextValue',
                            undefined,
                            'Text',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            ['maxlength=255', 'size=80']),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate',
                            'http://api.knora.org/ontology/knora-api/v2#DateValue',
                            undefined,
                            'Date',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger',
                            'http://api.knora.org/ontology/knora-api/v2#IntValue',
                            undefined,
                            'Integer',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            ['max=-1', 'min=0']),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal',
                            'http://api.knora.org/ontology/knora-api/v2#DecimalValue',
                            undefined,
                            'Decimal number',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            ['maxlength=255', 'size=80']),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean',
                            'http://api.knora.org/ontology/knora-api/v2#BooleanValue',
                            undefined,
                            'Boolean value',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri',
                            'http://api.knora.org/ontology/knora-api/v2#UriValue',
                            undefined,
                            'URI',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            ['maxlength=255', 'size=80']),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval',
                            'http://api.knora.org/ontology/knora-api/v2#IntervalValue',
                            undefined,
                            'Time interval',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor',
                            'http://api.knora.org/ontology/knora-api/v2#ColorValue',
                            undefined,
                            'Color',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPicture': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPicture',
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#ThingPicture',
                            undefined,
                            'Picture of a thing',
                            ['http://api.knora.org/ontology/knora-api/v2#hasRepresentation'],
                            true,
                            true,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPictureValue': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPictureValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            undefined,
                            'Picture of a thing',
                            ['http://api.knora.org/ontology/knora-api/v2#hasRepresentationValue'],
                            true,
                            false,
                            true,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThing': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThing',
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing',
                            undefined,
                            'is part of',
                            ['http://api.knora.org/ontology/knora-api/v2#isPartOf'],
                            true,
                            true,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThingValue': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThingValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            undefined,
                            'is part of',
                            ['http://api.knora.org/ontology/knora-api/v2#isPartOfValue'],
                            true,
                            false,
                            true,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#deleteComment': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#deleteComment',
                            'http://www.w3.org/2001/XMLSchema#string',
                            'A comment explaining why a resource or value was marked as deleted',
                            undefined,
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#deleteDate': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#deleteDate',
                            'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
                            'Indicates when a resource or value was deleted',
                            undefined,
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://api.knora.org/ontology/knora-api/v2#isDeleted': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#isDeleted',
                            'http://www.w3.org/2001/XMLSchema#boolean',
                            'Exists and is true if the resource has been deleted',
                            undefined,
                            [],
                            false,
                            false,
                            false,
                            []),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeometry': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeometry',
                            'http://api.knora.org/ontology/knora-api/v2#GeomValue',
                            undefined,
                            'Geometry',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            []
                        ),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeoname': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasGeoname',
                            'http://api.knora.org/ontology/knora-api/v2#GeonameValue',
                            undefined,
                            'Geoname',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false,
                            []
                        )
                    };

                    const expectedProperties = new Properties();

                    for (const propIri in expectedProps) {
                        if (expectedProps.hasOwnProperty(propIri)) {
                            expectedProperties[propIri] = expectedProps[propIri];
                        }
                    }

                    expect(Object.keys(expectedProperties)).toEqual(Object.keys(expectedProps));

                    const props = ontoRes.getProperties();

                    expect(props).toEqual(expectedProperties);

                }
            );

        }));

        it('should get an internal representation of a resource class from the cache', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

            expect(ontologyCacheService).toBeDefined();

            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0801/beol/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const resourceClasses = ontoRes.getResourceClasses();

                    const personExpected = new ResourceClass(
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                        'person.png',
                        'A resource representing a person',
                        'Person',
                        [
                            new Cardinality(
                                CardinalityOccurrence.card,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#arkUrl'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.card,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#attachedToProject'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.card,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#attachedToUser'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.card,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#creationDate'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#deleteComment'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#deleteDate'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.card,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#hasPermissions'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.card,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#isDeleted'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://api.knora.org/ontology/knora-api/v2#lastModificationDate'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.card,
                                1,
                                'http://www.w3.org/2000/01/rdf-schema#label'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasFamilyName'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasGivenName'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#personHasTitle'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasAlternativeName'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#beolIDs'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasIAFIdentifier'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasBirthDate'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasDeathDate'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasFloruitDate'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.maxCard,
                                1,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasMarriageDate'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasBirthPlace'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasDeathPlace'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasFloruitPlace'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasMarriagePlace'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSonValue'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSon'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasDictionaryEntries'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#comment'
                            ),
                            new Cardinality(
                                CardinalityOccurrence.minCard,
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#mentionedIn'
                            )
                        ],
                        [
                            new GuiOrder(
                                0,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasFamilyName'
                            ),
                            new GuiOrder(
                                1,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasGivenName'
                            ),
                            new GuiOrder(
                                2,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#personHasTitle'
                            ),
                            new GuiOrder(
                                3,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasAlternativeName'
                            ),
                            new GuiOrder(
                                4,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#beolIDs'
                            ),
                            new GuiOrder(
                                5,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasIAFIdentifier'
                            ),
                            new GuiOrder(
                                6,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasBirthDate'
                            ),
                            new GuiOrder(
                                7,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasDeathDate'
                            ),
                            new GuiOrder(
                                8,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasFloruitDate'
                            ),
                            new GuiOrder(
                                9,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasMarriageDate'
                            ),
                            new GuiOrder(
                                10,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasBirthPlace'
                            ),
                            new GuiOrder(
                                11,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasDeathPlace'
                            ),
                            new GuiOrder(
                                12,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasFloruitPlace'
                            ),
                            new GuiOrder(
                                13,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasMarriagePlace'
                            ),
                            new GuiOrder(
                                14,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSonValue'
                            ),
                            new GuiOrder(
                                15,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSon'
                            ),
                            new GuiOrder(
                                16,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#hasDictionaryEntries'
                            ),
                            new GuiOrder(
                                17,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#comment'
                            ),
                            new GuiOrder(
                                18,
                                'http://0.0.0.0:3333/ontology/0801/beol/v2#mentionedIn'
                            )
                        ]
                    );

                    expect(resourceClasses['http://0.0.0.0:3333/ontology/0801/beol/v2#person']).toEqual(personExpected);
                }
            );
        }));

        it('should sort properties by label in asc or desc order', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

            expect(ontologyCacheService).toBeDefined();

            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0801/beol/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const propSortedAsc = ontoRes.getPropertiesAsArray(true);

                    const propSortedDesc = ontoRes.getPropertiesAsArray(false);

                    expect(propSortedAsc[0].label).toEqual('Additional Folium');
                    expect(propSortedDesc[0].label).toEqual(undefined);

                });
        }));

        it('should sort resource classes by label in asc or desc order', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

            expect(ontologyCacheService).toBeDefined();

            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0801/beol/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const resClassSortedAsc = ontoRes.getResourceClassesAsArray(true);

                    const resClassSortedDesc = ontoRes.getResourceClassesAsArray(false);

                    expect(resClassSortedAsc[0].label).toEqual('Archive');
                    expect(resClassSortedDesc[0].label).toEqual('Written source');

                });
        }));


        it('should get an internal representation of a property from the cache', inject([OntologyService], (ontoService) => {

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

            expect(ontologyCacheService).toBeDefined();

            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://0.0.0.0:3333/ontology/0801/beol/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const props = ontoRes.getProperties();

                    const commentExpected = new Property(
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#comment',
                        'http://api.knora.org/ontology/knora-api/v2#TextValue',
                        'Comment',
                        'Comment',
                        ['http://api.knora.org/ontology/knora-api/v2#hasComment'],
                        true,
                        false,
                        false,
                        []
                    );

                    expect(props['http://0.0.0.0:3333/ontology/0801/beol/v2#comment']).toEqual(commentExpected);

                    const sonExpected = new Property(
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSon',
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#person',
                        'Repräsentiert eine Vater-Sohn Beziehung',
                        'has son',
                        ['http://api.knora.org/ontology/knora-api/v2#hasLinkTo'],
                        true,
                        true,
                        false,
                        []
                    );

                    expect(props['http://0.0.0.0:3333/ontology/0801/beol/v2#hasSon']).toEqual(sonExpected);

                    const sonValueExpected = new Property(
                        'http://0.0.0.0:3333/ontology/0801/beol/v2#hasSonValue',
                        'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                        'Repräsentiert eine Vater-Sohn Beziehung',
                        'has son',
                        ['http://api.knora.org/ontology/knora-api/v2#hasLinkToValue'],
                        true,
                        false,
                        true,
                        []
                    );

                    expect(props['http://0.0.0.0:3333/ontology/0801/beol/v2#hasSonValue']).toEqual(sonValueExpected);

                }
            );


        }));

        it('should convert and cache the Knora-API ontology complex', inject([OntologyService], (ontoService: OntologyService) => {

            // expected resource classes defined in the knora api ontology
            const resClassesInKnoraApi = [
                'http://api.knora.org/ontology/knora-api/v2#Annotation',
                'http://api.knora.org/ontology/knora-api/v2#AudioRepresentation',
                'http://api.knora.org/ontology/knora-api/v2#DDDRepresentation',
                'http://api.knora.org/ontology/knora-api/v2#DocumentRepresentation',
                'http://api.knora.org/ontology/knora-api/v2#LinkObj',
                'http://api.knora.org/ontology/knora-api/v2#MovingImageRepresentation',
                'http://api.knora.org/ontology/knora-api/v2#Region',
                'http://api.knora.org/ontology/knora-api/v2#Representation',
                'http://api.knora.org/ontology/knora-api/v2#StillImageRepresentation',
                'http://api.knora.org/ontology/knora-api/v2#TextRepresentation',
                'http://api.knora.org/ontology/knora-api/v2#XSLTransformation'
            ];

            // serve ontology as JSON-LD when requested
            spyOn(ontoService, 'getAllEntityDefinitionsForOntologies').and.callFake(serveOntology);

            expect(ontologyCacheService).toBeDefined();

            const ontoResponseObs: Observable<OntologyInformation> = ontologyCacheService.getEntityDefinitionsForOntologies(['http://api.knora.org/ontology/knora-api/v2']);

            ontoResponseObs.subscribe(
                (ontoRes: OntologyInformation) => {

                    const resClassesForKnoraApi = ontoRes.getResourceClassForOntology();

                    expect(resClassesForKnoraApi['http://api.knora.org/ontology/knora-api/v2']).toEqual(resClassesInKnoraApi);

                }
            );

        }));

    });

});
