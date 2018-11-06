import { Component, ElementRef, HostListener, Input } from '@angular/core';
import { OntologyInformation, ReadTextValueAsHtml } from '@knora/core';

@Component({
    selector: 'kui-text-value-as-html',
    templateUrl: './text-value-as-html.component.html',
    styleUrls: ['./text-value-as-html.component.scss']
})
export class TextValueAsHtmlComponent {

    @Input()
    set ontologyInfo(value: OntologyInformation) {
        this._ontoInfo = value;
    }

    get ontologyInfo() {
        return this._ontoInfo;
    }

    @Input()
    set bindEvents(value: Boolean) {
        this._bindEvents = value;
    }

    get bindEvents() {
        return this._bindEvents;
    }

    @Input()
    set valueObject(value: ReadTextValueAsHtml) {
        this._htmlValueObj = value;

        if (this.el.nativeElement.innerHTML) {
            this.el.nativeElement.innerHTML = this.valueObject.html;
        }
    }

    get valueObject() {
        return this._htmlValueObj;
    }

    html: string;
    private _htmlValueObj: ReadTextValueAsHtml;
    private _ontoInfo: OntologyInformation;
    private _bindEvents: Boolean;

    constructor(private el: ElementRef) {
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
