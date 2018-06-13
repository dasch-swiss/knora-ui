import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from '../api.service';
import {ApiServiceResult} from '../../declarations';

@Injectable({
    providedIn: 'root'
})
export class ResourceService extends ApiService {

    getResource(iri): Observable<ApiServiceResult> {

        const path: string = '/v2/resources/' + encodeURIComponent(iri);
/*
        return this.httpGet(path).pipe(
            map((result: ApiServiceResult) => result.getBody()),
            catchError(this.handleJsonError)
        );
*/
        return this.httpGet(path);
    }
}
