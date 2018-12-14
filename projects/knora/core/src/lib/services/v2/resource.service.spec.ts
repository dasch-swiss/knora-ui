import { async, TestBed, } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { ResourceService } from './resource.service';
import { ReadResourcesSequence } from '../../declarations';
import { KuiCoreModule } from '../../core.module';
import { OntologyCacheService, OntologyInformation, Properties, ResourceClasses } from './ontology-cache.service';
import { of } from 'rxjs';

describe('ResourceService', () => {
    let httpTestingController: HttpTestingController;
    let ontoCacheSpy: jasmine.SpyObj<OntologyCacheService>;

    let resourceService: ResourceService;
    let expectedResource;

    beforeEach(() => {
        const spyOntoCache = jasmine.createSpyObj('OntologyCacheService', ['getResourceClassDefinitions']);

        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [
                ApiService,
                ResourceService,
                {provide: OntologyCacheService, useValue: spyOntoCache}
            ]
        });

        httpTestingController = TestBed.get(HttpTestingController);
        resourceService = TestBed.get(ResourceService);

        ontoCacheSpy = TestBed.get(OntologyCacheService);

        ontoCacheSpy.getResourceClassDefinitions.and.callFake(
            () => {
                const resourceClassesThing: ResourceClasses = require('../../test-data/ontologyinformation/thing-resource-classes.json');
                const propertiesThing: Properties = require('../../test-data/ontologyinformation/thing-properties.json');

                return of(new OntologyInformation({}, resourceClassesThing, propertiesThing));
            }
        );

    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(resourceService).toBeTruthy();
    });

    it('should request a resource from Knora', () => {
        expectedResource = require('../../test-data/resources/Testthing.json');

        resourceService.getResource('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw').subscribe(
            (res) => {
                expect(res.body).toEqual(expectedResource);
            }
        );

        const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/resources/' + encodeURIComponent('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw'));

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.flush(expectedResource);
    });

    it('should request a resource from Knora as a sequence of ReadResource', async(() => {
        expectedResource = require('../../test-data/resources/Testthing.json');

        resourceService.getReadResourceSequence('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw').subscribe(
            (res: ReadResourcesSequence) => {

                expect(res.numberOfResources).toEqual(1);
                expect(res.resources[0].id).toEqual('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');
                expect(res.resources[0].type).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#Thing');

                expect(Object.keys(res.resources[0].properties).length).toEqual(12);

                const propertiesThing: Properties = require('../../test-data/ontologyinformation/thing-properties.json');
                expect(res.ontologyInformation.getProperties()).toEqual(propertiesThing);

                const resourceClassesThing: ResourceClasses = require('../../test-data/ontologyinformation/thing-resource-classes.json');
                expect(res.ontologyInformation.getResourceClasses()).toEqual(resourceClassesThing);
            }
        );

        const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/resources/' + encodeURIComponent('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw'));

        expect(httpRequest.request.method).toEqual('GET');

        httpRequest.flush(expectedResource);
    }));

});
