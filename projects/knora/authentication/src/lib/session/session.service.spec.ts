import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { KuiCoreModule } from '@knora/core';

import { SessionService } from './session.service';

describe('SessionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                KuiCoreModule.forRoot({name: '', api: '', app: '', media: ''})
            ],
            providers: [
                SessionService,
                HttpClient,
                HttpClientModule
            ]
        });
    });

    it('should be created', inject([SessionService], (service: SessionService) => {
        expect(service).toBeTruthy();
    }));
});
