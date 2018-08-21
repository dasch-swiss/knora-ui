import { inject, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { SessionService } from './session.service';

describe('SessionService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                HttpClient,
                SessionService
            ]
        });
    });

    it('should be created', inject([SessionService], (service: SessionService) => {
        expect(service).toBeTruthy();
    }));
});
