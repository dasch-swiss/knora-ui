import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

import {ApiServiceResult, JsonLd} from '../../declarations';
import {ApiService} from '../api.service';

@Injectable({
    providedIn: 'root'
})
export class OntologyService extends ApiService {


    /**
     * Requests the metadata about existing ontologies from Knora's ontologies route.
     *
     * @returns {Observable<ApiServiceResult>}
     */
    getOntologiesMetadata(): Observable<JsonLd> {
        const path = '/v2/ontologies/metadata';
        return this.httpGet(path).pipe(
            map((result: ApiServiceResult) => result.getBody()),
            catchError(this.handleJsonError)
        );
    }

    /**
     * Requests all entity definitions for the given ontologies from Knora's ontologies route.
     *
     * @param ontologyIri the Iri of the named graphs whose resource classes are to be returned.
     * @returns {any}
     */
    getAllEntityDefinitionsForOntologies(ontologyIri: string): Observable<ApiServiceResult> {
        const path = '/v2/ontologies/allentities/' + encodeURIComponent(ontologyIri)
        return this.httpGet(path).pipe(
            map((result: ApiServiceResult) => result.getBody()),
            catchError(this.handleJsonError)
        );

    }

    /**
     * Requests information about the given resource classes from Knora's ontologies route.
     *
     * @param resourceClassIris the Iris of the resource classes to be queried.
     * @returns {any}
     */
    getResourceClasses(resourceClassIris: Array<string>): Observable<any> {

        if (resourceClassIris.length === 0) {
            // no resource class Iris are given to query for, return a failed Observer
            return Observable.create(observer =>
                observer.error('No resource class Iris given for call of OntologyService.getResourceClasses')
            );
        }

        let resClassUriEnc = '';

        resourceClassIris.forEach(function (resClassIri) {
            resClassUriEnc = resClassUriEnc + '/' + encodeURIComponent(resClassIri.toString());
        });

        return this.httpGet('/ontologies/classes' + resClassUriEnc);
    }

    /**
     * Requests properties from Knora's ontologies route.
     *
     * @param propertyIris the Iris of the properties to be queried.
     * @returns {any}
     */
    getProperties(propertyIris: string[]) {

        if (propertyIris.length === 0) {
            // no resource class Iris are given to query for, return a failed Observer
            return Observable.create(observer => observer.error('No property Iris given for call of OntologyService.getProperties'));
        }

        let propertiesUriEnc = '';

        propertyIris.forEach(function (resClassIri) {
            propertiesUriEnc = propertiesUriEnc + '/' + encodeURIComponent(resClassIri.toString());
        });

        return this.httpGet('/ontologies/properties' + propertiesUriEnc);

    }

    newOntology() {
        /*

        // post route: /v2/ontologies/

        // the knora api needs the following data:
        {
            "knora-api:ontologyName": "example",
            "knora-api:projectIri": "$projectWithProjectID",
            "@context": {
                "knora-api": "${OntologyConstants.KnoraApiV2WithValueObjects.KnoraApiV2PrefixExpansion}"    // e.g. knora-api url incl. #
            }
        }
         */
    }

}
