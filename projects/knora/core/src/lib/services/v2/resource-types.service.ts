import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';

/**
 * @deprecated Use new service from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 *
 */
@Injectable({
    providedIn: 'root'
})
export class ResourceTypesService extends ApiService {

    /**
       * Get all resource types defined by the vocabulary.
       *
       * @param {string} iri Vocabulary iri
       * @returns Observable<any>
       */
    getResourceTypesByVoc(iri: string): Observable<any> {
        return this.httpGet('/v1/resourcetypes?vocabulary=' + encodeURIComponent(iri));
    }

    /**
     * Get a specific resource type.
     *
     * @param {string} iri resource type iri
     * @returns Observable<any>
     */
    getResourceType(iri: string): Observable<any> {
        return this.httpGet('/v1/resourcetypes/' + encodeURIComponent(iri));
    }


    // putResourceType(iri)

}
