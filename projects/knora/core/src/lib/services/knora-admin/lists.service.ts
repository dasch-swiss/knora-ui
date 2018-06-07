import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {KuiCoreModule} from '../../core.module';
import {ApiService} from '../api.service';

import {
    ApiServiceResult,
    List,
    ListResponse,
    ListsResponse,
    ListCreatePayload,
    ListInfo,
    ListInfoResponse,
    ListInfoUpdatePayload,
    ListNodeInfo,
    ListNodeInfoResponse
} from '../../declarations/index';
import {catchError, map} from 'rxjs/operators';

@Injectable({
    providedIn: KuiCoreModule
})
export class ListsService extends ApiService {

    private path: string = '/admin/lists';


    // ------------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------------

    /**
     *
     * @param {string} projectIri (optional)
     * @returns {Observable<List[]>}
     */
    getLists(projectIri?: string): Observable<List[]> {
        if (projectIri) {
            this.path += '?projectIri=' + encodeURIComponent(projectIri);
        }
        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(ListsResponse)),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} listIri
     * @returns {Observable<List>}
     */
    getList(listIri: string): Observable<List> {
        return this.httpGet(this.path + '/' + encodeURIComponent(listIri)).pipe(
            map((result: ApiServiceResult) => result.getBody(ListResponse).list),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} listIri
     * @returns {Observable<ListInfo>}
     */
    getListInfo(listIri: string): Observable<ListInfo> {
        this.path += '/infos/' + encodeURIComponent(listIri);
        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(ListInfoResponse).listinfo),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} nodeIri
     * @returns {Observable<ListNodeInfo>}
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
     *
     * @param {ListCreatePayload} payload
     * @returns {Observable<List>}
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
     *
     * @param {ListInfoUpdatePayload} payload
     * @returns {Observable<ListInfo>}
     */
    updateListInfo(payload: ListInfoUpdatePayload): Observable<ListInfo> {
        this.path += '/infos/' + encodeURIComponent(payload.listIri);
        return this.httpPut(this.path, payload).pipe(
            map((result: ApiServiceResult) => result.getBody(ListInfoResponse).listinfo),
            catchError(this.handleJsonError)
        );

    }
}
