import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    ApiServiceError,
    GuiOrder,
    ImageRegion,
    IncomingService,
    KnoraConstants,
    OntologyInformation,
    ReadResource,
    ReadResourcesSequence,
    ReadStillImageFileValue,
    ResourceService,
    StillImageRepresentation
} from '@knora/core';

// import { ImageRegion, StillImageRepresentation } from '../../resource';

declare let require: any;
const jsonld = require('jsonld');

@Component({
    selector: 'kui-resource-view',
    templateUrl: './resource-view.component.html',
    styleUrls: ['./resource-view.component.scss']
})
export class ResourceViewComponent implements OnInit {

    @Input() iri?: string;

    sequence: ReadResourcesSequence;

    ontologyInfo: OntologyInformation;
    guiOrder: GuiOrder[];
    loading = true;
    error: any;
    KnoraConstants = KnoraConstants;

    // does the resource has a file representation (media file)?
    fileRepresentation: boolean;

    constructor(protected _route: ActivatedRoute,
        protected _router: Router,
        protected _resourceService: ResourceService,
        protected _incomingService: IncomingService
    ) {

    }

    ngOnInit() {
        this.loading = true;

        this.getResource(this.iri);

    }

    getResource(id: string) {
        this._resourceService.getReadResource(decodeURIComponent(id)).subscribe(
            (result: ReadResourcesSequence) => {
                this.sequence = result;

                this.ontologyInfo = result.ontologyInformation;

                const resType = this.sequence.resources[0].type;

                this.guiOrder = result.ontologyInformation.getResourceClasses()[resType].guiOrder;

                // collect images and regions
                this.collectImagesAndRegionsForResource(this.sequence.resources[0]);

                // get incoming resources
                this.requestIncomingResources();


                // this.fileRepresentation = this.sequence.resources[0].properties.indexOf(KnoraConstants.hasStillImageFileValue) > -1;
                // console.log(this.fileRepresentation);

                // wait until the resource is ready
                setTimeout(() => {
                    // console.log(this.sequence);
                    this.loading = false;
                }, 3000);
            },
            (error: ApiServiceError) => {
                console.error(error);
            }
        );
    }


    /**
     * Collect all file representations (stillImage, movingImage, audio etc.) and annotations (region, sequence etc.)
     *
     * @param resource
     */
    collectFileRepresentationsAndFileAnnotations(resource: ReadResource): void {
        const fileRepresentations: any[] = [];
    }


    collectImagesAndRegionsForResource(resource: ReadResource): void {

        const imgRepresentations: StillImageRepresentation[] = [];

        if (resource.properties[KnoraConstants.hasStillImageFileValue] !== undefined) {
            // TODO: check if resources is a StillImageRepresentation using the ontology responder (support for subclass relations required)
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
                    const fileValues = stillImageRes.properties[KnoraConstants.hasStillImageFileValue] as ReadStillImageFileValue[];
                    // TODO: check if resources is a StillImageRepresentation using the ontology responder (support for subclass relations required)
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

    requestIncomingResources(): void {

        // make sure that this.sequence has been initialized correctly
        if (this.sequence === undefined) {
            return;
        }

        // request incoming regions
        if (this.sequence.resources[0].properties[KnoraConstants.hasStillImageFileValue]) {
            // TODO: check if resources is a StillImageRepresentation using the ontology responder (support for subclass relations required)
            // the resource is a StillImageRepresentation, check if there are regions pointing to it

            this.getIncomingRegions(0);

        } else {
            // this resource is not a StillImageRepresentation
            // check if there are StillImageRepresentations pointing to this resource

            // this gets the first page of incoming StillImageRepresentations
            // more pages may be requested by [[this.viewer]].
            // TODO: for now, we begin with offset 0. This may have to be changed later (beginning somewhere in a collection)
            // this.getIncomingStillImageRepresentations(0);
        }

        // check for incoming links for the current resource
        this.getIncomingLinks(0);


    }

    getIncomingRegions(offset: number, callback?: (numberOfResources: number) => void): void {
        this._incomingService.getIncomingRegions(this.sequence.resources[0].id, offset).subscribe(
            (regions: ReadResourcesSequence) => {
                // update ontology information
                this.ontologyInfo.updateOntologyInformation(regions.ontologyInformation);

                // Append elements of regions.resources to resource.incoming
                Array.prototype.push.apply(this.sequence.resources[0].incomingRegions, regions.resources);

                // prepare regions to be displayed
                this.collectImagesAndRegionsForResource(this.sequence.resources[0]);

                // TODO: implement osdViewer
                /* if (this.osdViewer) {
                  this.osdViewer.updateRegions();
                } */

                // if callback is given, execute function with the amount of new images as the parameter
                if (callback !== undefined) {
                    callback(regions.resources.length);
                }
            },
            (error: any) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    getIncomingLinks(offset: number, callback?: (numberOfResources: number) => void): void {

        this.loading = true;

        this._incomingService.getIncomingLinksForResource(this.sequence.resources[0].id, offset).subscribe(
            (incomingResources: ReadResourcesSequence) => {
                // update ontology information
                this.ontologyInfo.updateOntologyInformation(incomingResources.ontologyInformation);

                // Append elements incomingResources to this.sequence.incomingLinks
                Array.prototype.push.apply(this.sequence.resources[0].incomingLinks, incomingResources.resources);

                // if callback is given, execute function with the amount of incoming resources as the parameter
                if (callback !== undefined) {
                    callback(incomingResources.resources.length);
                }

                this.loading = false;
            },
            (error: any) => {
                console.error(error);
                this.loading = false;
            }
        );
    }

    openLink(id: string) {

        this.loading = true;
        this._router.navigate(['/resource/' + encodeURIComponent(id)]);

    }

}
