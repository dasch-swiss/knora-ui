import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Subscription } from 'rxjs';
import { Observable } from 'rxjs/internal/Observable';
import { throwError } from 'rxjs/internal/observable/throwError';
import { catchError, map } from 'rxjs/operators';
import { ApiServiceError, ApiServiceResult, CurrentUser, KuiCoreConfig } from '../declarations';
import { AuthenticationCacheService } from './admin/authentication-cache.service';


@Injectable({
    providedIn: 'root',
})
export abstract class ApiService {

    /**
     *  if is loading, set it true;
     *  it can be used in components
     *  for progress loader element
     */
    loading = false;

    protected constructor(public http: HttpClient,
                          private _acs: AuthenticationCacheService,
                          @Inject('config') public config: KuiCoreConfig) {
    }

    /**
     * GET
     *
     * @param {string} path
     * @returns {Observable<any>}
     */
    httpGet(path: string): Observable<any> {

        this.loading = true;

        const headers = this.setHeaders();

        return this.http.get(this.config.api + path, {headers: headers, observe: 'response'}).pipe(
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
     * POST
     *
     * @param {string} path
     * @param body
     * @returns {Observable<any>}
     */
    httpPost(path: string, body?: any): Observable<any> {

        this.loading = true;

        const headers = this.setHeaders();

        return this.http.post(this.config.api + path, body, {headers: headers, observe: 'response'}).pipe(
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
     * PUT
     *
     * @param {string} path
     * @param body
     * @returns {Observable<any>}
     */
    httpPut(path: string, body?: any): Observable<any> {

        this.loading = true;

        const headers = this.setHeaders();

        return this.http.put(this.config.api + path, body, {headers: headers, observe: 'response'}).pipe(
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
     * @returns {Observable<any>}
     */
    httpDelete(path: string): Observable<any> {

        this.loading = true;

        const headers = this.setHeaders();

        return this.http.delete(this.config.api + path, {headers: headers, observe: 'response'}).pipe(
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

    protected setHeaders(): HttpHeaders {
        let currentUser: CurrentUser;
        let subscription: Subscription;
        // TODO: get the currentUser information from authenticationCacheService instead from localStorage
        // get key from local storage
        const key = localStorage.getItem('session_id');

        subscription = this._acs.get(key)
            .subscribe(
                (result: any) => {
                    currentUser = result;
                    console.log('api service -- setHeaders -- currentUser from acs', currentUser);
                },
                (error: any) => {
                    console.error(error);
                    return new HttpHeaders();
                }
            );
        console.log('api service -- setHeaders -- subscription from acs', subscription);

        if (currentUser) {
            return new HttpHeaders({
                'Authorization': `Bearer ${currentUser.token}`
            });
        } else {
            return new HttpHeaders();
        }


        /*
        if (localStorage.getItem('currentUser') !== null) {
            return new HttpHeaders({
                'Authorization': `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`
            });
        } else {
            return new HttpHeaders();
        }
        */


    }

    /**
     * Appends to existing options if they exist.
     * @param {HttpHeaders} options
     * @returns {HttpHeaders}
     */
    protected appendToOptions(options: any): any {

        let headers: HttpHeaders;

        if (!options) {
            headers = this.appendAuthorizationHeader();
            console.log('2a) ', headers);
            options = {
                headers
            };
            console.log('2b) ', options);

        } else {
            // have options
            if (!options['headers']) {
                // no headers set
                options['headers'] = new HttpHeaders();
                console.log('3: ', options);
            } else {
                // have headers, need to append to those
                options['headers'] = this.appendAuthorizationHeader(options['headers']);
                console.log('4: ', options);
            }
        }
        return options;
    }

    /**
     * Appends to existing headers if they exist.
     * @param {Headers} headers
     * @returns {Headers}
     */
    protected appendAuthorizationHeader(headers?: HttpHeaders): HttpHeaders {


        if (!headers) {
            headers = new HttpHeaders();
        }

        if (JSON.parse(localStorage.getItem('currentUser'))) {
            const token = JSON.parse(localStorage.getItem('currentUser')).token;

//            headers.append('Authorization', 'Bearer ' + token);

            headers['Authorization'] = `Bearer ${JSON.parse(localStorage.getItem('currentUser')).token}`;
        }
        return headers;
    }

}
