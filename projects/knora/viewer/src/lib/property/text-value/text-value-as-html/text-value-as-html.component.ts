import { Component, Input, OnInit } from '@angular/core';
import { OntologyInformation, ReadTextValueAsHtml } from '@knora/core';

@Component({
    selector: 'kui-text-value-as-html',
    templateUrl: './text-value-as-html.component.html',
    styleUrls: ['./text-value-as-html.component.scss']
})
export class TextValueAsHtmlComponent implements OnInit {

    @Input() valueObject: ReadTextValueAsHtml;
    @Input() ontologyInfo: OntologyInformation;
    @Input('bindEvents') bindEvents: Boolean; // indicates if click and mouseover events have to be bound

    constructor() {
    }

    ngOnInit() {

        // console.log(this.valueObject);

    }

}
