import { async, inject, TestBed } from '@angular/core/testing';

import { IncomingService } from './incoming.service';
import { HttpClient } from '@angular/common/http';
import { KuiCoreModule } from '../../core.module';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { SearchService } from './search.service';

describe('IncomingService', () => {

    let httpClient: HttpClient;
    let httpTestingController: HttpTestingController;
    let incomingService: IncomingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                HttpClientTestingModule,
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [SearchService, IncomingService]
        });

        httpClient = TestBed.get(HttpClient);
        httpTestingController = TestBed.get(HttpTestingController);
        incomingService = TestBed.get(IncomingService);
    });

    afterEach(() => {
        httpTestingController.verify();
    });

    it('should be created', inject([IncomingService], (service: IncomingService) => {
        expect(service).toBeDefined();
    }));

    it('should get incoming regions ', async(inject([SearchService], (searchService: SearchService) => {
        const query = incomingService.getIncomingRegions('http://0.0.0.0:3333/ontology/0801/beol/v2#letter', 0);

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

?region knora-api:isRegionOf <http://0.0.0.0:3333/ontology/0801/beol/v2#letter> .
knora-api:isRegionOf knora-api:objectType knora-api:Resource .

<http://0.0.0.0:3333/ontology/0801/beol/v2#letter> a knora-api:Resource .

?region knora-api:hasGeometry ?geom .
knora-api:hasGeometry knora-api:objectType knora-api:Geom .

?geom a knora-api:Geom .

?region knora-api:hasComment ?comment .
knora-api:hasComment knora-api:objectType xsd:string .

?comment a xsd:string .

?region knora-api:hasColor ?color .
knora-api:hasColor knora-api:objectType knora-api:Color .

?color a knora-api:Color .
} OFFSET 0
`;

        const resultSearch = searchService.doExtendedSearch(expectedQuery);

        /* console.log('resultSearch ', resultSearch);
        console.log('query ', query); */

        expect(query).toEqual(resultSearch);

    })));

});
