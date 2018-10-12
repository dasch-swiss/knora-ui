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

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

    color = new ReadColorValue('id', 'prop', '#f06a33');
    boolean = new ReadBooleanValue('id', 'propIri', true);
    date = new ReadDateValue('id', 'propIri', 'gregorian', 1700, 1750, 'CE', 'CE', 1, 12);
    decimal = new ReadDecimalValue('id', 'propIri', 12345.6789);
    // TODO: find an example of a geometry string
    // geometry = new ReadGeomValue('id', 'propIri', 'A = pi x r2');
    integer = new ReadIntegerValue('id', 'propIri', 123);
    interval = new ReadIntervalValue('id', 'propIri', 1700, 1800);
    link = new ReadLinkValue('id', 'propIri', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
    list = new ReadListValue('id', 'propIri', 'listNodeIri', 'Node Label');
    textString = new ReadTextValueAsString('id', 'propIri', 'Text as string');
    textXML = new ReadTextValueAsXml('id', 'propIri', '<?xml version="1.0" encoding="UTF-8"?> <text>Ich liebe die <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">Dinge</a>, sie sind alles für mich.</text>', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
    // TODO: mock referredResources
    // html = new ReadTextValueAsHtml('id', 'propIri', '<p>This is a very simple HTML document</p>', 'referredResources');
    textFile = new ReadTextFileValue('id', 'propIri', 'Text File Name', 'Text File URL');
    uri = new ReadUriValue('id', 'propIri', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');

    partOf: any;

    constructor(private _route: ActivatedRoute) {
        this._route.data
            .subscribe(
                (mod: any) => {
                    this.partOf = mod.partOf;
                }
            );
    }

    ngOnInit() {
    }

}
