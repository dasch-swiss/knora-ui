import { HttpClient, HttpParams } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { KuiCoreConfigToken } from '../../core.module';
import { ApiServiceResult, CountQueryResult, ReadResourcesSequence } from '../../declarations';
import { ApiService } from '../api.service';
import { ConvertJSONLD } from './convert-jsonld';
import { OntologyCacheService, OntologyInformation } from './ontology-cache.service';

export interface FulltextSearchParams {

    limitToResourceClass?: string;

    limitToProject?: string;

    limitToStandoffClass?: string;
}

export interface SearchByLabelParams {

    limitToResourceClass?: string;

    limitToProject?: string;

    offset?: number;
}

/**
 * Performs searches (fulltext or extended) and search count queries into Knora.
 */
@Injectable({
    providedIn: 'root',
})
export class SearchService extends ApiService {

    constructor(public http: HttpClient,
        @Inject(KuiCoreConfigToken) public config,
        private _ontologyCacheService: OntologyCacheService) {
        super(http, config);
    }

    /**
     * Assign fulltext params to http params if not undefined
     * @param {FulltextSearchParams} params 
     * @param {HttpParams} httpParams 
     * @returns {HttpParams}
     */
    private processFulltextSearchParams(params: FulltextSearchParams, httpParams: HttpParams): HttpParams {

        if (params.limitToProject !== undefined) {
            httpParams = httpParams.set('limitToProject', params.limitToProject);
        }

        if (params.limitToResourceClass !== undefined) {
            httpParams = httpParams.set('limitToResourceClass', params.limitToResourceClass);
        }

        if (params.limitToStandoffClass !== undefined) {
            httpParams = httpParams.set('limitToStandoffClass', params.limitToStandoffClass);
        }

        return httpParams;

    }

    /**
     * Converts a JSON-LD object to a `ReadResorceSequence`.
     * To be passed as a function pointer (arrow notation required).
     *
     * @param {Object} resourceResponse
     * @returns {Observable<ReadResourcesSequence>}
     */
    private convertJSONLDToReadResourceSequence: (resourceResponse: Object) => Observable<ReadResourcesSequence> = (resourceResponse: Object) => {
        // convert JSON-LD into a ReadResourceSequence
        const resSeq: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(resourceResponse);

        // collect resource class Iris
        const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(resourceResponse);

        // request information about resource classes
        return this._ontologyCacheService.getResourceClassDefinitions(resourceClassIris).pipe(
            map(
                (ontoInfo: OntologyInformation) => {
                    // add ontology information to ReadResourceSequence
                    resSeq.ontologyInformation.updateOntologyInformation(ontoInfo);
                    return resSeq;
                }
            )
        );
    }

    /**
     * Performs a fulltext search.
     * TODO: mark as deprecated, use of `doFullTextSearchReadResourceSequence` recommended
     *
     * @param {string} searchTerm the term to search for.
     * @param {number} offset the offset to be used (for paging, first offset is 0).
     * @param {string} projectIri restrict search to given project, if any.
     * @returns Observable<ApiServiceResult>
     */
    doFulltextSearch(searchTerm: string, offset: number = 0, params?: FulltextSearchParams): Observable<ApiServiceResult> {

        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearch'));
        }

        let httpParams = new HttpParams();

        httpParams = httpParams.set('offset', offset.toString());

        if (params !== undefined) {
            httpParams = this.processFulltextSearchParams(params, httpParams);
        }

