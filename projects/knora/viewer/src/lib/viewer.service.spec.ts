import { TestBed, inject } from '@angular/core/testing';

import { ViewerService } from './viewer.service';

describe('ViewerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ViewerService]
    });
  });

  it('should be created', inject([ViewerService], (service: ViewerService) => {
    expect(service).toBeTruthy();
  }));
});
