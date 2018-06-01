import {TestBed, inject} from '@angular/core/testing';

import {ApiService} from './api.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';

describe('ApiService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                ApiService,
                HttpClient
            ]
        });
    });

    it('should be created', inject([ApiService], (service: ApiService) => {
        expect(service).toBeTruthy();
    }));
});
