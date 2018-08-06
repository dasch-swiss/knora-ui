import { TestBed, inject } from '@angular/core/testing';

import { AuthenticationCacheService } from './authentication-cache.service';

describe('AuthenticationCacheService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AuthenticationCacheService]
    });
  });

  it('should be created', inject([AuthenticationCacheService], (service: AuthenticationCacheService) => {
    expect(service).toBeTruthy();
  }));
});
