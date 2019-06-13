import { Component, Input } from '@angular/core';
import { GuiOrder, KnoraConstants, OntologyInformation, Properties, ReadResource, ReadProperties } from '@knora/core';
import { Router } from '@angular/router';

/**
 * Deprecated!?
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

    constructor (protected _router: Router) { }

    /**
     * Navigate to the incoming resource view.
     *
     * @param {string} id Incoming resource iri
     */
    openLink(id: string) {

        this.loading = true;
        this._router.navigate(['/resource/' + encodeURIComponent(id)]);

    }

}
