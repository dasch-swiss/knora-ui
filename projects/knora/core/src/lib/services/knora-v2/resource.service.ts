import {Injectable} from '@angular/core';
import {catchError, map} from 'rxjs/operators';
import {Observable} from 'rxjs';

import {ApiService} from '../api.service';
import {KuiCoreModule} from '../../core.module';
import {ApiServiceResult} from '../../declarations';

@Injectable({
    providedIn: KuiCoreModule
})
export class ResourceService extends ApiService {

    getResource(iri): Observable<ApiServiceResult> {

        const path: string = '/v2/resources/' + encodeURIComponent(iri);

        return this.httpGet(path).pipe(
            map((result: ApiServiceResult) => result.getBody()),
            catchError(this.handleJsonError)
        );
        // return this.httpGet('/resources/' + encodeURIComponent(iri));
    }
}
