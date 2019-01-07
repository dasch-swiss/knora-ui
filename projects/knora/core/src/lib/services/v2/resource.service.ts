import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { ApiServiceResult, KuiCoreConfig, ReadResourcesSequence } from '../../declarations';
import { ApiService } from '../api.service';
import { ConvertJSONLD } from './convert-jsonld';
import { OntologyCacheService, OntologyInformation } from './ontology-cache.service';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

/**
 * Requests representation of resources from Knora.
 */
@Injectable({
    providedIn: 'root'
})
export class ResourceService extends ApiService {

    constructor(public http: HttpClient,
                @Inject('config') public config: KuiCoreConfig,
                public ontoCache: OntologyCacheService) {
        super(http, config);
    }

    /**
     * Given the Iri, requests the representation of a resource.
     *
     * @param {string} iri Iri of the resource (already URL encoded).
     * @returns Observable<ApiServiceResult>
     */
    getResource(iri): Observable<ApiServiceResult> {
        // console.log('IRI from resource service: ', iri);
        return this.httpGet('/v2/resources/' + encodeURIComponent(iri));
    }

    /**
     * Given the Iri, requests the representation of a resource as a `ReadResourceSequence`.
     *
     * @param {string} iri Iri of the resource (not yet URL encoded).
     * @return {Observable<ReadResourcesSequence>}
     */
    getReadResourceSequence(iri: string): Observable<ReadResourcesSequence> {
        const res: Observable<any> = this.httpGet('/v2/resources/' + encodeURIComponent(iri));

        return res.pipe(
            mergeMap(
                // this would return an Observable of a PromiseObservable -> combine them into one Observable
                (resourceResponse: ApiServiceResult) => {
                    const resPromises = jsonld.promises;
                    // compact JSON-LD using an empty context: expands all Iris
                    const resPromise = resPromises.compact(resourceResponse.body, {});

                    // convert promise to Observable and return it
                    // https://www.learnrxjs.io/operators/creation/frompromise.html
                    return from(resPromise);
                }
            ),
            mergeMap(
                // return Observable of ReadResourcesSequence
                (resourceResponse: Object) => {
                    // convert JSON-LD into a ReadResourceSequence
                    const resSeq: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(resourceResponse);

                    // collect resource class Iris
                    const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(resourceResponse);

                    // request information about resource classes
                    return this.ontoCache.getResourceClassDefinitions(resourceClassIris).pipe(
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
