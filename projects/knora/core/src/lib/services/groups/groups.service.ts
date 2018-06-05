import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ApiService} from '../api.service';
import {ApiServiceResult, Group, GroupsResponse} from '../../declarations';
import {KuiCoreModule} from '../../core.module';

@Injectable({
    providedIn: KuiCoreModule
})
export class GroupsService extends ApiService {

    private url: string = '/admin/groups/';

    /**
     *
     * @returns {Observable<Group[]>}
     */
    getAllGroups(): Observable<Group[]> {
        return this.httpGet(this.url).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupsResponse).groups),
            catchError(this.handleJsonError)
        );
    }

    /**
     *
     * @param {string} iri
     * @returns {Observable<Group>}
     */
    getGroupByIri(iri: string): Observable<Group> {
        this.url += encodeURIComponent(iri);

        return this.httpGet(this.url).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupsResponse).group),
            catchError(this.handleJsonError)
        );
    }

}
