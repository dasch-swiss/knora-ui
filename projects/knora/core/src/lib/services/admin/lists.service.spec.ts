import { async, inject, TestBed } from '@angular/core/testing';
import { ListsService } from './lists.service';
import { HttpClient } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ApiService } from '../api.service';
import { List } from '@knora/core/lib/declarations/knora-api/admin/lists/list';
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

  describe('#getList', () => {
    const expectLists: List[] = listsTestData;
    const expectList: List = listsResponseJson;

    it('should be created', inject([ListsService], (service: ListsService) => {
      expect(service).toBeTruthy();
    }));

    it('should return all lists', async(inject(
      [ListsService], (service) => {

        expect(service).toBeDefined();

        service.getLists(incunabulaProjectIri).subscribe((result) => {
          expect(result.body).toEqual(expectLists);
        });

        // listService should have made one request to GET lists from expected URL
        const req = httpTestingController.expectOne((request) => {
          return request.url.match(service.url) && request.method === 'GET';
        });

    })));

    fit('should return one list by iri', async(inject([ListsService], (service) => {

      expect(service).toBeDefined();

      service.getList('http://rdfh.ch/lists/FFFF/ynm01').subscribe((result) => {
        expect(result.body).toEqual(expectList);
      });

      const req = httpTestingController.expectOne((request) => {
        return request.url.match(service.url) && request.method === 'GET';
        });

    })));

  });

});
