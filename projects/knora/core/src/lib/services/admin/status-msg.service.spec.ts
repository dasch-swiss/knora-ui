import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { StatusMsgService } from './status-msg.service';
import { KuiCoreModule } from '../../core.module';

describe('StatusMsgService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '', ontologyIRI: '' })
      ],
      providers: [StatusMsgService]
    });
  });

  it('should be created', inject([StatusMsgService], (service: StatusMsgService) => {
    expect(service).toBeTruthy();
  }));
});
