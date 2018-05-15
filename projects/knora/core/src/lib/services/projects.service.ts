import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';


import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

import {ApiServiceResult, ApiServiceError, ProjectsResponse} from '../declarations';

@Injectable()
export class ProjectsService extends ApiService {

  /**
   * returns a list of all projects
   *
   * @returns {Observable<Project[]>}
   * @throws {ApiServiceError}
   */
  getAllProjects(): Observable<ProjectsResponse> {

    return this.httpGet('/admin/projects').pipe(
      map((result: ApiServiceResult) => {
        // Json2TypeScript Deserialize Project
        console.log(result);
        return result.body;
//        return result.getBody(ProjectsResponse);
      }),
      catchError((error: any) => {
        console.error(error);
        const serviceError = new ApiServiceError();
        return throwError(serviceError);
      })
    );
  }


}
