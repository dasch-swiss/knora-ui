import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';
import { ApiServiceError } from '../declarations/api-service-error';
import { ApiServiceResult } from '../declarations/api-service-result';
import { from } from 'rxjs';
import { KuiCoreConfigToken } from '../core.module';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

@Injectable({
    providedIn: 'root',
})
export abstract class ApiService {

    // if is loading, set it true;
    // it can be used in components
    // for progress loader element
    loading = false;

    protected constructor(public http: HttpClient,
                          @Inject(KuiCoreConfigToken) public config) {

        // console.log('ApiService constructor: config', config);
    }

    /**
     * GET
     *
     * @param {string} path the URL for the GET request.
     * @param {HttpParams} params the parameters for the GET request.
     * @returns Observable of any
     */
    httpGet(path: string, params?: HttpParams): Observable<any> {

        this.loading = true;

        return this.http.get(this.config.api + path, {observe: 'response', params: params}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = path;
                result.body = response.body;

                return result;
            }),
            catchError((error: HttpErrorResponse) => {
                this.loading = false;

                return this.handleRequestError(error);
            })
        );

    }

    /**
     * Processes JSON-LD returned by Knora.
     * Expands Iris and creates an empty context object.
     *
     * @param {ApiServiceResult} resourceResponse
     */
    protected processJSONLD(resourceResponse: ApiServiceResult): Observable<object> {

        const resPromises = jsonld.promises;
        // compact JSON-LD using an empty context: expands all Iris
        const resPromise = resPromises.compact(resourceResponse.body, {});

        // convert promise to Observable and return it
        // https://www.learnrxjs.io/operators/creation/frompromise.html
        return from(resPromise);

    }

    /**
     * POST
     *
     * @param {string} path
     * @param {any} body
     * @returns Observable of any
     */
    httpPost(path: string, body?: any): Observable<any> {

        this.loading = true;

        // const headers = this.setHeaders(); --> this is now done by the interceptor from @knora/authentication

        return this.http.post(this.config.api + path, body, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = path;
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
     * @param {string} path
     * @param {any} body
     * @returns Observable of any
     */
    httpPut(path: string, body?: any): Observable<any> {

        this.loading = true;

        // const headers = this.setHeaders(); --> this is now done by the interceptor from @knora/authentication

        return this.http.put(this.config.api + path, body, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                // console.log(response);

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = path;
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
     * @param {string} path
     * @returns Observable of any
     */
    httpDelete(path: string): Observable<any> {

        this.loading = true;

        // const headers = this.setHeaders(); --> this is now done by the interceptor from @knora/authentication

        return this.http.delete(this.config.api + path, {observe: 'response'}).pipe(
            map((response: HttpResponse<any>): ApiServiceResult => {
                this.loading = false;

                // console.log(response);

                const result = new ApiServiceResult();
                result.status = response.status;
                result.statusText = response.statusText;
                result.url = path;
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
     * @returns Observable of ApiServiceError
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
     * @param {any} error
     * @returns Observable of ApiServiceError
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
