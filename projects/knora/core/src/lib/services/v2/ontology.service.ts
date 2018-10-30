import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable } from 'rxjs';
import { ApiServiceResult, UsersResponse } from '../../declarations';
import { catchError, map, mergeMap } from 'rxjs/operators';

/**
 * Requests ontology information from Knora.
 */
@Injectable({
    providedIn: 'root',
})
export class OntologyService extends ApiService {

    /**
     * Requests the metadata about all existing ontologies from Knora's ontologies route.
     *
     * @returns the metadata of all ontologies (Observable of ApiServiceResult).
     */
    getOntologiesMetadata(): Observable<ApiServiceResult> {
        return this.httpGet('/v2/ontologies/metadata');
    }

    /**
     * Requests all entity definitions for the given ontologies from Knora's ontologies route.
     *
     * @param {string} ontologyIri the Iris of the named graphs whose resource classes are to be returned.
     * @returns the requested ontology (Observable of ApiServiceResult).
     */
    getAllEntityDefinitionsForOntologies(ontologyIri: string): Observable<ApiServiceResult> {
        return this.httpGet('/v2/ontologies/allentities/' + encodeURIComponent(ontologyIri));
    }

    /**
     * Requests information about the given resource classes from Knora's ontologies route.
     *
     * @param {string[]} resourceClassIris the Iris of the resource classes to be queried.
     * @returns the requested resource class definitions (Observable of ApiServiceResult).
     */
    getResourceClasses(resourceClassIris: Array<string>): Observable<ApiServiceResult> {

        if (resourceClassIris.length === 0) {
            // no resource class Iris are given to query for, return a failed Observer
            return Observable.create(observer => observer.error('No resource class Iris given for call of OntologyService.getResourceClasses'));
        }

        let resClassUriEnc = '';

        resourceClassIris.forEach(function (resClassIri) {
            resClassUriEnc = resClassUriEnc + '/' + encodeURIComponent(resClassIri.toString());
        });

        return this.httpGet('/v2/ontologies/classes' + resClassUriEnc);
    }

    /**
     * Requests properties from Knora's ontologies route.
     *
     * @param {string[]} propertyIris the Iris of the properties to be queried.
     * @returns the requested properties (Observable of ApiServiceResult).
     */
    getProperties(propertyIris: string[]): Observable<ApiServiceResult> {

        if (propertyIris.length === 0) {
            // no resource class Iris are given to query for, return a failed Observer
            return Observable.create(observer => observer.error('No property Iris given for call of OntologyService.getProperties'));
        }

        let propertiesUriEnc = '';

        propertyIris.forEach(function (resClassIri) {
            propertiesUriEnc = propertiesUriEnc + '/' + encodeURIComponent(resClassIri.toString());
        });

        return this.httpGet('/v2/ontologies/properties' + propertiesUriEnc);

    }
}
