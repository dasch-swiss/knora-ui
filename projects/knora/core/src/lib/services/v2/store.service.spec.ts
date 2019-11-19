import { HttpClientModule } from '@angular/common/http';
import { inject, TestBed } from '@angular/core/testing';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '../../core.module';

import { StoreService } from './store.service';

describe('StoreService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientModule,
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
                StoreService,
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
    });

    it('should be created', inject([StoreService], (service: StoreService) => {
        expect(service).toBeTruthy();
    }));

    /* if (this.config.type === 'integration') {

      it('#resetTriplestoreContent should load test data [it]', async(inject(
        [StoreService], (service) => {

          expect(service).toBeDefined();

          service.resetTriplestoreContent([])
            .subscribe(
              (result: string) => {
                expect(result).toBe('success');
              });

        })), 300000);

    } else {
      it('integration tests skipped. run  "ng test --env=it".');
    } */


});
