import { Component, ElementRef, Input } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    animate,
    state,
    style,
    transition,
    trigger
} from '@angular/animations';

@Component({
    selector: 'kui-search',
    templateUrl: './search.component.depr.html',
    styleUrls: ['./search.component.depr.scss'],
    animations: [
        trigger('simpleSearchMenu',
            [
                state('inactive', style({ display: 'none' })),
                state('active', style({ display: 'block' })),
                transition('inactive => true', animate('100ms ease-in')),
                transition('true => inactive', animate('100ms ease-out'))
            ]
        ),
        trigger('extendedSearchMenu',
            [
                state('inactive', style({ display: 'none' })),
                state('active', style({ display: 'block' })),
                transition('inactive => true', animate('100ms ease-in')),
                transition('true => inactive', animate('100ms ease-out'))
            ]
        ),
    ]
})

/**
 * @deprecated You should use searchPanel instead
 * Contains methods to realise, reset new or previous simple searches.
 */
export class SearchComponent {

    @Input() route: string = '/search';

    searchQuery: string;

    searchPanelFocus: boolean = false;

    prevSearch: string[] = JSON.parse(localStorage.getItem('prevSearch'));

    focusOnSimple: string = 'inactive';
    focusOnExtended: string = 'inactive';

    searchLabel: string = 'Search';

    showSimpleSearch: boolean = true;

    constructor(private _route: ActivatedRoute,
        private _router: Router,
        private _eleRef: ElementRef) {

    }

    /**
     * Do search on Enter click, reset search on Escape
     * @ignore
     *
     * @param search_ele
     * @param event
     * @returns void
     */
    onKey(search_ele: HTMLElement, event): void {
        this.focusOnSimple = 'active';
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        if (this.searchQuery && (event.key === 'Enter' || event.keyCode === 13 || event.which === 13)) {
            this.doSearch(search_ele);
        }
        if (event.key === 'Escape' || event.keyCode === 27 || event.which === 27) {
            this.resetSearch(search_ele);
        }
    }

    /**
     * Realise a simple search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    doSearch(search_ele: HTMLElement): void {
        if (this.searchQuery !== undefined && this.searchQuery !== null) {
            this.toggleMenu('simpleSearch');
            this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);

            // this._router.navigate(['/search/fulltext/' + this.searchQuery], { relativeTo: this._route });

            // push the search query into the local storage prevSearch array (previous search)
            // to have a list of recent search requests
            let existingPrevSearch: string[] = JSON.parse(localStorage.getItem('prevSearch'));
            if (existingPrevSearch === null) { existingPrevSearch = []; }
            let i: number = 0;
            for (const entry of existingPrevSearch) {
                // remove entry, if exists already
                if (this.searchQuery === entry) { existingPrevSearch.splice(i, 1); }
                i++;
            }

            existingPrevSearch.push(this.searchQuery);
            localStorage.setItem('prevSearch', JSON.stringify(existingPrevSearch));
            // TODO: save the previous search queries somewhere in the user's profile

        } else {
            search_ele.focus();
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        }
    }

    /**
     * @ignore
     *
     * Reset the search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    resetSearch(search_ele: HTMLElement): void {
        this.searchQuery = null;
        search_ele.focus();
        this.focusOnSimple = 'inactive';
        this.searchPanelFocus = !this.searchPanelFocus;
    }

    /**
     * @ignore
     *
     * Realise a previous search
     * @param {string} query
     * @returns void
     */
    doPrevSearch(query: string): void {
        this.searchQuery = query;
        this._router.navigate([this.route + '/fulltext/' + query], { relativeTo: this._route });
        this.toggleMenu('simpleSearch');
    }

    /**
     * @ignore
     *
     * Reset previous searches - the whole previous search or specific item by name
     * @param {string} name term of the search
     * @returns void
     */
    resetPrevSearch(name: string = null): void {
        if (name) {
            // delete only this item with the name ...
            const i: number = this.prevSearch.indexOf(name);
            this.prevSearch.splice(i, 1);
            localStorage.setItem('prevSearch', JSON.stringify(this.prevSearch));
        } else {
            // delete the whole "previous search" array
            localStorage.removeItem('prevSearch');
        }
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));

    }

    /**
     * @ignore
     * Set simple focus to active
     *
     * @returns void
     */
    setFocus(): void {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = 'active';
        this.searchPanelFocus = !this.searchPanelFocus;
    }

    /**
     * @ignore
     *
     * Switch according to the focus between simple or extended search
     *
     * @param {string} name 2 cases: simpleSearch or extendedSearch
     * @returns void
     */
    toggleMenu(name: string): void {
        switch (name) {
            case 'simpleSearch':
                this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
                this.focusOnSimple = (this.focusOnSimple === 'active' ? 'inactive' : 'active');
                this.showSimpleSearch = true;
                break;
            case 'extendedSearch':
                this.focusOnExtended = (this.focusOnExtended === 'active' ? 'inactive' : 'active');
                this.showSimpleSearch = false;
                break;
        }
    }
}
