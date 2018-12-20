import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { KuiCoreConfig, RdfDataObject, ResetTriplestoreContentResponse } from '../../declarations';


@Injectable({
  providedIn: 'root'
})
export class StoreService {

  constructor(private http: HttpClient, @Inject('config') public config: KuiCoreConfig) { }

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
