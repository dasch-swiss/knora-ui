import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../api.service';

/**
 * @deprecated Use new service from @knora/api (github:dasch-swiss/knora-api-js-lib) instead
 */
@Injectable({
    providedIn: 'root'
})
export class BasicOntologyService extends ApiService {

    /**
       * returns our list of a basic ontology
       *
       * @returns {Observable<any>}
       */
    // getBasicOntology(): Observable<any> {
    //     let url = environment.url;
    //     return this.httpGet(url + '/data/base-data/basic-ontology.json', {withCredentials: false});
    // }
    getBasicOntology(): Observable<any> {
        const url = this.config.app;
        return this.httpGet(url + '/data/base-data/basic-ontology.json');
        // return this.httpGet(url + '/data/base-data/basic-ontology.json', {withCredentials: false});
    }

}
