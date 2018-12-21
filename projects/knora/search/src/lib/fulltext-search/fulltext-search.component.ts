import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'kui-fulltext-search',
    templateUrl: './fulltext-search.component.html',
    styleUrls: ['./fulltext-search.component.scss'],
    animations: [
        trigger('fulltextSearchMenu',
            [
                state('inactive', style({ display: 'none' })),
                state('active', style({ display: 'block' })),
                transition('inactive => active', animate('100ms ease-in')),
                transition('active => inactive', animate('100ms ease-out'))
            ]
        )
    ]
})
export class FulltextSearchComponent implements OnInit {

    @Input() route: string = '/search';

    searchQuery: string;

    searchPanelFocus: boolean = false;

    prevSearch: string[] = JSON.parse(localStorage.getItem('prevSearch'));

    focusOnSimple: string = 'inactive';

    searchLabel: string = 'Search';

    showSimpleSearch: boolean = true;


    constructor(private _route: ActivatedRoute,
        private _router: Router) {
    }

    ngOnInit() {
    }

    /**
     * @ignore
     * Do search on Enter click, reset search on Escape
     * @param search_ele
     * @param event
     * @returns void
     */
    onKey(search_ele: HTMLElement, event): void {
        console.log('onKey');
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
            this.toggleMenu();
            this._router.navigate([this.route + '/fulltext/' + this.searchQuery]);

            // this._router.navigate(['/search/fulltext/' + this.searchQuery], { relativeTo: this._route });

            // push the search query into the local storage prevSearch array (previous search)
            // to have a list of recent search requests
            let existingPrevSearch: string[] = JSON.parse(localStorage.getItem('prevSearch'));
            if (existingPrevSearch === null) {
                existingPrevSearch = [];
            }
            let i: number = 0;
            for (const entry of existingPrevSearch) {
                // remove entry, if exists already
                if (this.searchQuery === entry) {
                    existingPrevSearch.splice(i, 1);
                }
                i++;
            }

            existingPrevSearch.push(this.searchQuery);
            localStorage.setItem('prevSearch', JSON.stringify(existingPrevSearch));
            // TODO: save the previous search queries somewhere in the user's profile
            console.log('do search IF');

        } else {
            search_ele.focus();
            this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
            console.log('do search ELSE');
        }
    }

    /**
     * Reset the search
     * @param {HTMLElement} search_ele
     * @returns void
     */
    resetSearch(search_ele: HTMLElement): void {
        this.searchQuery = null;
        search_ele.focus();
        this.focusOnSimple = 'inactive';
        this.searchPanelFocus = !this.searchPanelFocus;
        console.log('resetSearch');
    }

    /**
     * Realise a previous search
     * @param {string} query
     * @returns void
     */
    doPrevSearch(query: string): void {
        this.searchQuery = query;
        this._router.navigate([this.route + '/fulltext/' + query], { relativeTo: this._route });
        this.toggleMenu();
    }

    /**
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
     * Set simple focus to active
     *
     * @returns void
     */
    setFocus(): void {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = 'active';
        this.searchPanelFocus = !this.searchPanelFocus;
        console.log('setFocus');
    }

    /**
     * Switch according to the focus between simple or extended search
     *
     * @returns void
     */
    toggleMenu(): void {
        this.prevSearch = JSON.parse(localStorage.getItem('prevSearch'));
        this.focusOnSimple = (this.focusOnSimple === 'active' ? 'inactive' : 'active');
        // (this.focusOnSimple === 'active' ? 'inactive' : 'active');
        // console.log('focus on simple? ', this.focusOnSimple);
        this.showSimpleSearch = !this.showSimpleSearch;
        console.log('toggleMenu focusOnSimple', this.focusOnSimple);
        console.log('toggleMenu showSimpleSearch', this.showSimpleSearch);
    }
}
