import { ReadTextValueAsString } from './read-property-item';

describe('ReadPropertyItem', () => {

    it('should create a ReadTextValueAsString', () => {

        const stringItem = new ReadTextValueAsString('http://rdfh.ch/00c650d23303/values/af68552c3626', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#description', 'This is a test');

        expect(stringItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(stringItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');
        expect(stringItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#description');
        expect(stringItem.str).toEqual('This is a test');
        expect(stringItem.getClassName()).toEqual('ReadTextValueAsString');
    });



});