        return this.httpGet('/v2/search/' + encodeURIComponent(searchTerm), httpParams);
    }

    /**
     * Performs a fulltext search and turns the result into a `ReadResourceSequence`.
     *
     * @param {string} searchTerm the term to search for.
     * @param {number} offset the offset to be used (for paging, first offset is 0).
     * @param {string} projectIri restrict search to given project, if any.
     * @returns Observable<ApiServiceResult>
     */
    doFullTextSearchReadResourceSequence(searchTerm: string, offset: number = 0, params?: FulltextSearchParams): Observable<ReadResourcesSequence> {
        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearch'));
        }

        let httpParams = new HttpParams();

        httpParams = httpParams.set('offset', offset.toString());

        if (params !== undefined) {
            httpParams = this.processFulltextSearchParams(params, httpParams);
        }

        const res: Observable<any> = this.httpGet('/v2/search/' + encodeURIComponent(searchTerm), httpParams);

        return res.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            ),
            mergeMap(
                // return Observable of ReadResourcesSequence
                this.convertJSONLDToReadResourceSequence
            )
        );
    }

    /**
     * Performs a fulltext search count query.
     * TODO: mark as deprecated, use of `doFullTextSearchCountQueryCountQueryResult` recommended
     *
     * @param searchTerm the term to search for.
     * @param {string} projectIri restrict search to given project, if any.
     * @returns Observable<ApiServiceResult>
     */
    doFulltextSearchCountQuery(searchTerm: string, params?: FulltextSearchParams): Observable<ApiServiceResult> {

        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearchCountQuery'));
        }

        let httpParams = new HttpParams();

        if (params !== undefined) {
            httpParams = this.processFulltextSearchParams(params, httpParams);
        }

        return this.httpGet('/v2/search/count/' + encodeURIComponent(searchTerm), httpParams);
    }

    /**
     * Performs a fulltext search count query and turns the result into a `CountQueryResult`.
     *
     * @param {string} searchTerm the term to search for.
     * @param {string} projectIri restrict search to given project, if any.
     * @returns Observable<CountQueryResult>
     */
    doFullTextSearchCountQueryCountQueryResult(searchTerm: string, params?: FulltextSearchParams): Observable<CountQueryResult> {

        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearchCountQuery'));
        }

        let httpParams = new HttpParams();

        if (params !== undefined) {
            httpParams = this.processFulltextSearchParams(params, httpParams);
        }

        const res = this.httpGet('/v2/search/count/' + encodeURIComponent(searchTerm), httpParams);

        return res.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            ),
            map(
                // convert to a `CountQueryResult`
                ConvertJSONLD.createCountQueryResult
            )
        );
    }

    /**
     * Performs an extended search.
     * TODO: mark as deprecated, use of `doExtendedSearchReadResourceSequence` recommended
     *
     * @param gravsearchQuery the Sparql query string to be sent to Knora.
     * @returns Observable<ApiServiceResult>
     */
    doExtendedSearch(gravsearchQuery: string): Observable<ApiServiceResult> {

        if (gravsearchQuery === undefined || gravsearchQuery.length === 0) {
            return Observable.create(observer => observer.error('No Sparql string given for call of SearchService.doExtendedSearch'));
        }

        return this.httpPost('/v2/searchextended', gravsearchQuery);
    }

    /**
     * Performs an extended search and turns the result into a `ReadResourceSequence`.
     *
     * @param gravsearchQuery the Sparql query string to be sent to Knora.
     * @returns Observable<ApiServiceResult>
     */
    doExtendedSearchReadResourceSequence(gravsearchQuery: string): Observable<ReadResourcesSequence> {

        if (gravsearchQuery === undefined || gravsearchQuery.length === 0) {
            return Observable.create(observer => observer.error('No Sparql string given for call of SearchService.doExtendedSearch'));
        }

        const res = this.httpPost('/v2/searchextended', gravsearchQuery);

        return res.pipe(
            mergeMap(
                this.processJSONLD
            ),
            mergeMap(
                this.convertJSONLDToReadResourceSequence
            )
        );
    }

    /**
     * Performs an extended search count query.
     * TODO: mark as deprecated, use of `doExtendedSearchReadResourceSequence` recommended
     *
     * @param {string} gravsearchQuery the Sparql query string to be sent to Knora.
     * @returns Observable<ApiServiceResult>
     */
    doExtendedSearchCountQuery(gravsearchQuery: string): Observable<ApiServiceResult> {

        if (gravsearchQuery === undefined || gravsearchQuery.length === 0) {
            return Observable.create(observer => observer.error('No Sparql string given for call of SearchService.doExtendedSearchCountQuery'));
        }

        return this.httpPost('/v2/searchextended/count', gravsearchQuery);
    }

    /**
     * Performs an extended search count query and turns the result into a `CountQueryResult`.
     *
     * @param gravsearchQuery the Sparql query string to be sent to Knora.
     * @returns Observable<ApiServiceResult>
     */
    doExtendedSearchCountQueryCountQueryResult(gravsearchQuery: string): Observable<CountQueryResult> {

        if (gravsearchQuery === undefined || gravsearchQuery.length === 0) {
            return Observable.create(observer => observer.error('No Sparql string given for call of SearchService.doExtendedSearchCountQuery'));
        }

        const res = this.httpPost('/v2/searchextended/count', gravsearchQuery);

        return res.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            ),
            map(
                // convert to a `CountQueryResult`
                ConvertJSONLD.createCountQueryResult
            )
        );
    }

    /**
     * Perform a search by a resource's rdfs:label.
     * TODO: mark as deprecated, use of `searchByLabelReadResourceSequence` recommended
     *
     * @param {string} searchTerm the term to search for.
     * @param {string} [resourceClassIRI] restrict search to given resource class.
     * @param {string} [projectIri] restrict search to given project.
     * @returns Observable<ApiServiceResult>
     */
    searchByLabel(searchTerm: string, resourceClassIRI?: string, projectIri?: string): Observable<ApiServiceResult> {

        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearch'));
        }

        let httpParams: HttpParams = new HttpParams();

        if (resourceClassIRI !== undefined) {
            httpParams = httpParams.set('limitToResourceClass', resourceClassIRI);
        }

        if (projectIri !== undefined) {
            httpParams = httpParams.set('limitToProject', projectIri);
        }

        // httpGet() expects only one argument, not 2
        return this.httpGet('/v2/searchbylabel/' + encodeURIComponent(searchTerm), httpParams);

    }

    /**
     * Perform a search by a resource's rdfs:label and turns the results in a `ReadResourceSequence`.
     *
     * @param {string} searchTerm the term to search for.
     * @param {string} [resourceClassIRI] restrict search to given resource class.
     * @param {string} [projectIri] restrict search to given project.
     * @returns Observable<ApiServiceResult>
     */
    searchByLabelReadResourceSequence(searchTerm: string, resourceClassIRI?: string, projectIri?: string): Observable<ReadResourcesSequence> {

        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearch'));
        }

        let httpParams: HttpParams = new HttpParams();

        if (resourceClassIRI !== undefined) {
            httpParams = httpParams.set('limitToResourceClass', resourceClassIRI);
        }

        if (projectIri !== undefined) {
            httpParams = httpParams.set('limitToProject', projectIri);
        }

        const res = this.httpGet('/v2/searchbylabel/' + encodeURIComponent(searchTerm), httpParams);

        return res.pipe(
            mergeMap(
                this.processJSONLD
            ),
            mergeMap(
                this.convertJSONLDToReadResourceSequence
            )
        );
    }
}
