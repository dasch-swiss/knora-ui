import { HttpClient } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { KuiCoreModule } from '../core.module';

import { ApiService } from './api.service';
import { HttpErrorHandler } from './http-error-handler.service';
import { MessageService } from './message.service';

fdescribe('ApiService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let apiService: ApiService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            // Import the HttpClient mocking services
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            // Provide the service-under-test and its dependencies
            providers: [
                ApiService,
                HttpErrorHandler,
                MessageService
            ]
        });

        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        apiService = TestBed.get(ApiService);
    });

    it('should be created', inject([ApiService], (service: ApiService) => {
        expect(service).toBeTruthy();
    }));


});
