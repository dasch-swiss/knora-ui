import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { catchError, map } from 'rxjs/operators';

import {
    ApiServiceResult,
    List,
    ListCreatePayload,
    ListInfo,
    ListInfoResponse,
    ListInfoUpdatePayload,
    ListNodeInfo,
    ListNodeInfoResponse,
    ListResponse,
    ListsResponse
} from '../../declarations';

import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class ListsService extends ApiService {

    private path: string = '/admin/lists';


    // ------------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------------

    /**
     * returns a list of all lists
     *
     * @param {string} projectIri (optional)
     * @returns Observable of ListNodeInfo[]
     */
    getLists(projectIri?: string): Observable<ListNodeInfo[]> {
        if (projectIri) {
            this.path += '?projectIri=' + encodeURIComponent(projectIri);
        }
        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(ListsResponse).lists),
            catchError(this.handleJsonError)
        );
    }

    /**
     * return a list object
     *
     * @param {string} listIri
     * @returns Observable of List
     */
    getList(listIri: string): Observable<List> {
        return this.httpGet(this.path + '/' + encodeURIComponent(listIri)).pipe(
            map((result: ApiServiceResult) => result.getBody(ListResponse).list),
            catchError(this.handleJsonError)
        );
    }

    /**
     * return a list info object
     *
     * @param {string} listIri
     * @returns Observable of ListInfo
     */
    getListInfo(listIri: string): Observable<ListInfo> {
        this.path += '/infos/' + encodeURIComponent(listIri);
        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(ListInfoResponse).listinfo),
            catchError(this.handleJsonError)
        );
    }

    /**
     * return a list node info object
     *
     * @param {string} nodeIri
     * @returns Observable of ListNodeInfo
     */
    getListNodeInfo(nodeIri: string): Observable<ListNodeInfo> {
        this.path += '/nodes/' + encodeURIComponent(nodeIri);
        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(ListNodeInfoResponse).nodeinfo),
            catchError(this.handleJsonError)
        );
    }


    // ------------------------------------------------------------------------
    // POST
    // ------------------------------------------------------------------------

    /**
     * create new list
     *
     * @param {ListCreatePayload} payload
     * @returns Observable of List
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
     * edit list data
     *
     * @param {ListInfoUpdatePayload} payload
     * @returns Observable of ListInfo
     */
    updateListInfo(payload: ListInfoUpdatePayload): Observable<ListInfo> {
        this.path += '/infos/' + encodeURIComponent(payload.listIri);
        return this.httpPut(this.path, payload).pipe(
            map((result: ApiServiceResult) => result.getBody(ListInfoResponse).listinfo),
            catchError(this.handleJsonError)
        );

    }
}
