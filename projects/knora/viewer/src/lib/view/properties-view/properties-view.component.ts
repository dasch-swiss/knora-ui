import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReadValue } from '@knora/api';
import { IResourceClassAndPropertyDefinitions } from '@knora/api/src/cache/OntologyCache';
import { GuiOrder, KnoraConstants, ReadResource } from '@knora/core';

/**
 * Shows all metadata (properties) in the resource viewer
 *
 */
@Component({
    selector: 'kui-properties-view',
    templateUrl: './properties-view.component.html',
    styleUrls: ['./properties-view.component.scss']
})
export class PropertiesViewComponent implements OnInit {

    loading: boolean = false;

    KnoraConstants = KnoraConstants;

    @Input() guiOrder?: GuiOrder;

    @Input() entityInfo: IResourceClassAndPropertyDefinitions;
    @Input() properties: {
        [index: string]: ReadValue[];
    };

    @Input() annotations?: ReadResource[];
    @Input() incomingLinks?: ReadResource[];

    propArray: any = [];

    // @Output() routeChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor(protected _router: Router) {

    }

    ngOnInit() {
        // HACK (until gui order is ready): convert properties object into array
        if (this.properties) {
            this.propArray = Object.keys(this.properties).map(function (index) {
                const prop = this.properties[index];
                return prop;
            });
            console.log(this.propArray);
        }
    }
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
