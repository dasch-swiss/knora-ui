import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { KuiCoreModule } from '@knora/core';
import { AuthenticationService } from './authentication.service';
import { SessionService } from './session/session.service';


describe('AuthenticationService', () => {

    let authService: AuthenticationService;
    let httpTestingController: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: '', app: '', media: '', ontologyIRI: '' })
            ],
            providers: [
                AuthenticationService,
                SessionService
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
