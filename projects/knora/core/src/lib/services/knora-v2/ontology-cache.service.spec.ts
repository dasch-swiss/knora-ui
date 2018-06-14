import { TestBed, inject } from '@angular/core/testing';

import { OntologyCacheService } from './ontology-cache.service';

describe('OntologyCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OntologyCacheService]
    });
  });

  it('should be created', inject([OntologyCacheService], (service: OntologyCacheService) => {
    expect(service).toBeTruthy();
  }));
});
