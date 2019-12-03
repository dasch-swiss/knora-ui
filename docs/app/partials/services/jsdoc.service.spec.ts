import { inject, TestBed } from '@angular/core/testing';

import { JsdocService } from './jsdoc.service';

describe('JsdocService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [JsdocService]
    });
  });

  it('should be created', inject([JsdocService], (service: JsdocService) => {
    expect(service).toBeTruthy();
  }));
});
