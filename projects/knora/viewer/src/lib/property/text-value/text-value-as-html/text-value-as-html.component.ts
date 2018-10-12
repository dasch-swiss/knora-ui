import { Component, Input, OnInit, ElementRef } from '@angular/core';
import { OntologyInformation, ReadTextValueAsHtml } from '@knora/core';

@Component({
    selector: 'kui-text-value-as-html',
    templateUrl: './text-value-as-html.component.html',
    styleUrls: ['./text-value-as-html.component.scss']
})
export class TextValueAsHtmlComponent implements OnInit {

    @Input() valueObject: ReadTextValueAsHtml;
    @Input() ontologyInfo: OntologyInformation;
    @Input() bindEvents: Boolean; // indicates if click and mouseover events have to be bound

    html: string;

    constructor(private el: ElementRef) {
    }

    ngOnInit() {
        this.el.nativeElement.innerHTML = this.valueObject.html;
    }

}
