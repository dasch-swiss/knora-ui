import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { catchError, map, mergeMap } from 'rxjs/operators';

import { KuiCoreConfigToken } from '../../core.module';
import { ApiServiceError, ApiServiceResult, KnoraConstants, ReadResourcesSequence, ReadStillImageFileValue, Region, ResourcesSequence, StillImageRepresentation } from '../../declarations';
import { ApiService } from '../api.service';

import { ConvertJSONLD } from './convert-jsonld';
import { IncomingService } from './incoming.service';
import { OntologyCacheService, OntologyInformation } from './ontology-cache.service';

/**
 * @deprecated since v9.5.0
 * Request information about the future of this service on the repository `@knora/api` (github:dasch-swiss/knora-api-js-lib).
 *
 * Requests representation of resources from Knora.
 */
@Injectable({
    providedIn: 'root'
})
export class ResourceService extends ApiService {

    constructor(public http: HttpClient,
        @Inject(KuiCoreConfigToken) public config,
        private _incomingService: IncomingService,
        private _ontologyCacheService: OntologyCacheService) {
        super(http, config);
    }

    /**
     * @deprecated since v9.5.0
     * Given the Iri, requests the representation of a resource.
     *
     * @param {string} iri Iri of the resource (not yet URL encoded).
     * @returns Observable<ApiServiceResult>
     */
    // this should return a resource object with incoming links, annotations, file representations
    // it includes a property: FileRepresentation to display with the parameters for the media type viewer
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

                    const res0 = resSeq.resources[0];

                    // set file representation to display

                    const propKeys: string[] = Object.keys(res0.properties);
                    switch (true) {
                        case propKeys.includes(KnoraConstants.hasStillImageFileValue):
                            // res.fileRepresentationsToDisplay[0] = res.properties[KnoraConstants.hasStillImageFileValue];

                            const imgRepresentations: StillImageRepresentation[] = [];

                            const fileValues: ReadStillImageFileValue[] = res0.properties[KnoraConstants.hasStillImageFileValue] as ReadStillImageFileValue[];
                            const imagesToDisplay: ReadStillImageFileValue[] = fileValues.filter((image) => {
                                return !image.isPreview;
                            });

                            for (const img of imagesToDisplay) {

                                const regions: Region[] = [];
                                for (const incomingRegion of res0.incomingAnnotations) {

                                    // TODO: change return type in Region from ReadResource into Resource
                                    // const region = new Region(incomingRegion);

                                    // regions.push(region);

                                }

                                const stillImage = new StillImageRepresentation(img, regions);
                                imgRepresentations.push(stillImage);

                            }

                            res0.fileRepresentationsToDisplay.stillImage = imgRepresentations;

                            break;
                        case propKeys.includes(KnoraConstants.hasMovingImageFileValue):
                            // res0.fileRepresentationsToDisplay = res0.properties[KnoraConstants.hasMovingImageFileValue];
                            break;
                        case propKeys.includes(KnoraConstants.hasAudioFileValue):
                            // res0.fileRepresentationsToDisplay = res0.properties[KnoraConstants.hasAudioFileValue];
                            break;
                        case propKeys.includes(KnoraConstants.hasDocumentFileValue):
                            // res0.fileRepresentationsToDisplay = res0.properties[KnoraConstants.hasDocumentFileValue];
                            break;
                        case propKeys.includes(KnoraConstants.hasDDDFileValue):
                            // res0.fileRepresentationsToDisplay = res0.properties[KnoraConstants.hasDDDFileValue];
                            break;

                        // TODO: TextFileValue

                        default:
                            // look for incoming fileRepresentation to display
                            // get incoming stillImage files
                            this._incomingService.getStillImageRepresentationsForCompoundResource(res0.id, 0).subscribe(
                                (incomingFiles: ReadResourcesSequence) => {

                                    // console.log('incomingFiles', incomingFiles);

                                    if (incomingFiles.resources.length > 0) {
                                        // update ontology information
                                        resSeq.ontologyInformation.updateOntologyInformation(incomingFiles.ontologyInformation);


                                        // set current offset
                                        // this.incomingStillImageRepresentationCurrentOffset = offset;

                                        // TODO: implement prepending of StillImageRepresentations when moving to the left (getting previous pages)
                                        // TODO: append existing images to response and then assign response to `this.resource.incomingStillImageRepresentations`
                                        // TODO: maybe we have to support non consecutive arrays (sparse arrays)

                                        // append incomingImageRepresentations.resources to this.resource.incomingStillImageRepresentations

                                        Array.prototype.push.apply(res0.incomingFileRepresentations, incomingFiles.resources);
                                        // Array.prototype.push.apply(resSeq.resources[0].incomingFileRepresentations, incomingImageRepresentations.resources);

                                        const incomingImgRepresentations: StillImageRepresentation[] = [];

                                        for (const inRes of incomingFiles.resources) {



                                            const incomingFileValues: ReadStillImageFileValue[] = inRes.properties[KnoraConstants.hasStillImageFileValue] as ReadStillImageFileValue[];
                                            const incomingImagesToDisplay: ReadStillImageFileValue[] = incomingFileValues.filter((image) => {
                                                return !image.isPreview;
                                            });

                                            for (const img of incomingImagesToDisplay) {

                                                const regions: Region[] = [];
                                                /*
                                                for (const incomingRegion of inRes.incomingAnnotations) {

                                                    // TODO: change return type in Region from ReadResource into Resource
                                                    // const region = new Region(incomingRegion);

                                                    // regions.push(incomingRegion);

                                                }
                                                */

                                                const stillImage = new StillImageRepresentation(img, regions);
                                                incomingImgRepresentations.push(stillImage);

                                            }

                                            res0.fileRepresentationsToDisplay.stillImage = incomingImgRepresentations;

                                        }


                                        // prepare attached image files to be displayed
                                        // BeolResource.collectImagesAndRegionsForResource(this.resource);
                                    }
                                },
                                (error: any) => {
                                    console.error(error);
                                }
                            );
                    }


