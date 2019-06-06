import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ListService } from './list.service';

/**
 * Represents a list node v2.
 */
export class ListNodeV2 {

    readonly children: ListNodeV2[];

    readonly isRootNode: boolean;

    constructor(readonly id: string, readonly label: string, readonly position?: number, readonly hasRootNode?: string) {

        // if hasRootNode is not given, this node is the root node.
        this.isRootNode = (hasRootNode === undefined);

        this.children = [];
    }
}

class ListCache {

    [index: string]: ListNodeV2;

}

class ListNodeIriToListNodeV2 {

    [index: string]: ListNodeV2;
}

@Injectable({
    providedIn: 'root'
})
export class ListCacheService {

    private listCache = new ListCache();

    private listNodeIriToListNodeV2 = new ListNodeIriToListNodeV2();

    constructor(private _listService: ListService) {
    }

    private hasRootNode(listJSONLD) {
        let hasRoot;

        if (listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasRootNode'] !== undefined) {
            hasRoot = listJSONLD['http://api.knora.org/ontology/knora-api/v2#hasRootNode']['@id'];
        }

        return hasRoot;
    }

    /**
     * Converts a JSON-LD represention of a ListNodeV2 to  a `ListNodeV2`.
     * Recursively converts child nodes.
     *
     * @param {object} listJSONLD the JSON-LD representation of a list node v2.
     * @return {ListNodeV2}
     */
    private convertJSONLDToListNode: (listJSONLD: object) => ListNodeV2 = (listJSONLD: object) => {

        const listNodeIri = listJSONLD['@id'];

        const hasRootNode = this.hasRootNode(listJSONLD);

        const listNode = new ListNodeV2(
            listNodeIri,
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

        this.listNodeIriToListNodeV2[listNodeIri] = listNode;

        return listNode;
    };

    /**
     * Gets a list from the cache or requests it from Knora and caches it.
     *
     * @param {string} rootNodeIri the Iri of the list's root node.
     * @return {Observable<ListNodeV2>}
     */
    getList(rootNodeIri: string): Observable<ListNodeV2> {

        // check if list is already in cache
        if (this.listCache[rootNodeIri] !== undefined) {

            // return list from cache
            return of(this.listCache[rootNodeIri]);

        } else {
            // get list from Knora and cache it

            const listJSONLD = this._listService.getList(rootNodeIri);

            const listV2: Observable<ListNodeV2> = listJSONLD.pipe(
                map(
                    this.convertJSONLDToListNode
                )
            );

            return listV2.pipe(
                map(
                    (list: ListNodeV2) => {
                        // write list to cache and return it
                        this.listCache[rootNodeIri] = list;
                        return list;
                    }
                )
            );
        }
    }

    /**
     * Gets a list node from the cache or requests the whole list from Knora and caches it.
     *
     * @param {string} listNodeIri the Iri of the list node.
     * @return {Observable<object>}
     */
    getListNode(listNodeIri: string): Observable<ListNodeV2> {

        // check if list node is already in cache
        if (this.listNodeIriToListNodeV2[listNodeIri] !== undefined) {

            // list node is already cached
            return of(this.listNodeIriToListNodeV2[listNodeIri]);

        } else {

            const listNode = this._listService.getListNode(listNodeIri);

            return listNode.pipe(
                mergeMap(
                    (listNodeJSONLD: object) => {
                        const hasRootNode = this.hasRootNode(listNodeJSONLD);

                        if (hasRootNode !== undefined) {
                            // get the whole list
                            return this.getList(hasRootNode).pipe(
                                map(
                                    (completeList: ListNodeV2) => {
                                        // get list node from cache
                                        return this.listNodeIriToListNodeV2[listNodeIri];
                                    })
                            );
                        } else {
                            // this is the root node, get the whole list
                            return this.getList(listNodeIri).pipe(
                                map(
                                    (completeList: ListNodeV2) => {
                                        // get list node from cache
                                        return this.listNodeIriToListNodeV2[listNodeIri];
                                    })
                            );
                        }
                    }
                )
            );
        }
    }
}
