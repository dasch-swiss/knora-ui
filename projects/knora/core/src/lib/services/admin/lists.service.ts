import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { ApiServiceResult, List, ListCreatePayload, ListInfo, ListInfoResponse, ListInfoUpdatePayload, ListNode, ListNodeResponse, ListNodeUpdatePayload, ListResponse, ListsResponse } from '../../declarations';
import { ApiService } from '../api.service';

/**
 * @deprecated since v9.5.0
 *
 * Request information about the future of this service on the repository `@knora/api` (github:dasch-swiss/knora-api-js-lib).
 */
@Injectable({
    providedIn: 'root'
})
export class ListsService extends ApiService {

    private path: string = '/admin/lists';

    // ------------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------------

    /**
     * @deprecated since v9.5.0
     *
     * Returns a list of all lists.
     *
     * @param {string} [projectIri]
     * @returns Observable<ListNode[]>
     */
    getLists(projectIri?: string): Observable<ListNode[]> {
        let newPath = this.path;
        if (projectIri) {
            newPath += '?projectIri=' + encodeURIComponent(projectIri);
        }
        return this.httpGet(newPath).pipe(
            map((result: ApiServiceResult) => result.getBody(ListsResponse).lists),
            catchError(this.handleJsonError)
        );
    }

    /**
     * @deprecated since v9.5.0
     *
     * Return a list object.
     *
     * @param {string} listIri
     * @returns Observable<List>
     */
    getList(listIri: string): Observable<List> {
        return this.httpGet(this.path + '/' + encodeURIComponent(listIri)).pipe(
            map((result: ApiServiceResult) => result.getBody(ListResponse).list),
            catchError(this.handleJsonError)
        );
    }

    /**
     * @deprecated since v9.5.0
     *
     * Return a list info object.
     *
     * @param {string} listIri
     * @returns Observable<ListInfo>
     */
    getListInfo(listIri: string): Observable<ListInfo> {
        return this.httpGet(this.path + '/infos/' + encodeURIComponent(listIri)).pipe(
            map((result: ApiServiceResult) => result.getBody(ListInfoResponse).listinfo),
            catchError(this.handleJsonError)
        );
    }

    /**
     * @deprecated since v9.5.0
     *
     * Return a list node info object.
     *
     * @param {string} nodeIri
     * @returns Observable<ListNode>
     */
    getListNodeInfo(nodeIri: string): Observable<ListNode> {
        return this.httpGet(this.path + '/nodes/' + encodeURIComponent(nodeIri)).pipe(
            map((result: ApiServiceResult) => result.getBody(ListNodeResponse).nodeinfo),
            catchError(this.handleJsonError)
        );
    }


    // ------------------------------------------------------------------------
    // POST
    // ------------------------------------------------------------------------

    /**v9.5.0
     *
     * @deprecated since v9.5.0
     *
     * Create new list.
     *
     * @param {ListCreatePayload} payload
     * @returns Observable<List>
     */
    createList(payload: ListCreatePayload): Observable<List> {
        return this.httpPost(this.path, payload).pipe(
            map((result: ApiServiceResult) => result.getBody(ListResponse).list),
            catchError(this.handleJsonError)
        );
    }

    /**v9.5.0
     *
     * @deprecated since v9.5.0
     *
     * Create new list node.
     *
     * @param {string} listIri
     * @param {ListNodeUpdatePayload} payload
     * @returns Observable<ListNode>
     */
    createListItem(listIri: string, payload: ListNodeUpdatePayload): Observable<ListNode> {
        return this.httpPost(this.path + '/' + encodeURIComponent(listIri), payload).pipe(
            map((result: ApiServiceResult) => result.getBody(ListNodeResponse).nodeinfo),
            catchError(this.handleJsonError)
        );
    }


    // ------------------------------------------------------------------------
    // PUT
    // ------------------------------------------------------------------------

    /**v9.5.0
     *
     * @deprecated since v9.5.0
     *
     * Edit list data.
     *
     * @param {ListInfoUpdatePayload} payload
     * @returns Observable<ListInfo>
     */
    updateListInfo(payload: ListInfoUpdatePayload): Observable<ListInfo> {
        return this.httpPut(this.path + '/infos/' + encodeURIComponent(payload.listIri), payload).pipe(
            map((result: ApiServiceResult) => result.getBody(ListInfoResponse).listinfo),
            catchError(this.handleJsonError)
        );
    }

    // updateListItem(payload: )
}
