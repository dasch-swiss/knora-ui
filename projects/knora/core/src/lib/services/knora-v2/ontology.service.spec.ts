import { TestBed, inject } from '@angular/core/testing';

import { OntologyService } from './ontology.service';

describe('OntologyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OntologyService]
    });
  });

  it('should be created', inject([OntologyService], (service: OntologyService) => {
    expect(service).toBeTruthy();
  }));
});
