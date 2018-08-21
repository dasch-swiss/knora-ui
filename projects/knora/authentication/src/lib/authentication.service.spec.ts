import { inject, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule
            ],
            providers: [
                HttpClient,
                AuthenticationService
            ]
        });
    });

    it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
        expect(service).toBeTruthy();
    }));
});
