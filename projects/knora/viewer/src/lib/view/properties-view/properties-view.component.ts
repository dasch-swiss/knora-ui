import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReadResource } from '@knora/api';

import { TempProperty } from '..';

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

    /**
     * Array of property object with ontology class prop def, list of properties and corresponding values
     *
     * @param  {TempProperty} propArray
     */
    @Input() propArray: TempProperty;

    /**
     * Show all properties, even they don't have a value.
     *
     * @param  {boolean=false} [allProps]
     */
    @Input() allProps?: boolean = false;

    /**
     * Show toolbar with project info and some action tools
     *
     * @param  {boolean=false} [toolbar]
     */
    @Input() toolbar?: boolean = false;

    loading: boolean = false;

    constructor(
        protected _router: Router) {
    }

    ngOnInit() {

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
