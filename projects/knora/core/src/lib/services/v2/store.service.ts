import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { RdfDataObject, ResetTriplestoreContentResponse } from '../../declarations';
import { KuiCoreConfigToken } from '../../core.module';

/**
 * @deprecated since v9.5.0
 * Request information about the future of this service on the repository `@knora/api` (github:dasch-swiss/knora-api-js-lib).
 */
@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient, @Inject(KuiCoreConfigToken) public config) { }

  /**
    * @deprecated since v9.5.0
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
