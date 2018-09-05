import { async, inject, TestBed } from '@angular/core/testing';
import { ListsService } from './lists.service';
import { HttpClient } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { List } from '../../declarations';
import { incunabulaProjectIri, listsResponseJson, listsTestData } from '../../test-data/admin/shared-test-data';

describe('ListsService', () => {
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let listService: ListsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
      ],
      providers: [
        ApiService,
        ListsService
      ]
    });

    httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    listService = TestBed.get(ListsService);
  });

  afterEach(() => {
    // After every test, assert that there are no more pending requests.
    httpTestingController.verify();
  });

  describe('#getLists', () => {
    const expectLists: List[] = listsTestData;
    const expectList: List = listsResponseJson;

    it('should be created', inject([ListsService], (service: ListsService) => {
      expect(service).toBeTruthy();
    }));

    it('should return all lists', () => {

      expect(listService).toBeDefined();

      listService.getLists(incunabulaProjectIri).subscribe((result) => {
        expect(result).toEqual(expectLists);
      });

      const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/admin/lists?projectIri=' + encodeURIComponent(incunabulaProjectIri));

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.flush(expectLists);


    });

    it('should return one list by iri', () => {

      expect(listService).toBeDefined();

      listService.getList('http://rdfh.ch/lists/FFFF/ynm01').subscribe((result) => {
        expect(result).toEqual(expectList);
      });

      const httpRequest = httpTestingController.expectOne('http://0.0.0.0:3333/admin/lists/' + encodeURIComponent('http://rdfh.ch/lists/FFFF/ynm01'));

      expect(httpRequest.request.method).toEqual('GET');

      httpRequest.flush(expectList);

    });

  });

});
