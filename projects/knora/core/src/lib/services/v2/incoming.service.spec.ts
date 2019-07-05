import { TestBed } from '@angular/core/testing';
import { KuiCoreModule } from '../../core.module';

import { IncomingService } from './incoming.service';
import { SearchService } from './search.service';

describe('IncomingService', () => {

    let incomingService: IncomingService;
    let serviceSpy: jasmine.SpyObj<SearchService>;

    beforeEach(() => {
        const spy = jasmine.createSpyObj('SearchService', ['doExtendedSearchReadResourceSequence']);

        TestBed.configureTestingModule({
            imports: [
                KuiCoreModule.forRoot({ name: '', api: 'http://0.0.0.0:3333', app: '', media: '' })
            ],
            providers: [
                IncomingService,
                { provide: SearchService, useValue: spy }
            ]
        });

        incomingService = TestBed.get(IncomingService);
        serviceSpy = TestBed.get(SearchService);
        serviceSpy.doExtendedSearchReadResourceSequence.and.stub();
    });

    xit('should be created', () => {
        console.log(incomingService);
        expect(incomingService).toBeTruthy();
    });

    xit('should get incoming regions ', () => {

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

?region knora-api:isRegionOf <http://rdfh.ch/0801/letter> .
knora-api:isRegionOf knora-api:objectType knora-api:Resource .

<http://rdfh.ch/0801/letter> a knora-api:Resource .

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

        incomingService.getIncomingRegions('http://rdfh.ch/0801/letter', 0);

        expect(serviceSpy).toHaveBeenCalledWith(expectedQuery);

    });

    xit('should get incoming StillImageRepresentations ', () => {

        const expectedQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>

CONSTRUCT {
?page knora-api:isMainResource true .

?page knora-api:seqnum ?seqnum .

?page knora-api:hasStillImageFile ?file .
} WHERE {

?page a knora-api:StillImageRepresentation .
?page a knora-api:Resource .

?page knora-api:isPartOf <http://rdfh.ch/0801/letter> .
knora-api:isPartOf knora-api:objectType knora-api:Resource .

<http://rdfh.ch/0801/letter> a knora-api:Resource .

?page knora-api:seqnum ?seqnum .
knora-api:seqnum knora-api:objectType xsd:integer .

?seqnum a xsd:integer .

?page knora-api:hasStillImageFile ?file .
knora-api:hasStillImageFile knora-api:objectType knora-api:File .

?file a knora-api:File .

} ORDER BY ?seqnum
OFFSET 1
`;

        incomingService.getStillImageRepresentationsForCompoundResource('http://rdfh.ch/0801/letter', 1);

        expect(serviceSpy).toHaveBeenCalledWith(expectedQuery);

    });

    xit('should get incoming Links', () => {

        const expectedQuery = `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>

CONSTRUCT {
?incomingRes knora-api:isMainResource true .

?incomingRes ?incomingProp <http://rdfh.ch/0801/letter> .

} WHERE {

?incomingRes a knora-api:Resource .

?incomingRes ?incomingProp <http://rdfh.ch/0801/letter> .

<http://rdfh.ch/0801/letter> a knora-api:Resource .

?incomingProp knora-api:objectType knora-api:Resource .

knora-api:isRegionOf knora-api:objectType knora-api:Resource .
knora-api:isPartOf knora-api:objectType knora-api:Resource .

FILTER NOT EXISTS {
 ?incomingRes  knora-api:isRegionOf <http://rdfh.ch/0801/letter> .
}

FILTER NOT EXISTS {
 ?incomingRes  knora-api:isPartOf <http://rdfh.ch/0801/letter> .
}

} OFFSET 0
`;

        incomingService.getIncomingLinksForResource('http://rdfh.ch/0801/letter', 0);

        expect(serviceSpy).toHaveBeenCalledWith(expectedQuery);

    });

});
