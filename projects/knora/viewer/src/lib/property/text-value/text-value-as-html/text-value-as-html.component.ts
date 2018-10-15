import { Component, Input, OnInit, ElementRef, HostListener } from '@angular/core';
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

    /**
     * Binds a click event to standoff links that shows the referred resource.
     *
     * @param targetElement
     */
    @HostListener('click', ['$event.target'])
    onClick(targetElement) {
        if (this.bindEvents && targetElement.nodeName.toLowerCase() === 'a') {
            // open link in a new window
            window.open(targetElement.href, '_blank');
            return false;
        } else {
            // prevent propagation
            return false;
        }
    }

}
