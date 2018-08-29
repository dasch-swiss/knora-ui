import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { ApiServiceResult } from '../../declarations';

@Injectable({
    providedIn: 'root',
})
export class ResourceService extends ApiService {

    /**
     * Given the Iri, requests the representation of a resource.
     *
     * @param iri Iri of the resource (already URL encoded).
     * @returns {Observable<any>}
     */
    getResource(iri): Observable<ApiServiceResult> {
        // console.log('IRI from resource service: ', iri);
        return this.httpGet('/v2/resources/' + encodeURIComponent(iri));
    }

    // TODO: post, put, delete
}
