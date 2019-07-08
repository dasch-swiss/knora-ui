import { async, inject, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';

import { StoreService } from './store.service';
import { KuiCoreModule } from '../../core.module';

describe('StoreService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '', ontologyIRI: '' })
      ],
      providers: [StoreService]
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
