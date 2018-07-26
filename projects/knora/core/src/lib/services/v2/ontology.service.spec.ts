import { inject, TestBed } from '@angular/core/testing';

import { OntologyService } from './ontology.service';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';

describe('OntologyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
      ],
      providers: [OntologyService]
    });
  });

  it('should be created', inject([OntologyService], (service: OntologyService) => {
    expect(service).toBeTruthy();
  }));
});
