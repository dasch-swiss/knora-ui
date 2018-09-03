import { Component, OnChanges, OnInit, SimpleChange } from '@angular/core';
import {
    ApiServiceError,
    ApiServiceResult,
    ConvertJSONLD,
    ImageRegion,
    IncomingService,
    KnoraConstants,
    OntologyCacheService,
    OntologyInformation,
    ReadLinkValue,
    ReadPropertyItem,
    ReadResource,
    ReadResourcesSequence,
    ReadStillImageFileValue,
    ResourceService,
    StillImageRepresentation,
    Utils
} from '@knora/core';

declare let require: any;
const jsonld = require('jsonld');

@Component({
    selector: 'kui-properties-view',
    templateUrl: './properties-view.component.html',
    styleUrls: ['./properties-view.component.scss']
})
export class PropertiesViewComponent implements OnInit, OnChanges {

    // @ViewChild('OSDViewer') osdViewer: StillImageOSDViewerComponent;

    // example of a resource:
    // iri: string = 'http://rdfh.ch/0fb54d8bd503';
    iri: string = 'http://rdfh.ch/2d301f147f03';
    isLoading: boolean = true;
    errorMessage: any;

    ontologyInfo: OntologyInformation; // ontology information about resource classes and properties present in the requested resource with Iri `iri`
    resource: ReadResource; // the resource to be displayed

    incomingStillImageRepresentationCurrentOffset: number; // last offset requested for `this.resource.incomingStillImageRepresentations`

    KnoraConstants = KnoraConstants;

    constructor(private _resourceService: ResourceService,
        private _cacheService: OntologyCacheService,
        private _incomingService: IncomingService,
    ) { }

    ngOnChanges(changes: { [key: string]: SimpleChange }) {
        // prevent duplicate requests. if isFirstChange resource will be requested on ngOnInit
        if (!changes['iri'].isFirstChange()) {
            this.getResource(this.iri);
        }
    }

    ngOnInit() {
        this.getResource(this.iri);
    }

