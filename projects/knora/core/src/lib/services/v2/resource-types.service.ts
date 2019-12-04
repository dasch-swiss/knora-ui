import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiService } from '../api.service';

/**
 * @deprecated since v9.5.0
 *
 * Request information about the future of this service on the repository `@knora/api` (github:dasch-swiss/knora-api-js-lib).
 */
@Injectable({
    providedIn: 'root'
})
export class ResourceTypesService extends ApiService {

    /**
      * @deprecated since v9.5.0
      * Get all resource types defined by the vocabulary.
      *
      * @param {string} iri Vocabulary iri
      * @returns Observable<any>
      */
    getResourceTypesByVoc(iri: string): Observable<any> {
        return this.httpGet('/v1/resourcetypes?vocabulary=' + encodeURIComponent(iri));
    }

    /**
     * @deprecated since v9.5.0
     * Get a specific resource type.
     *
     * @param {string} iri resource type iri
     * @returns Observable<any>
     */
    getResourceType(iri: string): Observable<any> {
        return this.httpGet('/v1/resourcetypes/' + encodeURIComponent(iri));
    }

}
