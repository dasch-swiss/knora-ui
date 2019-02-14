import { Inject, Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { ApiServiceError, ApiServiceResult, KuiCoreConfig } from '../../declarations';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

export class ListNodeV2 {

    readonly children: ListNodeV2[];

    readonly isRootNode: boolean;

    constructor(readonly id: string, readonly label: string, readonly position?: number, readonly hasRootNode?: string) {

        // if hasRootNode is not given, this node is the root node.
        this.isRootNode = (hasRootNode === undefined);

        this.children = [];
    }
}

@Injectable({
    providedIn: 'root'
})
export class ListService extends ApiService {

    constructor(public http: HttpClient,
                @Inject('config') public config: KuiCoreConfig) {
        super(http, config);
    }

    /**
     * Converts a JSON-LD represention of a ListNodeV2 to  a `ListNodeV2`.
     * Recursively converts child nodes.
     *
     * @param {object} listJSONLD the JSON-LD representation of a list node v2.
     * @return {ListNodeV2}
     */
    private convertJSONLDToListNode = (listJSONLD: object) => {

        let hasRootNode;

        if (listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasRootNode'] !== undefined) {
            hasRootNode = listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasRootNode']['@id'];
        }

        const listNode = new ListNodeV2(
            listJSONLD['@id'],
            listJSONLD['http://www.w3.org/2000/01/rdf-schema#label'],
            listJSONLD['http://api.knora.org/ontology/knora-api/v2#listNodePosition'],
            hasRootNode
        );

        // check if there are child nodes
        if (listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasSubListNode'] !== undefined) {

            if (Array.isArray(listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasSubListNode'])) {
                // array of child nodes
                for (const subListNode of listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasSubListNode']) {
                    listNode.children.push(this.convertJSONLDToListNode(subListNode));
                }
            } else {
                // single child node
                listNode.children.push(this.convertJSONLDToListNode(listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasSubListNode']));
            }

        }

        return listNode;
    };

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
     * Gets a list.
     *
     * @param {string} rootNodeIri the Iri of the list's root node.
     * @return {Observable<ListNodeV2>}
     */
    getList(rootNodeIri: string): Observable<ListNodeV2> {
        const list: Observable<ApiServiceResult | ApiServiceError> = this.getListFromKnora(rootNodeIri);

        return list.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            ),
            map(
                this.convertJSONLDToListNode
            )
        );
    }

    /**
     * Gets a  list node from Knora.
     *
     * @param {string} listNodeIri the Iri of the list node.
     * @return {Observable<ApiServiceResult | ApiServiceError>}
     */
    private getListNodeFromKnora(listNodeIri: string): Observable<ApiServiceResult | ApiServiceError> {
        return this.httpGet('/v2/node/' + encodeURIComponent(listNodeIri));
    }

    /**
     * Gets a  list node.
     *
     * @param {string} listNodeIri the Iri of the list node.
     * @return {Observable<object>}
     */
    getListNode(listNodeIri: string): Observable<object> {

        const listNode: Observable<ApiServiceResult | ApiServiceError> = this.getListNodeFromKnora(listNodeIri);

        return listNode.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            ),
            map(
                this.convertJSONLDToListNode
            )
        );
    }


}
