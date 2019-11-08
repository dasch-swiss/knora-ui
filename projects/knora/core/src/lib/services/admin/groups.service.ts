import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiServiceResult, Group, GroupMembersResponse, GroupResponse, GroupsResponse, User } from '../../declarations/';
import { ApiService } from '../api.service';

/**
 * @deprecated Use new service from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 *
 * Request information about group from Knora.
 */
@Injectable({
    providedIn: 'root'
})
export class GroupsService extends ApiService {

    private path: string = '/admin/groups';

    // ------------------------------------------------------------------------
    // GET
    // ------------------------------------------------------------------------

    /**
     * Return a list of all groups.
     *
     * @returns Observable<Group[]>
     */
    getAllGroups(): Observable<Group[]> {
        return this.httpGet(this.path).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupsResponse).groups),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Return a group object (filter by IRI).
     *
     * @param {string} iri
     * @returns Observable<Group>
     */
    getGroupByIri(iri: string): Observable<Group> {
        return this.httpGet(this.path + '/' + encodeURIComponent(iri)).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupResponse).group),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Return a list of all group members.
     *
     * @param {string} iri
     * @returns Observable<User[]>
     */
    getAllGroupMembers(iri: string): Observable<User[]> {
        return this.httpGet(this.path + '/' + encodeURIComponent(iri) + '/members').pipe(
            map((result: ApiServiceResult) => result.getBody(GroupMembersResponse).members),
            catchError(this.handleJsonError)
        );
    }

    // ------------------------------------------------------------------------
    // POST
    // ------------------------------------------------------------------------

    /**
     * Create new group.
     *
     * @param {Group} group
     * @returns Observable<Group>
     */
    createGroup(group: Group): Observable<Group> {
        return this.httpPost(this.path, group).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupResponse).group),
            catchError(this.handleJsonError)
        );
    }

    // ------------------------------------------------------------------------
    // PUT
    // ------------------------------------------------------------------------

    /**
     * Edit a group.
     *
     * @param {Group} groupInfo
     * @returns Observable<Group>
     */
    updateGroup(groupInfo: Group): Observable<Group> {
        return this.httpPut(this.path + '/' + encodeURIComponent(groupInfo.id), groupInfo).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupResponse).group),
            catchError(this.handleJsonError)
        );
    }

    // NOT IMPLEMENTED - PUT: /admin/groups/<groupIri>/status : update group’s status


    // ------------------------------------------------------------------------
    // DELETE
    // ------------------------------------------------------------------------

    /**
     * Delete a group (set status to false).
     *
     * @param {string} iri
     * @returns Observable<Group>
     */
    deleteGroup(iri: string): Observable<Group> {
        return this.httpDelete(this.path + '/' + encodeURIComponent(iri)).pipe(
            map((result: ApiServiceResult) => result.getBody(GroupResponse).group),
            catchError(this.handleJsonError)
        );
    }

}
