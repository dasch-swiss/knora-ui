import {TestBed, inject} from '@angular/core/testing';

import {ApiService} from './api.service';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {KuiCoreModule} from '../core.module';

describe('ApiService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                KuiCoreModule.forRoot({api: '', app: '', media: ''})
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
