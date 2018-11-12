import { TestBed } from '@angular/core/testing';
import { KuiCoreModule } from '../../core.module';

import { IncomingService } from './incoming.service';

describe('IncomingService', () => {

    let incomingService: IncomingService;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiCoreModule.forRoot({name: '', api: 'http://0.0.0.0:3333', app: '', media: ''})
            ],
            providers: [IncomingService]
        });

        incomingService = TestBed.get(IncomingService);
    });

    it('should be created', () => {
        expect(incomingService).toBeDefined();
    });

    it('should get incoming regions ', () => {

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


        const incrementSpy = spyOn(incomingService, 'doExtendedSearch').and.stub();

        incomingService.getIncomingRegions('http://0.0.0.0:3333/ontology/0801/beol/v2#letter', 0);

        expect(incrementSpy).toHaveBeenCalledWith(expectedQuery);

    });

});
