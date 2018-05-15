import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';


import {catchError, map} from 'rxjs/operators';
import {throwError} from 'rxjs/internal/observable/throwError';

import {ApiServiceError, ApiServiceResult, ProjectsResponse} from '../declarations';

@Injectable()
export class ProjectsService extends ApiService {

    /**
     * returns a list of all projects
     *
     * @returns {Observable<ProjectsResponse>}
     * @throws {ApiServiceError}
     */
    getAllProjects(): Observable<ProjectsResponse> {
        return this.httpGet('/admin/projects').pipe(
            map((result: ApiServiceResult) => result.getBody(ProjectsResponse)),
            catchError(this.handleJsonError)
        );
    }

}
