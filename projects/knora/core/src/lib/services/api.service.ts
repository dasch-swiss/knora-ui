import {Inject, Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs/internal/Observable';

import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';
import {ApiServiceResult} from '../declarations';


@Injectable()
export class ApiService {

  constructor(@Inject('config') private config: any,
              public http: HttpClient) {
  }

  httpGet(url: string): Observable<any> {

    return this.http.get(this.config.api + url, {observe: 'response'}).pipe(
      map((response: HttpResponse<any>) => {
        console.log(response);
        const result = new ApiServiceResult();
        result.status = 0;
        result.statusText = '';
        result.url = url;
        result.body = response.body;
        return result;
      }),
      catchError((error: HttpErrorResponse) => {
        console.error(error);
        return throwError(error);
      })
    );
  }

  /*
  public environment: KnoraCoreConfig;

  static handleError(error: any, url: string): ApiServiceError {

      const response = new ApiServiceError();
      if (error instanceof Response) {
          // console.log(error);
          response.status = error.status;
          response.statusText = error.statusText;
          if (!response.statusText) {
              response.statusText = 'Connection to API endpoint failed';
          }
          response.route = url;
      } else {
          response.status = 0;
          response.statusText = 'Connection to API endpoint failed';
          response.route = url;
      }

      // in case of the authentication service:
      // response.status === 401 --> Unauthorized; password is wrong

      // response.status === 404 --> Not found; username is wrong

      return response;

  }

  constructor(public _http: HttpClient,
              public _coreService: CoreService) {
  }

  /**
   *
   * @param {string} url
   * @param {RequestOptionsArgs} options
   * @returns {Observable<ApiServiceResult>}
   *
  httpGet(url: string, options?: HttpHeaders): Observable<ApiServiceResult> {

      this.environment = this._coreService.getConfig();

//        options = this.appendToOptions(options);

      // if the url is an external one, we have to use this one
      // otherwise we have to use the defined api url from the environment config file
      url = (url.slice(0, 4) === 'http' ? url : this.environment.api + url);
/*
      this._http.get(url)
          .subscribe(response => {

              console.log(response);
              return response;
          });
*


      return this._http.get<ApiServiceResult>(url);
/*
          .map((response: Response) => {
          try {
              const apiServiceResult: ApiServiceResult = new ApiServiceResult();
              apiServiceResult.status = response.status;
              apiServiceResult.statusText = response.statusText;
              apiServiceResult.body = response.json();
              apiServiceResult.url = url;
              return apiServiceResult;
          } catch (e) {
              return ApiService.handleError(response, url);
          }
      }).catch((error: any) => {
          return Observable.throw(ApiService.handleError(error, url));
      });
*
  }

/*
  /**
   * Performs a HTTP POST url to the Knora API.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<ApiServiceResult>}
   *
  httpPost(url: string, body?: any, options?: RequestOptionsArgs): Observable<ApiServiceResult> {

      this.environment = this._coreService.getConfig();

      if (!body) {
          body = {};
      }

      options = this.appendToOptions(options);

      return this._http.post(this.environment.api + url, body, options).map((response: Response) => {
          try {
              const apiServiceResult: ApiServiceResult = new ApiServiceResult();
              apiServiceResult.status = response.status;
              apiServiceResult.statusText = response.statusText;
              apiServiceResult.body = response.json();
              apiServiceResult.url = url;
              return apiServiceResult;
          } catch (e) {
              return ApiService.handleError(response, url);
          }
      }).catch((error: any) => {
          return Observable.throw(ApiService.handleError(error, url));
      });
  }


  /**
   * Performs a HTTP PUT url to the Knora API.
   * @param url
   * @param body
   * @param options
   * @returns {Observable<ApiServiceResult>}
   *
  httpPut(url: string, body?: any, options?: RequestOptionsArgs): Observable<ApiServiceResult> {

      this.environment = this._coreService.getConfig();

      if (!body) {
          body = {};
      }

      options = this.appendToOptions(options);

      return this._http.put(this.environment.api + url, body, options).map((response: Response) => {
          try {
              const apiServiceResult: ApiServiceResult = new ApiServiceResult();
              apiServiceResult.status = response.status;
              apiServiceResult.statusText = response.statusText;
              apiServiceResult.body = response.json();
              apiServiceResult.url = url;
              return apiServiceResult;
          } catch (e) {
              return ApiService.handleError(response, url);
          }
      }).catch((error: any) => {
          return Observable.throw(ApiService.handleError(error, url));
      });
  }

  /**
   * Performs a HTTP DELETE url to the Knora API.
   * @param url
   * @param options
   * @returns {Observable<ApiServiceResult>}
   *
  httpDelete(url: string, options?: RequestOptionsArgs): Observable<ApiServiceResult> {

      this.environment = this._coreService.getConfig();

      options = this.appendToOptions(options);

      return this._http.delete(this.environment.api + url, options).map((response: Response) => {
          try {
              const apiServiceResult: ApiServiceResult = new ApiServiceResult();
              apiServiceResult.status = response.status;
              apiServiceResult.statusText = response.statusText;
              apiServiceResult.body = response.json();
              apiServiceResult.url = url;
              return apiServiceResult;
          } catch (e) {
              return ApiService.handleError(response, url);
          }
      }).catch((error: any) => {
          return Observable.throw(ApiService.handleError(error, url));
      });
  }

  /**
   * Appends to existing options if they exist.
   * @param {RequestOptionsArgs} options
   * @returns {RequestOptionsArgs}
   *
  private appendToOptions(options: HttpHeaders): HttpHeaders {
      if (!options) {
          // no options
          options = {headers: this.appendAuthorizationHeader(), normalizedNames: {}}
      } else {
          // have options
          if (!options.headers) {
              // no headers set
              options.headers = this.appendAuthorizationHeader();
          } else {
              // have headers, need to append to those
              options.headers = this.appendAuthorizationHeader(options.headers);
          }
      }
      return options;
  }

  /**
   * Appends to existing headers if they exist.
   * @param {Headers} headers
   * @returns {Headers}
   *
  private appendAuthorizationHeader(headers?: HttpHeaders): HttpHeaders {
      if (!headers) {
          headers = new HttpHeaders();
      }
      if (JSON.parse(localStorage.getItem('currentUser'))) {
          const token = JSON.parse(localStorage.getItem('currentUser')).token;
          headers.append('Authorization', 'Bearer ' + token);
      }
      return headers;
  }
  */

}
