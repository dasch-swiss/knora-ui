import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { IResourceClassAndPropertyDefinitions, ReadResource } from '@knora/api';

@Component({
    selector: 'kui-list-view',
    templateUrl: './list-view.component.html',
    styleUrls: ['./list-view.component.scss']
})
export class ListViewComponent {

    /**
     * @param  {any} result Search result received from SearchResultsComponent
     */
    @Input() result: ReadResource[];

    /**
     * @param  {IResourceClassAndPropertyDefinitions} ontologyInfo Ontology information received from SearchResultsComponent
     */
    @Input() ontologyInfo: IResourceClassAndPropertyDefinitions;


    constructor(
        private _router: Router
    ) {

    }

    /**
     * Navigate to the resource viewer when clicking on one resource of the search result list
     * @param {string} id
     */
    openResource(id: string) {
        const url: string = '/resource/' + encodeURIComponent(id);
        this._router.navigate([url]);
    }

}
