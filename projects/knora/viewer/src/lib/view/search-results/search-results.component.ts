import { Component, Inject, Input, OnChanges, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ApiResponseError, CountQueryResponse, ResourceClassAndPropertyDefinitions, KnoraApiConnection, ReadResource, ReadResourceSequence } from '@knora/api';
import { ExtendedSearchParams, KnoraApiConnectionToken, SearchParamsService } from '@knora/core';

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
export class SearchResultsComponent implements OnInit, OnChanges {
    /**
     * @param  {boolean} [complexView] If true it shows 3 ways to display the search results: list or grid or table
     *
     */
    @Input() complexView?: boolean = false;

    /**
     * @param  [viewAs] Show result as list, grid or tabel. Default value is list
     */
    @Input() viewAs?: 'list' | 'grid' | 'table' = 'list';

    /**
     * @param  {string} [searchQuery] Search parameters. It can be a gravsearch query (extended mode) or string (fulltext mode).
     */
    @Input() searchQuery?: string;

    /**
     * @param  {string} [searchMode] Search mode: Extended or fulltext.
     */
    @Input() searchMode?: string;

    /**
     * @param  {string} [projectIri] Project Iri. To filter the results by project.
     */
    @Input() projectIri?: string;


    // MatPaginator Output
    pageEvent: PageEvent;

    // offset: number = 0;

    initSearch: boolean;

    //    maxOffset: number = 0;
    gravSearchQuery: string;
    gravsearchGenerator: ExtendedSearchParams;
    result: ReadResource[] = [];
    ontologyInfo: ResourceClassAndPropertyDefinitions;
    numberOfAllResults: number;
    // rerender: boolean = false;
    badRequest: boolean = false;
    loading = true;
    errorMessage: ApiResponseError;
    pagingLimit: number = 25;

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
        private _route: ActivatedRoute,
        // private _searchService: SearchService,
        private _searchParamsService: SearchParamsService,
        private _router: Router
    ) {

    }

    ngOnInit() {

        // page offset is 0


    }

    ngOnChanges() {
        this._route.paramMap.subscribe(
            (params: Params) => {
                // get the search mode
                if (!this.searchMode) {
                    this.searchMode = params.get('mode');
                }

                // get the project iri
                if (params.get('project') && (this.projectIri !== decodeURIComponent(params.get('project')))) {
                    this.projectIri = decodeURIComponent(params.get('project'));
                }

                // new search query or old one?
                this.initSearch = (this.searchQuery !== params.get('q') || this.searchQuery !== this.gravSearchQuery);

                // init pageIndex and results
                if (!this.pageEvent || this.initSearch) {
                    this.resetPage();
                }

                // get query params depending on the search mode
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

                // get results
                // this.rerender = true;
                this.getResult();
            }
        );
    }

    resetPage() {
        this.pageEvent = new PageEvent();
        this.pageEvent.pageIndex = 0;
        this.result = [];
    }


    /**
     * Generates the Gravsearch query for the current offset.
     * @ignore
     */
    private generateGravsearchQuery() {
        const gravsearch: string | boolean = this.gravsearchGenerator.generateGravsearch(
            this.pageEvent.pageIndex
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
            // this.rerender = true;
            if (this.badRequest) {
                this.errorMessage = undefined;
                // TODO: fix that!
                /*
                this.errorMessage.error.toString errorInfo =
                    'A search value is expected to have at least length of 3 characters.';
                    */
                this.loading = false;
                // this.rerender = false;
            } else {

                let searchParams;

                if (this.projectIri !== undefined) {
                    searchParams = { limitToProject: this.projectIri };
                }

                if (this.pageEvent.pageIndex === 0) {
                    // perform count query
                    this.knoraApiConnection.v2.search.doFulltextSearchCountQuery(this.searchQuery, this.pageEvent.pageIndex, searchParams).subscribe(
                        (response: CountQueryResponse) => {
                            this.numberOfAllResults = response.numberOfResults;
                        },
                        (error: ApiResponseError) => {
                            this.errorMessage = error;
                        }
                    );
                }

                // perform full text search
                this.knoraApiConnection.v2.search.doFulltextSearch(this.searchQuery, this.pageEvent.pageIndex, searchParams).subscribe(
                    (response: ReadResourceSequence) => {
                        // this.processSearchResults(response);
                        // console.log('', response);
                        this.result = response.resources;
                        this.loading = false;
                    },
                    (error: ApiResponseError) => {
                        this.errorMessage = error;
                        console.error(error);
                        this.loading = false;
                    }
                );
            }

            // EXTENDED SEARCH
        } else if (this.searchMode === 'extended') {
            // perform count query
            if (this.pageEvent.pageIndex === 0) {
                this.knoraApiConnection.v2.search.doExtendedSearchCountQuery(this.gravSearchQuery).subscribe(
                    (response: CountQueryResponse) => {
                        this.numberOfAllResults = response.numberOfResults;
                    },
                    (error: ApiResponseError) => {
                        this.errorMessage = error;
                    }
                );
            }
            this.knoraApiConnection.v2.search.doExtendedSearch(this.gravSearchQuery).subscribe(
                (response: ReadResourceSequence) => {
                    // this.processSearchResults(response);
                    this.result = response.resources;
                    this.loading = false;
                },
                (error: ApiResponseError) => {
                    this.errorMessage = error;
                    this.loading = false;
                }
            );
        } else {
            // TODO: fix this
            /*
            this.errorMessage = new ApiResponseError();
            this.errorMessage.errorInfo = `search mode invalid: ${
                this.searchMode
                }`;
                */
        }
    }

    /**
     * Converts search results from JSON-LD to a [[ReadResourcesSequence]] and requests information about ontology entities.
     * This function is passed to `subscribe` as a pointer (instead of redundantly defining the same lambda function).
     * @ignore
     *
     * @param {ReadResourcesSequence} searchResult the answer to a search request.
     */
    private processSearchResults(searchResult: ReadResource[]) {
        // console.log(searchResult);
        // assign ontology information to a variable so it can be used in the component's template
        if (this.ontologyInfo === undefined) {
            // init ontology information
            // TODO: how do we get ontologyInfo from knora-api-js-lib ReadResource[]
            this.ontologyInfo = searchResult[0].entityInfo;
        } else {
            // update ontology information
            // TODO: fix this
            // this.ontologyInfo. .updateOntologyInformation(searchResult[0].entityInfo);
        }
        // append results to search results
        this.result = this.result.concat(searchResult);
        // console.log('search results', this.result);

        this.loading = false;
        // this.rerender = false;
    }

    /**
     * Loads the next page of results.
     * The results will be appended to the existing ones.
     * @ignore
     *
     * @param {number} offset
     * @returns void
     */
    loadMore(page: PageEvent): void {

        this.pageEvent = page;

        if (this.searchMode === 'extended') {
            this.generateGravsearchQuery();
        }

        this.getResult();
    }
}
