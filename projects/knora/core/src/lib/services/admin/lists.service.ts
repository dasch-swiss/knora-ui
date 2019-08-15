import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiServiceResult, List, ListCreatePayload, ListInfo, ListInfoResponse, ListInfoUpdatePayload, ListNode, ListResponse, ListsResponse } from '../../declarations';
import { ListNodeResponse } from '../../declarations/api/admin/lists/list-node.response';
import { ApiService } from '../api.service';

/**
 * Request information about lists from Knora.
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
     * Returns a list of all lists.
     *
     * @param {string} [projectIri]
     * @returns Observable<ListNodeInfo[]>
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
     * Return a list node info object.
     *
     * @param {string} nodeIri
     * @returns Observable<ListNodeInfo>
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

    /**
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


    // ------------------------------------------------------------------------
    // PUT
    // ------------------------------------------------------------------------

    /**
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
}
