import { Component, Input, OnInit } from '@angular/core';
import { KnoraConstants, OntologyInformation } from '@knora/core';
import { Router } from '@angular/router';

@Component({
    selector: 'kui-grid-view',
    templateUrl: './grid-view.component.html',
    styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit {

    /**
     * @param  {any} result Search result received from SearchResultsComponent
     */
    @Input() result: any;

    /**
     * @param  {OntologyInformation} ontologyInfo Ontology information received from SearchResultsComponent
     */
    @Input() ontologyInfo: OntologyInformation;

    // @Input() isLoading: boolean;

    KnoraConstants = KnoraConstants;

    constructor(
        private _router: Router
    ) { }

    ngOnInit() {
    }

    /**
     * Navigate to the resource viewer when clicking on one resource of the search result grid
     * @param {string} id
     */
    openResource(id: string) {
        const url: string = '/resource/' + encodeURIComponent(id);
        this._router.navigate([url]);
    }
}
