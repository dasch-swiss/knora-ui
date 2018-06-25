import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiService} from '../api.service';
import {ApiServiceResult} from '../../declarations';

@Injectable()
export class ResourceService extends ApiService {

    /**
     * Given the Iri, requests the representation of a resource.
     *
     * @param iri Iri of the resource (already URL encoded).
     * @returns {Observable<any>}
     */
    getResource(iri): Observable<ApiServiceResult> {
        return this.httpGet('/resources/' + encodeURIComponent(iri));
    }
}
