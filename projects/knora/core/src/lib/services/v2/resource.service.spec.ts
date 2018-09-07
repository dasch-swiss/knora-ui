import { async, inject, TestBed, } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../api.service';
import { ResourceService } from './resource.service';
import { ApiServiceError, ApiServiceResult, ReadResource } from '../../declarations';
import { KuiCoreModule } from '../../core.module';
import { Observable, of } from 'rxjs';

describe('ResourceService', () => {
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
        resourceService = TestBed.get(ResourceService);
    });

    describe('#getResource', () => {

        let expectedResource;

        beforeEach(() => {
            expectedResource = require('../../test-data/resources/Testthing.json');
        });

        it('should be created', () => {
            expect(resourceService).toBeTruthy();
        });

        /* // TODO: need to fix this test once the resourceService has been refactored

        fit('should return a resource', inject([ResourceService], (service: ResourceService) => {

            spyOn(service, 'getResource').and.callFake(() => {
                const result = new ApiServiceResult();
                result.status = 200;
                result.statusText = '';
                result.url = '';
                result.body = expectedResource;

                return of(result);
            });

            expect(resourceService).toBeDefined();

            const getResource: Observable<ApiServiceResult> = resourceService.getResource('http://rdfh.ch/0001/H6gBWUuJSuuO-CilHV8kQw');

            const resource = [

            ];

            getResource.subscribe(
                (result: any) => {
                    expect(result.body).toEqual(resource);
                },
                (error: ApiServiceError) => {
                    fail(error);
                }
            );

        })); */


    });

});
