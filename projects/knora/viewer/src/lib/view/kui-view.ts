import { OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
    CountQueryResult,
    ExtendedSearchParams,
    KnoraConstants,
    OntologyCacheService,
    OntologyInformation,
    ReadResource,
    ReadResourcesSequence,
    SearchParamsService,
    SearchService
} from '@knora/core';
import { Subscription } from 'rxjs';

export abstract class KuiView implements OnInit, OnDestroy {

    abstract offset: number;
    abstract maxOffset: number;
    abstract result: ReadResource[];
    abstract ontologyInfo: OntologyInformation;
    abstract navigationSubscription: Subscription;
    abstract gravsearchGenerator: ExtendedSearchParams;
    abstract searchQuery: string;
    abstract searchMode: string;
    abstract numberOfAllResults: number;
    abstract KnoraConstants: KnoraConstants;
    abstract rerender: boolean;
    abstract isLoading: boolean;
    abstract errorMessage: any;

    constructor(
        protected _route: ActivatedRoute,
        protected _searchService: SearchService,
        protected _searchParamsService: SearchParamsService,
        protected _router: Router) {
    }

    ngOnInit() {
        this.navigationSubscription = this._route.paramMap.subscribe((params: Params) => {
            this.searchMode = params.get('mode');

            // init offset  and result
            this.offset = 0;
            this.result = [];

            if (this.searchMode === 'fulltext') {
                this.searchQuery = params.get('q');
            } else if (this.searchMode === 'extended') {
                this.gravsearchGenerator = this._searchParamsService.getSearchParams();
                this.generateGravsearchQuery();
            }

            this.rerender = true;
            this.getResult();
        });
    }

    ngOnDestroy() {
        if (this.navigationSubscription !== undefined) {
            this.navigationSubscription.unsubscribe();
        }
    }

    /**
     * Generates the Gravsearch query for the current offset.
     */
    protected generateGravsearchQuery() {

        const gravsearch: string | boolean = this.gravsearchGenerator.generateGravsearch(this.offset);
        if (gravsearch === false) {
            // no valid search params (application has been reloaded)
            // go to root
            this._router.navigate([''], { relativeTo: this._route });
            return;
        } else {
            this.searchQuery = <string>gravsearch;
        }
    }

    /**
     * Get search result from Knora - 2 cases: simple search and extended search
     */
    protected getResult() {
        this.isLoading = true;

        // FULLTEXT SEARCH
        if (this.searchMode === 'fulltext') {

            if (this.offset === 0) {
                // perform count query
                this._searchService.doFullTextSearchCountQueryCountQueryResult(this.searchQuery)
                    .subscribe(
                        this.showNumberOfAllResults,
                        (error: any) => {
                            this.errorMessage = <any>error;
                            // console.log('numberOfAllResults', this.numberOfAllResults);
                        }
                    );
            }

            // perform full text search
            this._searchService.doFullTextSearchReadResourceSequence(this.searchQuery, this.offset)
                .subscribe(
                    this.processSearchResults, // function pointer
                    (error: any) => {
                        this.errorMessage = <any>error;
                    }
                );

            // EXTENDED SEARCH
        } else if (this.searchMode === 'extended') {
            // perform count query
            if (this.offset === 0) {
                this._searchService.doExtendedSearchCountQueryCountQueryResult(this.searchQuery)
                    .subscribe(
                        this.showNumberOfAllResults,
                        (error: any) => {
                            this.errorMessage = <any>error;
                        }
                    );
            }
            this._searchService.doExtendedSearchReadResourceSequence(this.searchQuery)
                .subscribe(
                    this.processSearchResults, // function pointer
                    (error: any) => {
                        this.errorMessage = <any>error;
                    });

        } else {
            this.errorMessage = `search mode invalid: ${this.searchMode}`;
        }
    }

    /**
     *
     * Converts search results from JSON-LD to a [[ReadResourcesSequence]] and requests information about ontology entities.
     * This function is passed to `subscribe` as a pointer (instead of redundantly defining the same lambda function).
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
            this.ontologyInfo.updateOntologyInformation(searchResult.ontologyInformation);
        }
        // append results to search results
        // console.log('results 1', this.result);
        this.result = this.result.concat(searchResult.resources);

        this.isLoading = false;
        this.rerender = false;

    }

    /**
     * Shows total number of results returned by a count query.
     *
     * @param {ApiServiceResult} countQueryResult the response to a count query.
     */
    private showNumberOfAllResults = (countQueryResult: CountQueryResult) => {
        this.numberOfAllResults = countQueryResult.numberOfResults;

        if (this.numberOfAllResults > 0) {
            // offset is 0-based
            // if numberOfAllResults equals the pagingLimit, the max. offset is 0
            // this.maxOffset = Math.floor((this.numberOfAllResults - 1) / environment.pagingLimit);
            console.log(this.maxOffset);
        } else {
            this.maxOffset = 0;
        }
    }

}
