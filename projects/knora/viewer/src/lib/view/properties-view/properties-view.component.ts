import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { GuiOrder, KnoraConstants, OntologyInformation, ReadProperties, ReadResource } from '@knora/core';

/**
 * Shows all metadata (properties) in the resource viewer
 *
 */
@Component({
    selector: 'kui-properties-view',
    templateUrl: './properties-view.component.html',
    styleUrls: ['./properties-view.component.scss']
})
export class PropertiesViewComponent {

    loading: boolean = false;

    KnoraConstants = KnoraConstants;

    @Input() guiOrder: GuiOrder;
    @Input() properties: ReadProperties;
    @Input() annotations: ReadResource[];
    @Input() incomingLinks: ReadResource[];

    @Input() ontologyInfo: OntologyInformation;

    // @Output() routeChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor (protected _router: Router) { }

    /**
     * Navigate to the incoming resource view.
     *
     * @param {string} id Incoming resource iri
     */
    openLink(id: string) {

        this.loading = true;
        // this.routeChanged.emit(id);
        this._router.navigate(['/resource/' + encodeURIComponent(id)]);

    }

}
