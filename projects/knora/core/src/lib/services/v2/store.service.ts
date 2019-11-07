import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { KuiConfigToken } from '../../core.module';
import { RdfDataObject, ResetTriplestoreContentResponse } from '../../declarations';

/**
 * @deprecated Use new service from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@Injectable({
    providedIn: 'root'
})
export class StoreService {

    constructor(private http: HttpClient, @Inject(KuiConfigToken) public config) { }

    /**
       * Resets the content of the triplestore.
       *
       * @param rdfDataObjects
       * @returns Observable<string>
       */
    resetTriplestoreContent(rdfDataObjects: RdfDataObject[]): Observable<string> {

        return this.http.post<ResetTriplestoreContentResponse>(this.config.api + '/admin/store/ResetTriplestoreContent', rdfDataObjects)
            .pipe(
                map(
                    (data) => {
                        const result: ResetTriplestoreContentResponse = data;
                        // console.log('StoreService - resetTriplestoreContent: ', result);
                        return result.message;
                    },
                    (error: HttpErrorResponse) => {
                        if (error.error instanceof Error) {
                            console.log('StoreService - resetTriplestoreContent - Client-side error occurred.', error);
                        } else {
                            console.log('StoreService - resetTriplestoreContent - Server-side error occurred.', error);
                        }
                        throw error;
                    }
                ));

    }
}
