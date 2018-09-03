import { inject, TestBed } from '@angular/core/testing';

import { IncomingService } from './incoming.service';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';

describe('IncomingService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
      ],
      providers: [IncomingService]
    });
  });

  it('should be created', inject([IncomingService], (service: IncomingService) => {
    expect(service).toBeTruthy();
  }));
});
