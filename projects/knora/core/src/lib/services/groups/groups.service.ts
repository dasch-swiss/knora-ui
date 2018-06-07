import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {ApiService} from '../api.service';
import {ApiServiceResult, Group, GroupResponse, GroupsResponse} from '../../declarations';
import {KuiCoreModule} from '../../core.module';

@Injectable({
    providedIn: KuiCoreModule
})
export class GroupsService extends ApiService {

    private path: string = '/admin/groups';

    /**
     *
     * @returns {Observable<Group[]>}
     */
    getAllGroups(): Observable<Group[]> {
        return this.httpGet(this.path).pipe(
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
        this.path += '/' + encodeURIComponent(iri);

        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupResponse).group),
            catchError(this.handleJsonError)
        );
    }

}
