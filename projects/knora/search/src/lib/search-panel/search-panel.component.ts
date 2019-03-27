import { Component, Input } from '@angular/core';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

/**
 * The search-panel contains the kui-fulltext-search and the kui-extended-search components.
 */
@Component({
    selector: 'kui-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss'],
    animations: [
        trigger('extendedSearchMenu', [
            state('inactive', style({ display: 'none' })),
            state('active', style({ display: 'block' })),
            transition('inactive => active', animate('100ms ease-in')),
            transition('active => inactive', animate('100ms ease-out'))
        ])
    ]
})
export class SearchPanelComponent {
    /**
     * Route to navigate after search. This route path should contain a component for search results.
     *
     * @param  {string} route
     */
    @Input() route: string = '/search';

    /**
     * projectfilter: if true it shows the selection of projects to filter by one of them
     *
     * @param  {boolean} [projectfilter]
     */
    @Input() projectfilter?: boolean = false;

    /**
     * If your full-text search should be filtered by one project, you can define it with project iri in the parameter filterbyproject.
     *
     * @param  {string} [filterbyproject]
     */
    @Input() filterbyproject?: string;

    showMenu: boolean = false;
    focusOnExtended: string = 'inactive';

    constructor() {}

    /**
     * Show or hide the extended search menu
     * @ignore
     *
     */
    toggleMenu(): void {
        this.showMenu = !this.showMenu;
        this.focusOnExtended =
            this.focusOnExtended === 'active' ? 'inactive' : 'active';
    }
}
