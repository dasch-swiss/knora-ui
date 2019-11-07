import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ApiServiceError, ApiServiceResult } from '../../declarations';
import { ApiService } from '../api.service';

/**
 * @deprecated Use new service from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@Injectable({
    providedIn: 'root'
})
export class ListService extends ApiService {


    /**
     * Gets a hierarchical list from Knora.
     *
     * @param {string} rootNodeIri the Iri of the list's root node.
     * @return {Observable<ApiServiceResult | ApiServiceError>}
     */
    private getListFromKnora(rootNodeIri: string): Observable<ApiServiceResult | ApiServiceError> {
        return this.httpGet('/v2/lists/' + encodeURIComponent(rootNodeIri));
    }

    /**
     * Returns a list as expanded JSON-LD.
     *
     * @param {string} rootNodeIri the root node of the list.
     * @return {Observable<object>} the expanded JSON-LD.
     */
    getList(rootNodeIri: string): Observable<object> {
        const listJSONLD = this.getListFromKnora(rootNodeIri);

        return listJSONLD.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            )
        );
    }

    /**
     * Gets a list node from Knora.
     *
     * @param {string} listNodeIri the Iri of the list node.
     * @return {Observable<ApiServiceResult | ApiServiceError>}
     */
    private getListNodeFromKnora(listNodeIri: string): Observable<ApiServiceResult | ApiServiceError> {
        return this.httpGet('/v2/node/' + encodeURIComponent(listNodeIri));
    }

    /**
     * Returns a list node as expanded JSON-LD.
     *
     * @param {string} listNodeIri the Iri of the list node.
     * @return {Observable<object>}
     */
    getListNode(listNodeIri: string): Observable<object> {

        const listNodeJSONLD = this.getListNodeFromKnora(listNodeIri);

        return listNodeJSONLD.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            )
        );
    }
}
