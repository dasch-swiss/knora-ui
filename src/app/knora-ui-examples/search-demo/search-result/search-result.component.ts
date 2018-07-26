import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnInit,
    Output
} from '@angular/core';
import { AppDemo } from '../../../app.config';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
    ApiServiceError,
    ApiServiceResult,
    ConvertJSONLD,
    ExtendedSearchParams,
    GravSearchService,
    KnoraConstants,
    OntologyCacheService,
    OntologyInformation,
    ReadResource,
    ReadResourcesSequence,
    SearchParamsService,
    SearchService
} from '@knora/core';

export interface ListData {
    title: string;
    description: string;
    content: string;
    showAs: string;
    restrictedBy: string;
    searchMode?: string;
}

declare let require: any;
const jsonld = require('jsonld');

@Component({
    selector: 'app-search-result',
    templateUrl: './search-result.component.html',
    styleUrls: ['./search-result.component.scss']
})
export class SearchResultComponent implements AfterViewInit, OnChanges, OnInit {

    partOf = AppDemo.searchModule;

    result: ReadResource[] = []; // the results of a search query
    ontologyInfo: OntologyInformation; // ontology information about resource classes and properties present in `result`
    numberOfAllResults: number; // total number of results (count query)
    rerender: boolean = false;

    // with the http get request, we need also a variable for error messages;
    // just in the case if something's going wrong
    errorMessage: any = undefined;

    offset: number = 0;

    list: ListData = <ListData>{
        title: 'Results: ',
        content: 'resource',
        restrictedBy: ''
    };

    constructor(
        private _route: ActivatedRoute,
        private _router: Router,
        private _searchService: SearchService,
        private _cacheService: OntologyCacheService,
        private _searchParamsService: SearchParamsService,
        private _gravSearchService: GravSearchService,
        private _cdRef: ChangeDetectorRef) {
    }

    ngOnChanges() {
        console.log('ngOnChanges: ', this.ngOnChanges);
    }

    ngOnInit() {
        this._route.params.subscribe((params: Params) => {
            this.list.searchMode = params['mode'];
            this.list.restrictedBy = params['q'];
            this.offset = 0;
        });

        this.getResult();

        // this.reloadList();

        // console.log('ngOnInit: ', this.ngOnInit);
    }

    ngAfterViewInit() {
        this._cdRef.detectChanges();
    }

    /**
     * Reload component when activated route changes
     */
    reloadList() {
        if (this.list.content === 'resource') {

            this._route.params.subscribe((params: Params) => {
                this.rerender = true;
                this._cdRef.detectChanges();
                this.rerender = false;
                console.log('reloadList method: ', this.list.content);
            });

        }
    }

    /*  updateSession() {
         this.rerender = true;
         console.log('update session ', this.list);
         if (this.list) {
             this.getData(this.list.restrictedBy);
             this.rerender = false;
         } */


    /**
     * Get search result from Knora
     */
    getResult() {
        // fulltext search
        console.log('getResult method: ');

        if (this.list.searchMode === 'fulltext') {
            // perform count query
            if (this.offset === 0) {

                this._searchService.doFulltextSearchCountQuery(this.list.restrictedBy)
                    .subscribe(
                        this.showNumberOfAllResults,
                        (error: ApiServiceError) => {
                            this.errorMessage = <any>error;
                            // console.log('numberOfAllResults', this.numberOfAllResults);
                        }
                    );
            }

            // perform full text search
            this._searchService.doFulltextSearch(this.list.restrictedBy, this.offset)
                .subscribe(
                    this.processSearchResults, // function pointer
                    (error: ApiServiceError) => {
                        this.errorMessage = <any>error;
                    }
                );
        } else if (this.list.searchMode === 'extended') {
            // perform extended search count query
            if (this.offset === 0) {
                this._searchService.doExtendedSearchCountQuery(this.list.restrictedBy)
                    .subscribe(
                        this.showNumberOfAllResults,
                        (error: ApiServiceError) => {
                            this.errorMessage = <any>error;
                        }
                    );
            }

            this._searchParamsService.currentSearchParams
                .subscribe((extendedSearchParams: ExtendedSearchParams) => {
                    if (this.offset === 0) {
                        this._searchService.doExtendedSearch(this.list.restrictedBy)
                            .subscribe(
                                this.processSearchResults,
                                (error: ApiServiceError) => {
                                    this.errorMessage = <any>error;
                                });
                    } else {
                        // generate new GravSearch with increased offset
                        const gravSearch = extendedSearchParams.generateGravsearch(this.offset);
                        this._searchService.doExtendedSearch(gravSearch)
                            .subscribe(
                                this.processSearchResults,
                                (error: ApiServiceError) => {
                                    this.errorMessage = <any>error;
                                }
                            );
                    }
                });

        } else {
            this.errorMessage = `search mode invalid: ${this.list.searchMode}`;
        }
    }


    /**
     * Shows total number of results returned by a count query.
     *
     * @param {ApiServiceResult} countQueryResult the response to a count query.
     */
    private showNumberOfAllResults = (countQueryResult: ApiServiceResult) => {

        const resPromises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const resPromise = resPromises.compact(countQueryResult.body, {});

        resPromise.then((compacted) => {
            this.numberOfAllResults = compacted[KnoraConstants.schemaNumberOfItems];
        }, function (err) {
            console.log('JSONLD could not be expanded:' + err);
        });
    }

    /**
     *
     * Converts search results from JSON-LD to a [[ReadResourcesSequence]] and requests information about ontology entities.
     * This function is passed to `subscribe` as a pointer (instead of redundantly defining the same lambda function).
     *
     * Attention: this function definition makes uses of the arrow notation because the context of `this` has to be inherited from the context.
     * See: <https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions#No_binding_of_this>
     *
     * @param {ApiServiceResult} searchResult the answer to a search request.
     */
    private processSearchResults = (searchResult: ApiServiceResult) => {

        const resPromises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const resPromise = resPromises.compact(searchResult.body, {});

        resPromise.then((compacted) => {

            // get resource class Iris from response
            const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

            // request ontology information about resource class Iris (properties are implied)
            this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
                (resourceClassInfos: OntologyInformation) => {

                    const resources: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                    // assign ontology information to a variable so it can be used in the component's template
                    if (this.ontologyInfo === undefined) {
                        // init ontology information
                        this.ontologyInfo = resourceClassInfos;
                    } else {
                        // update ontology information
                        this.ontologyInfo.updateOntologyInformation(resourceClassInfos);
                    }
                    // append results to search results
                    this.result = this.result.concat(resources.resources);

                },
                (err) => {

                    console.log('cache request failed: ' + err);
                }
            );

        }, function (err) {

            console.log('JSONLD could not be expanded:' + err);
        });

    }

}
