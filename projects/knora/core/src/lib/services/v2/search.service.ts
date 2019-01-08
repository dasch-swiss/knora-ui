import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { from, Observable } from 'rxjs';
import { ApiServiceResult, KuiCoreConfig, ReadResourcesSequence } from '../../declarations';
import { ConvertJSONLD } from './convert-jsonld';
import { map, mergeMap } from 'rxjs/operators';
import { OntologyCacheService, OntologyInformation } from './ontology-cache.service';
import { HttpClient } from '@angular/common/http';

/**
 * Performs searches (fulltext or extended) and search count queries into Knora.
 */
@Injectable({
    providedIn: 'root',
})
export class SearchService extends ApiService {

    constructor(public http: HttpClient,
                @Inject('config') public config: KuiCoreConfig,
                public ontoCache: OntologyCacheService) {
        super(http, config);
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
        return this.ontoCache.getResourceClassDefinitions(resourceClassIris).pipe(
            map(
                (ontoInfo: OntologyInformation) => {
                    // add ontology information to ReadResourceSequence
                    resSeq.ontologyInformation.updateOntologyInformation(ontoInfo);
                    return resSeq;
                }
            )
        );
    };

    /**
     * Perform a fulltext search.
     *
     * @param {string} searchTerm the term to search for.
     * @param {number} offset the offset to be used (for paging, first offset is 0).
     * @returns Observable<ApiServiceResult>
     */
    doFulltextSearch(searchTerm: string, offset: number = 0): Observable<ApiServiceResult> {

        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearch'));
        }

        return this.httpGet('/v2/search/' + searchTerm + '?offset=' + offset);
    }

    doFullTextSearchReadResourceSequence(searchTerm: string, offset: number = 0) {
        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearch'));
        }

        const res: Observable<any> = this.httpGet('/v2/search/' + searchTerm + '?offset=' + offset);

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
     * Perform a fulltext search count query.
     *
     * @param {string} searchTerm the term to search for.
     * @returns Observable<ApiServiceResult>
     */
    doFulltextSearchCountQuery(searchTerm: string): Observable<ApiServiceResult> {

        if (searchTerm === undefined || searchTerm.length === 0) {
            return Observable.create(observer => observer.error('No search term given for call of SearchService.doFulltextSearchCountQuery'));
        }

        return this.httpGet('/v2/search/count/' + searchTerm);
    }

    /**
     * Perform an extended search.
     *
     * @param {string} sparqlString the Sparql query string to be sent to Knora.
     * @returns Observable<ApiServiceResult>
     */
    doExtendedSearch(sparqlString: string): Observable<ApiServiceResult> {

        if (sparqlString === undefined || sparqlString.length === 0) {
            return Observable.create(observer => observer.error('No Sparql string given for call of SearchService.doExtendedSearch'));
        }

        // return this.httpGet('/v2/searchextended/' + encodeURIComponent(sparqlString));
        return this.httpPost('/v2/searchextended', sparqlString);

    }

    /**
     * Perform an extended search count query.
     *
     * @param {string} sparqlString the Sparql query string to be sent to Knora.
     * @returns Observable<ApiServiceResult>
     */
    doExtendedSearchCountQuery(sparqlString: string): Observable<ApiServiceResult> {

        if (sparqlString === undefined || sparqlString.length === 0) {
            return Observable.create(observer => observer.error('No Sparql string given for call of SearchService.doExtendedSearchCountQuery'));
        }

        // return this.httpGet('/v2/searchextended/count/' + encodeURIComponent(sparqlString));
        return this.httpPost('/v2/searchextended/count', sparqlString);
    }

    /**
     * Perform a search by a resource's rdfs:label.
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

        const params = {};

        if (resourceClassIRI !== undefined) {
            params['limitToResourceClass'] = resourceClassIRI;
        }

        if (projectIri !== undefined) {
            params['limitToProject'] = projectIri;
        }

        // httpGet() expects only one argument, not 2
        return this.httpGet('/v2/searchbylabel/' + encodeURIComponent(searchTerm), params);
        // return this.httpGet('/v2/searchbylabel/' + encodeURIComponent(searchTerm));

    }
}
