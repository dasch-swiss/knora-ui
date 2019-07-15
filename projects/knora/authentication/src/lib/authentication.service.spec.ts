import { HttpClient, HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { KuiCoreModule } from '@knora/core';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
                KuiCoreModule.forRoot({ name: '', api: '', app: '', media: '', ontologyIRI: '' })
            ],
            providers: [
                AuthenticationService,
                HttpClient,
                HttpClientModule
            ],
        });
    });

    it('should be created', inject([AuthenticationService], (service: AuthenticationService) => {
        expect(service).toBeTruthy();
    }));
});
