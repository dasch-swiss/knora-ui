import { async, inject, TestBed,  } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../api.service';
import { ResourceService } from './resource.service';
import { ApiServiceResult } from '../../declarations';
import { KuiCoreModule } from '../../core.module';

describe('ResourceService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let resourceService: ResourceService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [
                ApiService,
                ResourceService
            ]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        resourceService = TestBed.get(resourceService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', inject([ResourceService], (service: ResourceService) => {
        expect(service).toBeTruthy();
    }));

   /*  fdescribe('#getResource', () => {
        let expectedResource;
        // const iri: string = 'http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw';

        beforeEach(() => {
            expectedResource = require('../../test-data/resources/Testthing.json') as String;
        });

        fit('should be created', inject(
            [ResourceService], (service: ResourceService) => {
                expect(service).toBeDefined();
            }
        ));
 */
        /* it('should return a resource', async(inject(
            [ResourceService], (service: ResourceService) => {

            expect(service).toBeDefined();
            service.getResource(iri).subscribe((result: ApiServiceResult) => {
                expect(result.body).toEqual(expectedResource);
            });

            const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/v2/resources/' + encodeURIComponent(iri));

            expect(httpRequest.request.method).toEqual('GET');

            httpRequest.flush(expectedResource);
        }))); */
    // });

});
