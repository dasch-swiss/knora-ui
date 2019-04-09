import {
    Point2D,
    ReadBooleanValue,
    ReadColorValue,
    ReadDateValue,
    ReadDecimalValue,
    ReadGeomValue,
    ReadIntegerValue,
    ReadIntervalValue,
    ReadLinkValue,
    ReadListValue,
    ReadStillImageFileValue,
    ReadTextFileValue,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml,
    ReadUriValue,
    ReferredResourcesByStandoffLink,
    RegionGeometry
} from './read-property-item';
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
        expect(stringItem.getContent()).toEqual('This is a test');
    });

    it('should create a ReadTextValueAsHtml', () => {

        const referredResourcesInStandoff: ReferredResourcesByStandoffLink = {
            'http://rdfh.ch/test': testResource
        };

        const htmlItem = new ReadTextValueAsHtml('http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#description',
            'This is a test with <a href="http://rdfh.ch/test" class="salsah-link">a standoff link</a>',
            referredResourcesInStandoff);

        expect(htmlItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(htmlItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');
        expect(htmlItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#description');
        expect(htmlItem.html).toEqual('This is a test with <a href="http://rdfh.ch/test" class="salsah-link">a standoff link</a>');
        expect(htmlItem.getClassName()).toEqual('ReadTextValueAsHtml');
        expect(htmlItem.getContent()).toEqual('This is a test with <a href="http://rdfh.ch/test" class="salsah-link">a standoff link</a>');

        expect(htmlItem.referredResources).toBe(referredResourcesInStandoff);
        expect(htmlItem.getReferredResourceInfo('http://rdfh.ch/test', ontologyInfo)).toEqual('test resource (book)');

    });

    it('should create a ReadTextValueAsXml', () => {

        const xmlItem = new ReadTextValueAsXml('http://rdfh.ch/00c650d23303/values/af68552c3626', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#description', '<root>This is a test</root>', 'http://rdfh.ch/00c650d23303/mappings/af68552c3626');

        expect(xmlItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(xmlItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextValue');
        expect(xmlItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#description');
        expect(xmlItem.xml).toEqual('<root>This is a test</root>');
        expect(xmlItem.mappingIri).toEqual('http://rdfh.ch/00c650d23303/mappings/af68552c3626');
        expect(xmlItem.getContent()).toEqual('<root>This is a test</root>');

        expect(xmlItem.getClassName()).toEqual('ReadTextValueAsXml');
    });

    it('should create a ReadDateValue for a precise date', () => {

        const dateItem = new ReadDateValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#pubDate',
            'GREGORIAN',
            2018,
            2018,
            'CE',
            'CE',
            5,
            5,
            18,
            18);

        expect(dateItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(dateItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#DateValue');
        expect(dateItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#pubDate');
        expect(dateItem.getClassName()).toEqual('ReadDateValue');

        expect(dateItem.startYear).toEqual(2018);
        expect(dateItem.endYear).toEqual(2018);
        expect(dateItem.startMonth).toEqual(5);
        expect(dateItem.endMonth).toEqual(5);
        expect(dateItem.startDay).toEqual(18);
        expect(dateItem.endDay).toEqual(18);
        expect(dateItem.startEra).toEqual('CE');
        expect(dateItem.endEra).toEqual('CE');

        expect(dateItem.getContent()).toEqual('GREGORIAN:(CE) 2018-5-18');
    });

    it('should create a ReadDateValue fro a period', () => {

        const dateItem = new ReadDateValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#pubDate',
            'GREGORIAN',
            2018,
            2019,
            'CE',
            'CE',
            5,
            6,
            18,
            19);

        expect(dateItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(dateItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#DateValue');
        expect(dateItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#pubDate');
        expect(dateItem.getClassName()).toEqual('ReadDateValue');

        expect(dateItem.startYear).toEqual(2018);
        expect(dateItem.endYear).toEqual(2019);
        expect(dateItem.startMonth).toEqual(5);
        expect(dateItem.endMonth).toEqual(6);
        expect(dateItem.startDay).toEqual(18);
        expect(dateItem.endDay).toEqual(19);
        expect(dateItem.startEra).toEqual('CE');
        expect(dateItem.endEra).toEqual('CE');

        expect(dateItem.getContent()).toEqual('GREGORIAN:(CE) 2018-5-18:(CE) 2019-6-19');
    });

    it('should create a ReadLinkValue with a referred resource Iri only', () => {

        const linkItem = new ReadLinkValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasReference',
            'http://rdfh.ch/test'
        );

        expect(linkItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(linkItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#LinkValue');
        expect(linkItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasReference');
        expect(linkItem.getClassName()).toEqual('ReadLinkValue');
        expect(linkItem.referredResourceIri).toEqual('http://rdfh.ch/test');
        expect(linkItem.getContent()).toEqual('http://rdfh.ch/test');

        expect(linkItem.getReferredResourceInfo(ontologyInfo)).toEqual('http://rdfh.ch/test');

    });

    it('should create a ReadLinkValue with a referred resource', () => {

        const linkItem = new ReadLinkValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasReference',
            'http://rdfh.ch/test',
            testResource
        );

        expect(linkItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(linkItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#LinkValue');
        expect(linkItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasReference');
        expect(linkItem.getClassName()).toEqual('ReadLinkValue');
        expect(linkItem.referredResourceIri).toEqual('http://rdfh.ch/test');
        expect(linkItem.getContent()).toEqual('test resource');

        expect(linkItem.getReferredResourceInfo(ontologyInfo)).toEqual('test resource (book)');

    });

    it('should create a ReadIntegerValue', () => {

        const intItem = new ReadIntegerValue('http://rdfh.ch/00c650d23303/values/af68552c3626', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasInteger', 1);

        expect(intItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(intItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#IntValue');
        expect(intItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasInteger');
        expect(intItem.getClassName()).toEqual('ReadIntegerValue');
        expect(intItem.getContent()).toEqual('1');

        expect(intItem.integer).toEqual(1);

    });

    it('should create a ReadDecimalValue', () => {

        const decItem = new ReadDecimalValue('http://rdfh.ch/00c650d23303/values/af68552c3626', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasDecimal', 1.1);

        expect(decItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(decItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#DecimalValue');
        expect(decItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasDecimal');
        expect(decItem.getClassName()).toEqual('ReadDecimalValue');
        expect(decItem.getContent()).toEqual('1.1');

        expect(decItem.decimal).toEqual(1.1);

    });

    it('should create a ReadStillImageFileValue (full)', () => {

        const imageItem = new ReadStillImageFileValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasImage',
            'incunabula_0000003856.jp2',
            'http://localhost:1024/knora',
            'http://localhost:1024/knora/incunabula_0000003856.jp2/full/1904,2700/0/default.jpg',
            1904,
            2700);

        expect(imageItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(imageItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#StillImageFileValue');
        expect(imageItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasImage');
        expect(imageItem.getClassName()).toEqual('ReadStillImageFileValue');
        expect(imageItem.getContent()).toEqual('http://localhost:1024/knora/incunabula_0000003856.jp2/full/1904,2700/0/default.jpg');

        expect(imageItem.imageFilename).toEqual('incunabula_0000003856.jp2');
        expect(imageItem.imageServerIIIFBaseURL).toEqual('http://localhost:1024/knora');
        expect(imageItem.imagePath).toEqual('http://localhost:1024/knora/incunabula_0000003856.jp2/full/1904,2700/0/default.jpg');
        expect(imageItem.dimX).toEqual(1904);
        expect(imageItem.dimY).toEqual(2700);
        expect(imageItem.isPreview).toEqual(false);

        expect(imageItem.makeIIIFUrl(10)).toEqual('http://localhost:1024/knora/incunabula_0000003856.jp2/full/pct:10/0/default.jpg');

    });

    it('should create a ReadStillImageFileValue (preview)', () => {

        const imageItem = new ReadStillImageFileValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasImage',
            'incunabula_0000003856.jpg',
            'http://localhost:1024/knora',
            'http://localhost:1024/knora/incunabula_0000003856.jpg/full/190,270/0/default.jpg',
            190,
            270);

        expect(imageItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(imageItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#StillImageFileValue');
        expect(imageItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasImage');
        expect(imageItem.getClassName()).toEqual('ReadStillImageFileValue');
        expect(imageItem.getContent()).toEqual('http://localhost:1024/knora/incunabula_0000003856.jpg/full/190,270/0/default.jpg');

        expect(imageItem.imageFilename).toEqual('incunabula_0000003856.jpg');
        expect(imageItem.imageServerIIIFBaseURL).toEqual('http://localhost:1024/knora');
        expect(imageItem.imagePath).toEqual('http://localhost:1024/knora/incunabula_0000003856.jpg/full/190,270/0/default.jpg');
        expect(imageItem.dimX).toEqual(190);
        expect(imageItem.dimY).toEqual(270);
        expect(imageItem.isPreview).toEqual(true);

        expect(imageItem.makeIIIFUrl(10)).toEqual('http://localhost:1024/knora/incunabula_0000003856.jpg/full/190,270/0/default.jpg');
    });

    it('should create a ReadTextFileValue', () => {

        const textFileItem = new ReadTextFileValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasTextFile',
            'test.txt',
            'http://localhost:1024/server/test.txt'
        );

        expect(textFileItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(textFileItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#TextFileValue');
        expect(textFileItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasTextFile');
        expect(textFileItem.getClassName()).toEqual('ReadTextFileValue');

    });

    it('should create a ReadColorValue', () => {

        const colorItem = new ReadColorValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasColor',
            '#000000'
        );

        expect(colorItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(colorItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#ColorValue');
        expect(colorItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasColor');
        expect(colorItem.colorHex).toEqual('#000000');
        expect(colorItem.getClassName()).toEqual('ReadColorValue');
        expect(colorItem.getContent()).toEqual('#000000');

    });

    it('should create a ReadGeomValue', () => {

        const expectedGeometry = new RegionGeometry(
            'active',
            '#ff3333',
            2,
            [
                new Point2D(0.08098591549295775, 0.16741071428571427),
                new Point2D(0.7394366197183099, 0.7299107142857143)
            ],
            'rectangle',
        );

        const geomItem = new ReadGeomValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasRegion',
            '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.08098591549295775,"y":0.16741071428571427},{"x":0.7394366197183099,"y":0.7299107142857143}],"type":"rectangle","original_index":0}'
        );

        expect(geomItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(geomItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#GeomValue');
        expect(geomItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasRegion');
        expect(geomItem.geometryString).toEqual('{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.08098591549295775,"y":0.16741071428571427},{"x":0.7394366197183099,"y":0.7299107142857143}],"type":"rectangle","original_index":0}');
        expect(geomItem.getClassName()).toEqual('ReadGeomValue');
        expect(geomItem.getContent()).toEqual('{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.08098591549295775,"y":0.16741071428571427},{"x":0.7394366197183099,"y":0.7299107142857143}],"type":"rectangle","original_index":0}');

        expect(geomItem.geometry).toEqual(expectedGeometry);

    });

    it('should create a ReadUriValue', () => {

        const uriItem = new ReadUriValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasUri',
            'http://www.knora.org'
        );

        expect(uriItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(uriItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#UriValue');
        expect(uriItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasUri');
        expect(uriItem.uri).toEqual('http://www.knora.org');
        expect(uriItem.getClassName()).toEqual('ReadUriValue');
        expect(uriItem.getContent()).toEqual('http://www.knora.org');

    });

    it('should create a ReadBooleanValue', () => {

        const boolItem = new ReadBooleanValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasBoolean',
            true
        );

        expect(boolItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(boolItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#BooleanValue');
        expect(boolItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasBoolean');
        expect(boolItem.bool).toEqual(true);
        expect(boolItem.getClassName()).toEqual('ReadBooleanValue');
        expect(boolItem.getContent()).toEqual('true');

    });

    it('should create a ReadIntervalValue', () => {

        const intervalItem = new ReadIntervalValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasInterval',
            1,
            2
        );

        expect(intervalItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(intervalItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#IntervalValue');
        expect(intervalItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasInterval');
        expect(intervalItem.intervalStart).toEqual(1);
        expect(intervalItem.intervalEnd).toEqual(2);
        expect(intervalItem.getClassName()).toEqual('ReadIntervalValue');
        expect(intervalItem.getContent()).toEqual('1-2');

    });

    it('should create a ReadListValue', () => {

        const listItem = new ReadListValue(
            'http://rdfh.ch/00c650d23303/values/af68552c3626',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasListNode',
            'http://rdfh.ch/00c650d23303/myNode',
            'testnode'
        );

        expect(listItem.id).toEqual('http://rdfh.ch/00c650d23303/values/af68552c3626');
        expect(listItem.type).toEqual('http://api.knora.org/ontology/knora-api/v2#ListValue');
        expect(listItem.propIri).toEqual('http://0.0.0.0:3333/ontology/0803/incunabula/v2#hasListNode');
        expect(listItem.listNodeIri).toEqual('http://rdfh.ch/00c650d23303/myNode');
        expect(listItem.listNodeLabel).toEqual('testnode');
        expect(listItem.getClassName()).toEqual('ReadListValue');
        expect(listItem.getContent()).toEqual('testnode');

    });


});

// test resources and ontology information

const testResource = new ReadResource('http://rdfh.ch/test',
    'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
    'test resource',
    [],
    [],
    [],
    [],
    {}
);

const resClasses = {
    'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book': new ResourceClass(
        'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
        'book.png',
        'A book',
        'book',
        [],
        [])
};

const ontologyInfo = new OntologyInformation({}, resClasses, {});
