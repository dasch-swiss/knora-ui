import { ReadTextValueAsHtml, ReadTextValueAsString, ReferredResourcesByStandoffLink } from './read-property-item';
import { ReadResource } from '../../..';
import { OntologyInformation, ResourceClass } from '../../../../services';

describe('ReadPropertyItem', () => {

    it('should create a ReadTextValueAsString', () => {

        const stringItem = new ReadTextValueAsString('http://rdfh.ch/00c650d23303/values/af68552c3626', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#description', 'This is a test');

        expect(stringItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(stringItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');
        expect(stringItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#description');
        expect(stringItem.str).toEqual('This is a test');
        expect(stringItem.getClassName()).toEqual('ReadTextValueAsString');
    });

    it('should create a ReadTextValueAsHtml', () => {

        const referredResourcesInStandoff: ReferredResourcesByStandoffLink = {
            'http://rdfh.ch/test': new ReadResource('http://rdfh.ch/test',
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
                'test resource',
                [],
                [],
                [],
                [],
                {}
                )
        };

        const stringItem = new ReadTextValueAsHtml('http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#description',
            'This is a test with <a href="http://rdfh.ch/test" class="salsah-link">a standoff link</a>',
            referredResourcesInStandoff);


        const resClasses = {
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book': new ResourceClass(
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
                'book.png',
                'A book',
                'book',
                [])
        };

        const ontoInfo = new OntologyInformation({}, resClasses, {});

        expect(stringItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(stringItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');
        expect(stringItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#description');
        expect(stringItem.html).toEqual('This is a test with <a href="http://rdfh.ch/test" class="salsah-link">a standoff link</a>');
        expect(stringItem.getClassName()).toEqual('ReadTextValueAsHtml');

        expect(stringItem.referredResources).toBe(referredResourcesInStandoff);
        expect(stringItem.getReferredResourceInfo('http://rdfh.ch/test', ontoInfo)).toEqual('test resource (book)');
        
    });

});