                    // get incoming links
                    this._incomingService.getIncomingLinks(resSeq.resources[0].id, 0).subscribe(
                        (incomingRes: ResourcesSequence) => {
                            // update ontology information
                            resSeq.ontologyInformation.updateOntologyInformation(incomingRes.ontologyInformation);

                            // Append elements incomingResources to this.sequence.incomingLinks
                            Array.prototype.push.apply(resSeq.resources[0].incomingLinks, incomingRes.resources);
                        }
                    );

                    // get incoming annotations


                    // request information about resource classes
                    return this._ontologyCacheService.getResourceClassDefinitions(resourceClassIris).pipe(
                        map(
                            (ontoInfo: OntologyInformation) => {
                                // add ontology information to ReadResourceSequence
                                resSeq.ontologyInformation.updateOntologyInformation(ontoInfo);

                                // console.log('resSeq -- resourceServie', resSeq);

                                return resSeq;
                            }
                        )
                    );
                }

            )
        );

    }

    /**
     * @deprecated since v9.5.0
     *
     * @param iri
     * @returns Observable<ResourcesSequence | ApiServiceError>
     */
    private getResourcesSequence(iri: string): Observable<ResourcesSequence | ApiServiceError> {
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
     * @deprecated since v9.5.0
     *
     * @param sequence
     * @returns void
     */
    requestIncomingResources(sequence: ResourcesSequence): void {

        // make sure that this.sequence has been initialized correctly
        if (sequence === undefined) {
            return;
        }

        // request incoming sequences in case of movingImage and audio

        // request incoming regions in case of stillImage and dddImage
        if (sequence.resources[0].properties[KnoraConstants.hasStillImageFileValue]) {
            // TODO: check if resources is a StillImageRepresentation using the ontology responder (support for subclass relations required)
            // the resource is a StillImageRepresentation, check if there are regions pointing to it

            // this.getIncomingRegions(0);

        } else {
            // this resource is not a StillImageRepresentation
            // check if there are StillImageRepresentations pointing to this resource

            // this gets the first page of incoming StillImageRepresentations
            // more pages may be requested by [[this.viewer]].
            // TODO: for now, we begin with offset 0. This may have to be changed later (beginning somewhere in a collection)
            // this.getIncomingStillImageRepresentations(0);
        }

        // check for incoming links for the current resource
        // this.getIncomingLinks(0);


    }

    /**
     * @deprecated Use **getResourcesSequence** instead
     *
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

    /**
     * @deprecated since v9.5.0
     * Get a resource by IRI and return the json-ld result;
     * it will be used for the request body object in delete and erase resource
     *
     * @param  {string} iri
     */
    getResourceAsJsonLd(iri: string): Observable<any> {

        return this.httpGet('/v2/resources/' + encodeURIComponent(iri)).pipe(
            map((result: ApiServiceResult) => result.body),
            catchError(this.handleJsonError)
        );

    }

    /**
     * @deprecated since v9.5.0
     * Delete resource
     *
     * Knora does not normally delete resources; instead, it marks them as deleted, which means that they do not appear in normal query results.
     *
     * @param {string} iri Iri of the resource
     * @param  {string} [comment] Specifies a comment to be attached to the resource, explaining why it has been marked as deleted. Will be ignored if param erase is true.
     * @param {boolean} [erase] Delete completely from triplestore. Default false.
     */
    deleteResource(iri: string, comment: string = '', erase: boolean = false) {
        const path: string = (erase ? '/v2/resources/erase' : '/v2/resources/delete');

        // get resource first to have the knora-api:lastModificationDate
        this.getResourceAsJsonLd(iri).subscribe(
            (result: any) => {
                const requestBody: any = {
                    '@id': iri,
                    '@type': result['@type'],
                    '@context': result['@context']
                };

                // the resource exists; get the info needed in the request body
                if (result['knora-api:lastModificationDate']) {
                    requestBody['knora-api:lastModificationDate'] = result['knora-api:lastModificationDate'];
                }

                if (comment.length > 0 && !erase) {
                    requestBody['knora-api:deleteComment'] = comment;
                }

                // send the request body to the delete route
                this.httpPost(path, requestBody).subscribe(
                    (resp: any) => {
                        // TODO: return something here
                        // console.log(resp);
                    },
                    (err: any) => {
                        console.error(err);
                    }
                );

            },
            (error: ApiServiceError) => {
                console.error('failed to get resource', error);
            }
        );

    }

    /**
     * @deprecated since v9.5.0
     * Erase resource (from triplestore)
     *
     * @param {string} iri Iri of the resource
     * @param {string} type Resource class
     */

    eraseResource(iri: string) {
        // get resource first to have the knora-api:lastModificationDate
        this.getResourceAsJsonLd(iri).subscribe(
            (result: any) => {
                const requestBody: any = {
                    '@id': iri,
                    '@type': result['@type'],
                    '@context': result['@context']
                };

                // the resource exists; get the info needed in the request body
                if (result['knora-api:lastModificationDate']) {
                    requestBody['knora-api:lastModificationDate'] = result['knora-api:lastModificationDate'];
                }

                // send the request body to the delete route
                this.httpPost('/v2/resources/erase', requestBody).subscribe(
                    (resp: any) => {
                        // TODO: return something here
                        // console.log(resp);
                    },
                    (err: any) => {
                        console.error(err);
                    }
                );

            },
            (error: ApiServiceError) => {
                console.error('failed to get resource', error);
            }
        );

    }

}
