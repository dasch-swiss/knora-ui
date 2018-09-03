import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';
import {
    Cardinality, CardinalityOccurrence,
    OntologyCacheService,
    OntologyInformation, Properties, Property, ResourceClass, ResourceClasses,
    ResourceClassIrisForOntology
} from './ontology-cache.service';
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
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
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

                console.log(ontologyIri);

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
                            CardinalityOccurrence.minCard,
                            0,
                            'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink'
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
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThingValue'
                        ),
                        new Cardinality(
                            CardinalityOccurrence.minCard,
                            0,
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThing'
                        )
                    ];

                    const expectedSomething = new ResourceClass(
                        'http://0.0.0.0:3333/ontology/0001/something/v2#Something',
                        'something.png',
                        'A something is a thing.',
                        'Something',
                        expectedCards
                    );

                    expect(resourceClasses['http://0.0.0.0:3333/ontology/0001/something/v2#Something']).toEqual(expectedSomething);

                    const expectedProps = {
                        'http://api.knora.org/ontology/knora-api/v2#attachedToProject': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#attachedToProject',
                            'http://api.knora.org/ontology/knora-api/v2#knoraProject',
                            'Connects something to a project',
                            'attached to project',
                            [],
                            false,
                            false,
                            false),
                        'http://api.knora.org/ontology/knora-api/v2#attachedToUser': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#attachedToUser',
                            'http://api.knora.org/ontology/knora-api/v2#User',
                            'Connects something to a user',
                            'attached to user',
                            [],
                            false,
                            false,
                            false),
                        'http://api.knora.org/ontology/knora-api/v2#creationDate': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#creationDate',
                            'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
                            'Indicates when a resource was created',
                            undefined,
                            [],
                            false,
                            false,
                            false),
                        'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            'Indicates that this resource referred to by another resource',
                            'has incoming links',
                            ['http://api.knora.org/ontology/knora-api/v2#hasLinkToValue'],
                            false,
                            false,
                            true),
                        'http://api.knora.org/ontology/knora-api/v2#hasPermissions': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasPermissions',
                            'http://www.w3.org/2001/XMLSchema#string',
                            undefined,
                            undefined,
                            [],
                            false,
                            false,
                            false),
                        'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo',
                            'http://api.knora.org/ontology/knora-api/v2#Resource',
                            'Represents a link in standoff markup from one resource to another.',
                            'has Standoff Link to',
                            ['http://api.knora.org/ontology/knora-api/v2#hasLinkTo'],
                            false,
                            true,
                            false),
                        'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            'Represents a link in standoff markup from one resource to another.',
                            'has Standoff Link to',
                            ['http://api.knora.org/ontology/knora-api/v2#hasLinkToValue'],
                            false,
                            false,
                            true),
                        'http://api.knora.org/ontology/knora-api/v2#lastModificationDate': new Property(
                            'http://api.knora.org/ontology/knora-api/v2#lastModificationDate',
                            'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
                            undefined,
                            undefined,
                            [],
                            false,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem',
                            'http://api.knora.org/ontology/knora-api/v2#ListValue',
                            undefined,
                            'List element',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherListItem',
                            'http://api.knora.org/ontology/knora-api/v2#ListValue',
                            undefined,
                            'Other list element',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething': new Property(
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething',
                            'http://0.0.0.0:3333/ontology/0001/something/v2#Something',
                            'Has another something.',
                            'has other something',
                            ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing'],
                            true,
                            true,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue': new Property(
                            'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            'Has another something.',
                            'has other something',
                            ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue'],
                            true,
                            false,
                            true),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasRichtext',
                            'http://api.knora.org/ontology/knora-api/v2#TextValue',
                            undefined,
                            'Text',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText',
                            'http://api.knora.org/ontology/knora-api/v2#TextValue',
                            undefined,
                            'Text',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDate',
                            'http://api.knora.org/ontology/knora-api/v2#DateValue',
                            undefined,
                            'Date',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger',
                            'http://api.knora.org/ontology/knora-api/v2#IntValue',
                            undefined,
                            'Integer',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasDecimal',
                            'http://api.knora.org/ontology/knora-api/v2#DecimalValue',
                            undefined,
                            'Decimal number',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBoolean',
                            'http://api.knora.org/ontology/knora-api/v2#BooleanValue',
                            undefined,
                            'Boolean value',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasUri',
                            'http://api.knora.org/ontology/knora-api/v2#UriValue',
                            undefined,
                            'URI',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInterval',
                            'http://api.knora.org/ontology/knora-api/v2#IntervalValue',
                            undefined,
                            'Time interval',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasColor',
                            'http://api.knora.org/ontology/knora-api/v2#ColorValue',
                            undefined,
                            'Color',
                            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
                            true,
                            false,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPicture': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPicture',
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#ThingPicture',
                            undefined,
                            'Picture of a thing',
                            ['http://api.knora.org/ontology/knora-api/v2#hasRepresentation'],
                            true,
                            true,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPictureValue': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasThingPictureValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            undefined,
                            'Picture of a thing',
                            ['http://api.knora.org/ontology/knora-api/v2#hasRepresentationValue'],
                            true,
                            false,
                            true),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThing': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThing',
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#Thing',
                            undefined,
                            'is part of',
                            ['http://api.knora.org/ontology/knora-api/v2#isPartOf'],
                            true,
                            true,
                            false),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThingValue': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#isPartOfOtherThingValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            undefined,
                            'is part of',
                            ['http://api.knora.org/ontology/knora-api/v2#isPartOfValue'],
                            true,
                            false,
                            true),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThingValue': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThingValue',
                            'http://api.knora.org/ontology/knora-api/v2#LinkValue',
                            undefined,
                            'A blue thing',
                            ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue'],
                            true,
                            false,
                            true),
                        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThing': new Property(
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasBlueThing',
                            'http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing',
                            undefined,
                            'A blue thing',
                            ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing'],
                            true,
                            true,
                            false)
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
                                CardinalityOccurrence.minCard,
                                0,
                                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink'
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

                        ]
                    );

                    expect(resourceClasses['http://0.0.0.0:3333/ontology/0801/beol/v2#person']).toEqual(personExpected);

                }
            );

        }));


    });

});
