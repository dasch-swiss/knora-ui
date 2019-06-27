import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { KuiCoreConfigToken } from '../../core.module';
import { ApiServiceError, ApiServiceResult, ReadResourcesSequence, ResourcesSequence } from '../../declarations';
import { ApiService } from '../api.service';
import { ConvertJSONLD } from './convert-jsonld';
import { OntologyCacheService, OntologyInformation } from './ontology-cache.service';

/**
 * Requests representation of resources from Knora.
 */
@Injectable({
    providedIn: 'root'
})
export class ResourceService extends ApiService {

    constructor (public http: HttpClient,
        @Inject(KuiCoreConfigToken) public config,
        private _ontologyCacheService: OntologyCacheService) {
        super(http, config);
    }

    /**
     * Given the Iri, requests the representation of a resource.
     *
     * @param {string} iri Iri of the resource (not yet URL encoded).
     * @returns Observable<ApiServiceResult>
     */
    getResource(iri: string): Observable<ResourcesSequence | ApiServiceError> {
        const res: Observable<ApiServiceResult | ApiServiceError> = this.httpGet('/v2/resources/' + encodeURIComponent(iri));

        return res.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            ),
            mergeMap(
                // return Observable of ReadResourcesSequence
                (resourceResponse: object) => {
                    // convert JSON-LD into a ReadResourceSequence
                    const resSeq: ResourcesSequence = ConvertJSONLD.createResourcesSequenceFromJsonLD(resourceResponse);

                    // collect resource class Iris
                    const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(resourceResponse);

                    // request information about resource classes
                    return this._ontologyCacheService.getResourceClassDefinitions(resourceClassIris).pipe(
                        map(
                            (ontoInfo: OntologyInformation) => {
                                // add ontology information to ReadResourceSequence
                                resSeq.ontologyInformation.updateOntologyInformation(ontoInfo);
                                return resSeq;
                            }
                        )
                    );
                }
            )
        );


    }

    /**
     * Given the Iri, requests the representation of a resource as a `ReadResourceSequence`.
     *
     * @param {string} iri Iri of the resource (not yet URL encoded).
     * @returns {Observable<ReadResourcesSequence>}
     */
    getReadResource(iri: string): Observable<ReadResourcesSequence | ApiServiceError> {
        const res: Observable<ApiServiceResult | ApiServiceError> = this.httpGet('/v2/resources/' + encodeURIComponent(iri));

        // TODO: handle case of an ApiServiceError

        return res.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                this.processJSONLD
            ),
            mergeMap(
                // return Observable of ReadResourcesSequence
                (resourceResponse: object) => {
                    // convert JSON-LD into a ReadResourceSequence
                    const resSeq: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(resourceResponse);

                    // collect resource class Iris
                    const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(resourceResponse);

                    // request information about resource classes
                    return this._ontologyCacheService.getResourceClassDefinitions(resourceClassIris).pipe(
                        map(
                            (ontoInfo: OntologyInformation) => {
                                // add ontology information to ReadResourceSequence
                                resSeq.ontologyInformation.updateOntologyInformation(ontoInfo);
                                return resSeq;
                            }
                        )
                    );
                }
            )
        );
    }

    // TODO: post, put, delete
}
