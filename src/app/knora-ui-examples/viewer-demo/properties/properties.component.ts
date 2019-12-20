import { Component, OnInit } from '@angular/core';
import { ReadBooleanValue, ReadColorValue, ReadDateValue, ReadDecimalValue, ReadGeomValue, ReadIntervalValue, ReadIntValue, ReadLinkValue, ReadListValue, ReadResource, ReadStillImageFileValue, ReadTextValueAsHtml, ReadTextValueAsString, ReadTextValueAsXml, ReadUriValue } from '@knora/api';

import { AppDemo } from '../../../app.config';


@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

    module = AppDemo.viewerModule;

    referredResource = new ReadResource();

    standoff = { 'http://rdfh.ch/c9824353ae06': this.referredResource };

    color = new ReadColorValue();
    boolean = new ReadBooleanValue();
    decimal = new ReadDecimalValue();
    integer = new ReadIntValue();
    interval = new ReadIntervalValue();
    link = new ReadLinkValue();
    list = new ReadListValue();
    textString = new ReadTextValueAsString();
    textXML = new ReadTextValueAsXml();
    textHtml = new ReadTextValueAsHtml();
    uri = new ReadUriValue();
    stillImageFile = new ReadStillImageFileValue();
    // TODO: there is no definition of ReadTextFile in knora-api lib at the moment, to implement with the next release

    /* TODO: need to know how mocking a date of type ParseReadDateValue
    date = new ReadDateValue('id', 'propIri', 'JULIAN', 1700, 1700, 'CE', 'CE', 1, 1);
    period = new ReadDateValue('id', 'propIri', 'GREGORIAN', 1700, 1750, 'CE', 'CE', 1, 12, 15, 30);
    period2 = new ReadDateValue('id', 'propIri', 'GREGORIAN', 1700, 1750, 'CE', 'CE', 1, 12, 15); */

    /*  TODO: need to know how mocking a date of type ParseReadGeomValue
    geometry = new ReadGeomValue('id', 'propIri', '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.17296511627906977,"y":0.08226691042047532},{"x":0.7122093023255814,"y":0.16544789762340037}],"type":"rectangle","original_index":1}'); */

    constructor() {
    }

    ngOnInit() {
        // set up referredResource
        this.referredResource.id = 'http://rdfh.ch/c9824353ae06';
        this.referredResource.type = 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book';
        this.referredResource.label = 'Holzschnitt';

        // set up color
        this.color.color = '#f06a33';

        // set up boolean
        this.boolean.bool = true;

        // set up decimal
        this.decimal.decimal = 12345.6789;

        // set up integer
        this.integer.int = 123;

        // set up interval
        this.interval.start = 1700;
        this.interval.end = 1800;

        // set up link
        this.link.linkedResource = this.referredResource;
        this.link.linkedResourceIri = 'http://rdfh.ch/c9824353ae06';

        // set up list
        this.list.listNode = ''; // TODO: provide an example of listNode + label
        this.list.listNodeLabel = '';

        // set up textString
        this.textString.text = 'Text as string';

        // set up textXML
        this.textXML.xml = '<?xml version="1.0" encoding="UTF-8"?> <text>Ich liebe die <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">Dinge</a>, sie sind alles für mich.</text>';
        this.textXML.mapping = 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg';

        // set up textHtml
        this.textHtml.html = '<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="salsah-link">link</a></p>';

        // set up stillImageFile
        this.stillImageFile.filename = 'Still Image File Name';
        this.stillImageFile.fileUrl = 'Text File URL';

        // set up uri
        this.uri.uri = 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg';


    }

    referredResClicked(refResIri) {
        console.log('clicked on ', refResIri);
    }

}
