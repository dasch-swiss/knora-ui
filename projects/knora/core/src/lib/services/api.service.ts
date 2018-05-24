import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';
import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {ApiServiceError, ApiServiceResult, KuiCoreConfig} from '../declarations';


@Injectable()
export abstract class ApiService {

    /**
     *  if is loading, set it true;
     *  it can be used in components
     *  for progress loader element
     */
    loading = false;

    protected constructor(@Inject('config') public config: KuiCoreConfig, public http: HttpClient) {
    }

    /**
     * GET
     *
     * @param {string} url
     * @returns {Observable<any>}
     */
    httpGet(url: string): Observable<any> {

        this.loading = true;

        return this.http.get(this.config.api + url, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                // console.log(response);

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = url;
                result.body = response.body;
                return result;
            }),
            catchError((error: HttpErrorResponse) => {
                this.loading = false;

                // console.error(error);

                return this.handleRequestError(error);
            })
        );

    }

    /**
     * POST
     *
     * @param {string} url
     * @param body
     * @returns {Observable<any>}
     */
    httpPost(url: string, body?: any): Observable<any> {

        this.loading = true;

        return this.http.post(this.config.api + url, body, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                // console.log(response);

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = url;
                result.body = response.body;
                return result;
            }),
            catchError((error: HttpErrorResponse) => {
                this.loading = false;

                // console.error(error);

                return this.handleRequestError(error);
            })
        );

    }

    /**
     * PUT
     *
     * @param {string} url
     * @param body
     * @returns {Observable<any>}
     */
    httpPut(url: string, body?: any): Observable<any> {

        this.loading = true;

        return this.http.put(this.config.api + url, body, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                // console.log(response);

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = url;
                result.body = response.body;
                return result;

            }),
            catchError((error: HttpErrorResponse) => {
                this.loading = false;

                // console.error(error);

                return this.handleRequestError(error);
            })
        );
    }

    /**
     * DELETE
     *
     * @param {string} url
     * @returns {Observable<any>}
     */
    httpDelete(url: string): Observable<any> {

        this.loading = true;

        return this.http.delete(this.config.api + url, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                // console.log(response);

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = url;
                result.body = response.body;
                return result;

            }),
            catchError((error: HttpErrorResponse) => {
                this.loading = false;

                // console.error(error);

                return this.handleRequestError(error);
            })
        );
    }


    /**
     * handle request error in case of server error
     *
     * @param {HttpErrorResponse} error
     * @returns {Observable<ApiServiceError>}
     */
    protected handleRequestError(error: HttpErrorResponse): Observable<ApiServiceError> {
        // console.error(error);
        const serviceError = new ApiServiceError();
        serviceError.status = error.status;
        serviceError.statusText = error.statusText;
        serviceError.errorInfo = error.message;
        serviceError.url = error.url;
        return throwError(serviceError);
    }

    /**
     * handle json error in case of type error in json response (json2typescript)
     *
     * @param error
     * @returns {Observable<ApiServiceError>}
     */
    protected handleJsonError(error: any): Observable<ApiServiceError> {

        if (error instanceof ApiServiceError) return throwError(error);

        const serviceError = new ApiServiceError();
        serviceError.status = -1;
        serviceError.statusText = 'Invalid JSON';
        serviceError.errorInfo = error;
        serviceError.url = '';
        return throwError(serviceError);

    }

}
