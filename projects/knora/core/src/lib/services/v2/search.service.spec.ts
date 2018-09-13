import { inject, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient } from '@angular/common/http';

import { SearchService } from './search.service';
import { KuiCoreModule } from '../../core.module';
import { ApiService } from '../api.service';

describe('SearchService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let searchService: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
      ],
      providers: [ApiService, SearchService]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    searchService = TestBed.get(SearchService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(searchService).toBeDefined();
  });

});
