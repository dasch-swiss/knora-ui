import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { SearchParamsService } from './search-params.service';

describe('SearchParamsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let searchParamsService: SearchParamsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        SearchParamsService
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    searchParamsService = TestBed.get(SearchParamsService);

  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', inject([SearchParamsService], (service: SearchParamsService) => {
    expect(service).toBeDefined();
  }));

});
