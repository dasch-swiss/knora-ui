import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from './core.module';
import { SessionService } from './session.service';

describe('SessionService', () => {
    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let sessionService: SessionService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({
                    knora: {
                        apiProtocol: 'http',
                        apiHost: '0.0.0.0',
                        apiPort: 3333,
                        apiUrl: '',
                        apiPath: '',
                        jsonWebToken: '',
                        logErrors: true
                    },
                    app: {
                        name: 'Knora-UI-APP',
                        url: 'localhost:4200'
                    }
                })
            ],
            providers: [
                SessionService,
                {
                    provide: KnoraApiConfigToken,
                    useValue: KnoraApiConfig
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: KnoraApiConnection
                }
            ]
        });


        // Inject the http, test controller, and service-under-test
        // as they will be referenced by each test.
        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        sessionService = TestBed.get(SessionService);
    });

    it('should be created', inject([SessionService], (service: SessionService) => {
        expect(service).toBeTruthy();
    }));
});
