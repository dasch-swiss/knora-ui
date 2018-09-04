import { inject, TestBed } from '@angular/core/testing';

import { IncomingService } from './incoming.service';
import { HttpClient } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './search.service';

fdescribe('IncomingService', () => {

  /* let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;
  let incomingService: IncomingService; */

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
      ],
      providers: [SearchService, IncomingService]
    });

    /* httpClient = TestBed.get(HttpClient);
    httpTestingController = TestBed.get(HttpTestingController);
    incomingService = TestBed.get(IncomingService); */
  });

  /* afterEach(() => {
    httpTestingController.verify();
  }); */

  fit('should be created', inject([IncomingService], (service: IncomingService) => {
    expect(service).toBeTruthy();
  }));

  fit ('should get incoming regions ', inject([IncomingService, SearchService], (incomingService: IncomingService, searchService: SearchService) => {
    const query = incomingService.getIncomingRegions('http://rdfh.ch/0fb54d8bd503', 0);

    const expectedQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
CONSTRUCT {
    ?region knora-api:isMainResource true .

    ?region knora-api:hasGeometry ?geom .

    ?region knora-api:hasComment ?comment .

    ?region knora-api:hasColor ?color .


} WHERE {
    ?region a knora-api:Region .
    ?region a knora-api:Resource .

    ?region knora-api:isRegionOf <http://rdfh.ch/0fb54d8bd503> .
    knora-api:isRegionOf knora-api:objectType knora-api:Resource .

    <http://rdfh.ch/0fb54d8bd503> a knora-api:Resource .

    ?region knora-api:hasGeometry ?geom .
    knora-api:hasGeometry knora-api:objectType knora-api:Geom .

    ?geom a knora-api:Geom .

    ?region knora-api:hasComment ?comment .
    knora-api:hasComment knora-api:objectType xsd:string .

    ?comment a xsd:string .

    ?region knora-api:hasColor ?color .
    knora-api:hasColor knora-api:objectType knora-api:Color .

    ?color a knora-api:Color .

}

OFFSET 0
`;

    const resultSearch = searchService.doExtendedSearch(expectedQuery);

    console.log('resultSearch ', resultSearch);
    console.log('query ', query);

    expect(query).toBe(resultSearch);

  }));

});
