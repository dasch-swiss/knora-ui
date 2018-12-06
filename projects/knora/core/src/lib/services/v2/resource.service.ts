import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';
import { ApiServiceResult } from '../../declarations';

@Injectable({
    providedIn: 'root'
})
export class ResourceService extends ApiService {

    /**
     * Given the Iri, requests the representation of a resource.
     *
     * @param {string} iri Iri of the resource (already URL encoded).
     * @returns {Observable<ApiServiceResult>}
     */

    getResource(iri): Observable<ApiServiceResult> {
        // console.log('IRI from resource service: ', iri);
        return this.httpGet('/v2/resources/' + encodeURIComponent(iri));
    }

    /*
    // TODO: we should use the ApiService correctly. But right now it doesn't work
    getResource(iri): Observable<ReadResource> {
        return this.httpGet('/v2/resources/' + encodeURIComponent(iri)).pipe(
            map((result: ApiServiceResult) => result.getBody(ReadResource)),
            catchError(this.handleJsonError)
        );
    }
    */

    // TODO: post, put, delete
}
