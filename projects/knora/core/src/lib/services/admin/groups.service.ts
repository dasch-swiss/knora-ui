import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiServiceResult, Group, GroupResponse, GroupsResponse } from '../../declarations/';
import { ApiService } from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class GroupsService extends ApiService {

    private path: string = '/admin/groups';

    /**
     * return a list of all groups
     *
     * @returns Observable of Group[]
     */
    getAllGroups(): Observable<Group[]> {
        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupsResponse).groups),
            catchError(this.handleJsonError)
        );
    }

    /**
     * return a group object (filter by IRI)
     *
     * @param {string} iri
     * @returns Observable of Group
     */
    getGroupByIri(iri: string): Observable<Group> {
        this.path += '/' + encodeURIComponent(iri);

        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupResponse).group),
            catchError(this.handleJsonError)
        );
    }

}
