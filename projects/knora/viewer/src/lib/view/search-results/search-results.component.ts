import { Component, OnDestroy, OnInit, Input, OnChanges } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import {
    ApiServiceError,
    CountQueryResult,
    ExtendedSearchParams,
    KnoraConstants,
    OntologyInformation,
    ReadResource,
    ReadResourcesSequence,
    SearchParamsService,
    SearchService
} from '@knora/core';

/**
 * The search-results gets the search mode and parameters from routes or inputs,
 * and returns the corresponding resources that are displayed in a list or a grid.
 * The results can be filtered by project.
 */
@Component({
    selector: 'kui-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit, OnChanges, OnDestroy {
    /**
     *
     * @param  {boolean} [complexView] If true it shows 2 ways to display the search results: list or grid.
     */
    @Input() complexView?: boolean = false;

    /**
     *
     * @param  {string} [searchQuery] Search parameters. It can be a gravsearch query (extended mode) or string (fulltext mode).
     */
    @Input() searchQuery?: string;

    /**
     *
     * @param  {string} [searchMode] Search mode: Extended or fulltext.
     */
    @Input() searchMode?: string;

    /**
     *
     * @param  {string} [projectIri] Project Iri. To filter the results by project.
     */
    @Input() projectIri?: string;

    KnoraConstants = KnoraConstants;
    offset: number = 0;
    maxOffset: number = 0;
    gravSearchQuery: string;
    gravsearchGenerator: ExtendedSearchParams;
    result: ReadResource[] = [];
    ontologyInfo: OntologyInformation;
    numberOfAllResults: number;
    rerender: boolean = false;
    badRequest: boolean = false;
    loading = true;
    errorMessage: ApiServiceError = new ApiServiceError();
    navigationSubscription: Subscription;
    pagingLimit: number = 25;

    constructor(
        private _route: ActivatedRoute,
        private _searchService: SearchService,
        private _searchParamsService: SearchParamsService,
        private _router: Router
    ) {

    }

    ngOnInit() {
        this.navigationSubscription = this._route.paramMap.subscribe(
            (params: Params) => {
                if (!this.searchMode) {
                    this.searchMode = params.get('mode');
                }

                if (params.get('project') && (this.projectIri !== decodeURIComponent(params.get('project')))) {
                    this.projectIri = decodeURIComponent(params.get('project'));
                }

                // init offset  and result
                this.offset = 0;
                this.result = [];

                if (this.searchMode === 'fulltext') {
                    this.searchQuery = params.get('q');
                    this.badRequest = this.searchQuery.length < 3;
                } else if (this.searchMode === 'extended') {
                    this.gravsearchGenerator = this._searchParamsService.getSearchParams();

                    if (!this.searchQuery) {
                        this.generateGravsearchQuery();
                    } else {
                        this.gravSearchQuery = this.searchQuery;
                    }
                }

                this.rerender = true;
                this.getResult();
            }
        );
    }

    ngOnChanges() {
        // this.getResource(this.iri);
        this.navigationSubscription = this._route.paramMap.subscribe(
            (params: Params) => {
                if (!this.searchMode) {
                    this.searchMode = params.get('mode');
                }

                if (params.get('project') && (this.projectIri !== decodeURIComponent(params.get('project')))) {
                    this.projectIri = decodeURIComponent(params.get('project'));
                }

                // init offset  and result
                this.offset = 0;
                this.result = [];

                if (this.searchMode === 'fulltext') {
                    this.searchQuery = params.get('q');
                    this.badRequest = this.searchQuery.length < 3;
                } else if (this.searchMode === 'extended') {
                    this.gravsearchGenerator = this._searchParamsService.getSearchParams();

                    if (!this.searchQuery) {
                        this.generateGravsearchQuery();
                    } else {
                        this.gravSearchQuery = this.searchQuery;
                    }
                }

                this.rerender = true;
                this.getResult();
            }
        );
    }

    ngOnDestroy() {
        if (this.navigationSubscription !== undefined) {
            this.navigationSubscription.unsubscribe();
        }
    }

    /**
     * Generates the Gravsearch query for the current offset.
     * @ignore
     */
    private generateGravsearchQuery() {
        const gravsearch:
            | string
            | boolean = this.gravsearchGenerator.generateGravsearch(
                this.offset
            );
        if (gravsearch === false) {
            // no valid search params (application has been reloaded)
            // go to root
            this._router.navigate([''], { relativeTo: this._route });
            return;
        } else {
            this.gravSearchQuery = <string>gravsearch;
        }
    }

    /**
     * Get search result from Knora - 2 cases: simple search and extended search
     * @ignore
     */
    private getResult() {
        this.loading = true;

        // reset the error message
        this.errorMessage = undefined;

        // FULLTEXT SEARCH
        if (this.searchMode === 'fulltext') {
            this.rerender = true;
            if (this.badRequest) {
                this.errorMessage = new ApiServiceError();
                this.errorMessage.errorInfo =
                    'A search value is expected to have at least length of 3 characters.';
                this.loading = false;
                this.rerender = false;
            } else {
                if (this.projectIri) {
                    this.searchQuery += '?limitToProject=' + this.projectIri;
                }

                if (this.offset === 0) {
                    // perform count query
                    this._searchService
                        .doFullTextSearchCountQueryCountQueryResult(
                            this.searchQuery
                        )
                        .subscribe(
                            this.showNumberOfAllResults,
                            (error: ApiServiceError) => {
                                this.errorMessage = <ApiServiceError>error;
                            }
                        );
                }

                // perform full text search
                this._searchService
                    .doFullTextSearchReadResourceSequence(
                        this.searchQuery,
                        this.offset
                    )
                    .subscribe(
                        this.processSearchResults, // function pointer
                        (error: ApiServiceError) => {
                            this.errorMessage = <ApiServiceError>error;
                            console.log('error', error);
                            console.log('message', this.errorMessage);
                        }
                    );
            }

            // EXTENDED SEARCH
        } else if (this.searchMode === 'extended') {
            // perform count query
            if (this.offset === 0) {
                this._searchService
                    .doExtendedSearchCountQueryCountQueryResult(
                        this.gravSearchQuery
                    )
                    .subscribe(
                        this.showNumberOfAllResults,
                        (error: ApiServiceError) => {
                            this.errorMessage = <ApiServiceError>error;
                        }
                    );
            }
            this._searchService
                .doExtendedSearchReadResourceSequence(this.gravSearchQuery)
                .subscribe(
                    this.processSearchResults, // function pointer
                    (error: ApiServiceError) => {
                        this.errorMessage = <ApiServiceError>error;
                    }
                );
        } else {
            this.errorMessage = new ApiServiceError();
            this.errorMessage.errorInfo = `search mode invalid: ${
                this.searchMode
                }`;
        }
    }

    /**
     *
     * Converts search results from JSON-LD to a [[ReadResourcesSequence]] and requests information about ontology entities.
     * This function is passed to `subscribe` as a pointer (instead of redundantly defining the same lambda function).
     * @ignore
     *
     * @param {ReadResourcesSequence} searchResult the answer to a search request.
     */
    private processSearchResults = (searchResult: ReadResourcesSequence) => {
        // assign ontology information to a variable so it can be used in the component's template
        if (this.ontologyInfo === undefined) {
            // init ontology information
            this.ontologyInfo = searchResult.ontologyInformation;
        } else {
            // update ontology information
            this.ontologyInfo.updateOntologyInformation(
                searchResult.ontologyInformation
            );
        }
        // append results to search results
        this.result = this.result.concat(searchResult.resources);
        // console.log('search results', this.result);

        this.loading = false;
        this.rerender = false;
    };

    /**
     * Shows total number of results returned by a count query.
     * @ignore
     *
     * @param {ApiServiceResult} countQueryResult the response to a count query.
     */
    private showNumberOfAllResults = (countQueryResult: CountQueryResult) => {
        this.numberOfAllResults = countQueryResult.numberOfResults;

        if (this.numberOfAllResults > 0) {
            // offset is 0-based
            // if numberOfAllResults equals the pagingLimit, the max. offset is 0
            this.maxOffset = Math.floor(
                (this.numberOfAllResults - 1) / this.pagingLimit
            );
        } else {
            this.maxOffset = 0;
        }
    };

    /**
     * Loads the next page of results.
     * The results will be appended to the existing ones.
     * @ignore
     *
     * @param {number} offset
     * @returns void
     */
    loadMore(offset: number): void {
        // update the page offset when the end of scroll is reached to get the next page of search results
        if (this.offset < this.maxOffset) {
            this.offset++;
        } else {
            return;
        }

        if (this.searchMode === 'extended') {
            this.generateGravsearchQuery();
        }

        this.getResult();
    }
}
