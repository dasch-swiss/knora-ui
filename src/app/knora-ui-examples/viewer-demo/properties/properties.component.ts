import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
    ReadBooleanValue,
    ReadColorValue,
    ReadDateValue,
    ReadDecimalValue,
    ReadIntegerValue,
    ReadIntervalValue,
    ReadLinkValue,
    ReadListValue,
    ReadResource,
    ReadTextFileValue,
    ReadTextValueAsHtml,
    ReadTextValueAsString,
    ReadTextValueAsXml,
    ReadUriValue
} from '@knora/core';
import { ReadGeomValue } from 'projects/knora/core/src/public_api';
import { AppDemo } from '../../../app.config';

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

    module = AppDemo.viewerModule;

    referredResource = new ReadResource('http://rdfh.ch/c9824353ae06', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book', 'Holzschnitt', [], [], [], [], {});
    standoff = { 'http://rdfh.ch/c9824353ae06': this.referredResource };

    // set up mocked values for properties
    color = new ReadColorValue('id', 'prop', '#f06a33');
    boolean = new ReadBooleanValue('id', 'propIri', true);

    date = new ReadDateValue('id', 'propIri', 'JULIAN', 1700, 1700, 'CE', 'CE', 1, 1);
    period = new ReadDateValue('id', 'propIri', 'GREGORIAN', 1700, 1750, 'CE', 'CE', 1, 12, 15, 30);
    period2 = new ReadDateValue('id', 'propIri', 'GREGORIAN', 1700, 1750, 'CE', 'CE', 1, 12, 15);

    decimal = new ReadDecimalValue('id', 'propIri', 12345.6789);
    geometry = new ReadGeomValue('id', 'propIri', '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.17296511627906977,"y":0.08226691042047532},{"x":0.7122093023255814,"y":0.16544789762340037}],"type":"rectangle","original_index":1}');
    integer = new ReadIntegerValue('id', 'propIri', 123);
    interval = new ReadIntervalValue('id', 'propIri', 1700, 1800);
    link = new ReadLinkValue('id', 'propIri', 'http://rdfh.ch/c9824353ae06', this.referredResource);

    list = new ReadListValue('id', 'propIri', 'listNodeIri');
    textString = new ReadTextValueAsString('id', 'propIri', 'Text as string');
    textXML = new ReadTextValueAsXml('id', 'propIri', '<?xml version="1.0" encoding="UTF-8"?> <text>Ich liebe die <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">Dinge</a>, sie sind alles für mich.</text>', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
    html = new ReadTextValueAsHtml('id', 'propIri', '<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="salsah-link">link</a></p>', this.standoff);
    textFile = new ReadTextFileValue('id', 'propIri', 'Text File Name', 'Text File URL');
    uri = new ReadUriValue('id', 'propIri', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');

    constructor() {
    }

    ngOnInit() {
    }

    referredResClicked(refResIri) {
        console.log('clicked on ', refResIri);
    }

}
