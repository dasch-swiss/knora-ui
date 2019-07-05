import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { KuiCoreModule } from '@knora/core';

import { AuthenticationService } from './authentication.service';

describe('AuthenticationService', () => {

    let authService: AuthenticationService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [
                AuthenticationService
            ],
        });

        httpTestingController = TestBed.get(HttpTestingController);
        authService = TestBed.get(AuthenticationService);
    });

    afterEach(() => {
        // After every test, assert that there are no more pending requests.
        httpTestingController.verify();
    });

    it('should be created', () => {
        expect(authService).toBeTruthy();
    });
});