    private getResource(iri: string): void {
        this._resourceService.getResource(iri)
            .subscribe(
                (result: ApiServiceResult) => {
                    const promises = jsonld.promises;
                    // compact JSON-LD using an empty context: expands all Iris
                    const promise = promises.compact(result.body, {});

                    promise.then((compacted) => {

                        const resourceSeq: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                        // make sure that exactly one resource is returned
                        if (resourceSeq.resources.length === 1) {

                            // get resource class Iris from response
                            const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

                            // request ontology information about resource class Iris (properties are implied)
                            this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
                                (resourceClassInfos: any) => {
                                    // initialize ontology information
                                    this.ontologyInfo = resourceClassInfos;

                                    // prepare a possibly attached image file to be displayed
                                    this.collectImagesAndRegionsForResource(resourceSeq.resources[0]);

                                    this.resource = resourceSeq.resources[0];

                                    this.requestIncomingResources();
                                },
                                (err) => {

                                    console.log('cache request failed: ' + err);
                                });
                        } else {
                            // exactly one resource was expected, but resourceSeq.resources.length != 1
                            this.errorMessage = `Exactly one resource was expected, but ${resourceSeq.resources.length} resource(s) given.`;
                        }
                    }, function (err) {
                        console.error('JSONLD of full resource request could not be expanded:' + err);
                    });
                    // this.isLoading = false;
                },
                (error: ApiServiceError) => {
                    console.error(error);
                    // this.errorMessage = <any>error;
                    // this.isLoading = false;
                });
    }

    /**
     * Requests incoming resources for [[this.resource]].
     * Incoming resources are: regions, StillImageRepresentations, and incoming links.
     *
     **/
    private requestIncomingResources(): void {

        // make sure that this.resource has been initialized correctly
        if (this.resource === undefined) return;

        // request incoming regions
        if (this.resource.properties[KnoraConstants.hasStillImageFileValue]) { // TODO: check if resources is a StillImageRepresentation using the ontology responder (support for subclass relations required)
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
     * Gets the incoming regions for [[this.resource]].
     *
     * @param offset the offset to be used (needed for paging). First request uses an offset of 0.
     * @param function to be called when new images have been loaded from the server. It takes the number of images returned as an argument.
     */
    private getIncomingRegions(offset: number, callback?: (numberOfResources: number) => void): void {
        this._incomingService.getIncomingRegions(this.resource.id, offset).subscribe(
            (result: ApiServiceResult) => {
                const promise = jsonld.promises.compact(result.body, {});
                promise.then((compacted) => {
                    const regions: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                    // get resource class Iris from response
                    const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

                    // request ontology information about resource class Iris (properties are implied)
                    this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
                        (resourceClassInfos: any) => {
                            // update ontology information
                            this.ontologyInfo.updateOntologyInformation(resourceClassInfos);

                            // Append elements of regions.resources to resource.incoming
                            Array.prototype.push.apply(this.resource.incomingRegions, regions.resources);

                            // prepare regions to be displayed
                            this.collectImagesAndRegionsForResource(this.resource);

                            /* if (this.osdViewer) {
                                this.osdViewer.updateRegions();
                            } */

                            // if callback is given, execute function with the amount of new images as the parameter
                            if (callback !== undefined) callback(regions.resources.length);
                        },
                        (err) => {

                            console.log('cache request failed: ' + err);
                        });
                },
                    function (err) {
                        console.log('JSONLD of regions request could not be expanded:' + err);
                    });
            },
            (error: ApiServiceError) => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            }
        );
    }


    /**
     * Get StillImageRepresentations pointing to [[this.resource]].
     * This method may have to called several times with an increasing offsetChange in order to get all available StillImageRepresentations.
     *
     * @param offset the offset to be used (needed for paging). First request uses an offset of 0.
     * @param function to be called when new images have been loaded from the server. It takes the number of images returned as an argument.
     */
    private getIncomingStillImageRepresentations(offset: number, callback?: (numberOfResources: number) => void): void {
        // make sure that this.resource has been initialized correctly
        if (this.resource === undefined) return;

        if (offset < 0) {
            console.log(`offset of ${offset} is invalid`);
            return;
        }

        this._incomingService.getStillImageRepresentationsForCompoundResource(this.resource.id, offset).subscribe(
            (result: ApiServiceResult) => {

                const promise = jsonld.promises.compact(result.body, {});
                promise.then((compacted) => {
                    // console.log(compacted);

                    const incomingImageRepresentations: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                    // get resource class Iris from response
                    const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

                    // request ontology information about resource class Iris (properties are implied)
                    this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
                        (resourceClassInfos: any) => {

                            if (incomingImageRepresentations.resources.length > 0) {
                                // update ontology information
                                this.ontologyInfo.updateOntologyInformation(resourceClassInfos);

                                // set current offset
                                this.incomingStillImageRepresentationCurrentOffset = offset;

                                // TODO: implement prepending of StillImageRepresentations when moving to the left (getting previous pages)
                                // TODO: append existing images to response and then assign response to `this.resource.incomingStillImageRepresentations`
                                // TODO: maybe we have to support non consecutive arrays (sparse arrays)

                                // append incomingImageRepresentations.resources to this.resource.incomingStillImageRepresentations
                                Array.prototype.push.apply(this.resource.incomingStillImageRepresentations, incomingImageRepresentations.resources);

                                // prepare attached image files to be displayed
                                this.collectImagesAndRegionsForResource(this.resource);
                            }

                            // if callback is given, execute function with the amount of new images as the parameter
                            if (callback !== undefined) callback(incomingImageRepresentations.resources.length);
                        },
                        (err) => {

                            console.log('cache request failed: ' + err);
                        });
                },
                    function (err) {
                        console.log('JSONLD of regions request could not be expanded:' + err);
                    });


            },
            (error: ApiServiceError) => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            }
        );
    }


    /**
     * Get resources pointing to [[this.resource]] with properties other than knora-api:isPartOf and knora-api:isRegionOf.
     *
     * @param offset the offset to be used (needed for paging). First request uses an offset of 0.
     * @param function to be called when new images have been loaded from the server. It takes the number of images returned as an argument.
     */
    private getIncomingLinks(offset: number, callback?: (numberOfResources: number) => void): void {
        this._incomingService.getIncomingLinksForResource(this.resource.id, offset).subscribe(
            (result: ApiServiceResult) => {
                const promise = jsonld.promises.compact(result.body, {});
                promise.then((compacted) => {
                    const incomingResources: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                    // get resource class Iris from response
                    const resourceClassIris: string[] = ConvertJSONLD.getResourceClassesFromJsonLD(compacted);

                    // request ontology information about resource class Iris (properties are implied)
                    this._cacheService.getResourceClassDefinitions(resourceClassIris).subscribe(
                        (resourceClassInfos: any) => {
                            // update ontology information
                            this.ontologyInfo.updateOntologyInformation(resourceClassInfos);

                            // Append elements incomingResources to this.resource.incomingLinks
                            Array.prototype.push.apply(this.resource.incomingLinks, incomingResources.resources);

                            // if callback is given, execute function with the amount of incoming resources as the parameter
                            if (callback !== undefined) callback(incomingResources.resources.length);

                        },
                        (err) => {

                            console.log('cache request failed: ' + err);
                        });
                },
                    function (err) {
                        console.log('JSONLD of regions request could not be expanded:' + err);
                    });
            },
            (error: ApiServiceError) => {
                this.errorMessage = <any>error;
                this.isLoading = false;
            }
        );
    }


    /**
     * Creates a collection of [[StillImageRepresentation]] belonging to the given resource and assigns it to it.
     * Each [[StillImageRepresentation]] represents an image including regions.
     *
     * @param resource The resource to get the images for.
     * @returns A collection of images for the given resource.
     */
    private collectImagesAndRegionsForResource(resource: ReadResource): void {

        const imgRepresentations: StillImageRepresentation[] = [];

        if (resource.properties[KnoraConstants.hasStillImageFileValue] !== undefined) { // TODO: check if resources is a StillImageRepresentation using the ontology responder (support for subclass relations required)
            // resource has StillImageFileValues that are directly attached to it (properties)

            const fileValues: ReadStillImageFileValue[] = resource.properties[KnoraConstants.hasStillImageFileValue] as ReadStillImageFileValue[];
            const imagesToDisplay: ReadStillImageFileValue[] = fileValues.filter((image) => {
                return !image.isPreview;
            });


            for (const img of imagesToDisplay) {

                const regions: ImageRegion[] = [];
                for (const incomingRegion of resource.incomingRegions) {

                    const region = new ImageRegion(incomingRegion);

                    regions.push(region);

                }

                const stillImage = new StillImageRepresentation(img, regions);
                imgRepresentations.push(stillImage);

            }


        } else if (resource.incomingStillImageRepresentations.length > 0) {
            // there are StillImageRepresentations pointing to this resource (incoming)

            const readStillImageFileValues: ReadStillImageFileValue[] = resource.incomingStillImageRepresentations.map(
                (stillImageRes: ReadResource) => {
                    const fileValues = stillImageRes.properties[KnoraConstants.hasStillImageFileValue] as ReadStillImageFileValue[]; // TODO: check if resources is a StillImageRepresentation using the ontology responder (support for subclass relations required)
                    const imagesToDisplay = fileValues.filter((image) => {
                        return !image.isPreview;
                    });

                    return imagesToDisplay;
                }
            ).reduce(function (prev, curr) {
                // transform ReadStillImageFileValue[][] to ReadStillImageFileValue[]
                return prev.concat(curr);
            });

            for (const img of readStillImageFileValues) {

                const regions: ImageRegion[] = [];
                for (const incomingRegion of resource.incomingRegions) {

                    const region = new ImageRegion(incomingRegion);
                    regions.push(region);

                }

                const stillImage = new StillImageRepresentation(img, regions);
                imgRepresentations.push(stillImage);
            }

        }

        resource.stillImageRepresentationsToDisplay = imgRepresentations;
    }

    /**
     * Gets the link value properties pointing from the incoming resource to [[this.resource]].
     *
     * @param incomingResource the incoming resource.
     * @returns a string containing all the labels of the link value properties.
     */
    getIncomingPropertiesFromIncomingResource(incomingResource: ReadResource) {

        const incomingProperties = [];

        // collect properties, if any
        if (incomingResource.properties !== undefined) {
            // get property Iris (keys)
            const propIris = Object.keys(incomingResource.properties);

            // iterate over the property Iris
            for (const propIri of propIris) {

                // get the values for the current property Iri
                const propVals: Array<ReadPropertyItem> = incomingResource.properties[propIri];

                for (const propVal of propVals) {
                    // add the property if it is a link value property pointing to [[this.resource]]
                    if (propVal.type === KnoraConstants.LinkValue) {
                        const linkVal = propVal as ReadLinkValue;

                        if (linkVal.referredResourceIri === this.resource.id) {
                            incomingProperties.push(propIri);
                        }

                    }
                }
            }
        }

        // eliminate duplicate Iris and transform to labels
        const propLabels = incomingProperties.filter(Utils.filterOutDuplicates).map(
            (propIri) => {
                return this.ontologyInfo.getLabelForProperty(propIri);
            }
        );

        // generate a string separating labels by a comma
        return `(${propLabels.join(', ')})`;

    }

}
