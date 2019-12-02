import { Component, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KuiMessageData } from '@knora/action';
import { ApiResponseError, Constants, IHasProperty, KnoraApiConnection, ReadResource, ReadStillImageFileValue, ResourcePropertyDefinition, ReadValue } from '@knora/api';
import { PropertyDefinition } from '@knora/api/src/models/v2/ontologies/property-definition';
import { GuiOrder, KnoraApiConnectionToken, OntologyInformation, ResourcesSequence } from '@knora/core';

import { StillImageComponent } from '../../resource';

// object of property information from ontology class, properties and property values
export interface TempProperty {
    guiDef: IHasProperty;
    propDef: PropertyDefinition;
    values: ReadValue[];
}

// list of file value iris; TODO: not yet well done. It should be defined in global knora constants in knora-api-js-lib
export class FileRepresentation {
    static list: string[] = [
        Constants.KnoraApiV2 + Constants.Delimiter + 'hasAudioFileValue',
        Constants.KnoraApiV2 + Constants.Delimiter + 'hasDDDFileValue',
        Constants.KnoraApiV2 + Constants.Delimiter + 'hasMovingImageFileValue',
        Constants.KnoraApiV2 + Constants.Delimiter + 'hasStillImageFileValue',
        Constants.KnoraApiV2 + Constants.Delimiter + 'hasTextFileValue'
    ];
}
// import { Region, StillImageRepresentation } from '../../resource';

declare let require: any;
const jsonld = require('jsonld');

@Component({
    selector: 'kui-resource-view',
    templateUrl: './resource-view.component.html',
    styleUrls: ['./resource-view.component.scss']
})
export class ResourceViewComponent implements OnInit, OnChanges {

    /**
     * Resource iri
     *
     * @param {string} [iri] Resource iri
     */
    @Input() iri?: string;

    /**
     * Show all properties, even they don't have a value.
     *
     * @param  {boolean} [allProps]
     */
    @Input() allProps?: boolean = false;

    /**
     * Show toolbar with project info and some action tools on top of properties if true.
     *
     * @param  {boolean} [toolbar]
     */
    @Input() toolbar?: boolean = false;


    // TODO: needs probably general fileRepresentation container to watch on
    @ViewChild('kuiStillImage', { static: false }) kuiStillImage: StillImageComponent;

    loading: boolean;

    resource: ReadResource;

    // current resource displayed in case of compound object
    activeResource: ReadResource;

    propArray: TempProperty[] = [];

    // does the resource has a file representation (media file)?
    fileRepresentation: ReadValue[]; // TODO: expand with following types: | ReadMovingImageFileValue | ReadAudioFileValue | ReadDocumentFileValue | ReadTextFileValue;

    Constants = Constants;

    // TODO: clean up following unused variables
    ontologyInfo: OntologyInformation;
    sequence: ResourcesSequence;
    guiOrder: GuiOrder[];
    error: KuiMessageData;

    constructor(
        @Inject(KnoraApiConnectionToken) private knoraApiConnection: KnoraApiConnection,
        protected _route: ActivatedRoute,
        protected _router: Router
    ) {

    }

    ngOnInit() {
        // this.getResource(this.iri);
    }

    ngOnChanges() {
        this.getResource(this.iri);

        // console.log(this.kuiStillImage.k;
    }

    /**
     * Get a read resource sequence with ontology information and incoming resources.
     *
     * @param {string} id Resource iri
     */
    getResource(id: string) {
        this.loading = true;
        this.error = undefined;

        this.knoraApiConnection.v2.res.getResource(id).subscribe(
            (response: ReadResource) => {
                this.resource = response;
                console.log(response);

                // get list of all properties
                const hasProps: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;

                let i = 0;
                for (const hasProp of hasProps) {

                    const index = hasProp.propertyIndex;



                    if (FileRepresentation.list.includes(index)) {
                        // property value is of type hasFileRepresentations
                        this.fileRepresentation = this.resource.properties[index];
                    } else {
                        // filter all properties by type ResourcePropertyDefinition
                        if (this.resource.entityInfo.properties[index] &&
                            this.resource.entityInfo.properties[index] instanceof ResourcePropertyDefinition) {

                            const tempProp: TempProperty = {
                                guiDef: hasProp,
                                propDef: this.resource.entityInfo.properties[index],
                                values: this.resource.properties[index]
                            };

                            this.propArray.push(tempProp);
                        }
                    }

                    i++;
                }

                // sort properties by guiOrder
                this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

                console.log(this.propArray);

                // TODO: get info about file representation to load corresponding media view



                this.loading = false;
                // setTimeout(() => {
                // });
            },
            (error: ApiResponseError) => {
                console.error(error);
                this.loading = false;
            }
        );

    }


    /**
     * Get incoming links for a resource.
     *
     * @param offset
     * @param callback
     */
    // getIncomingLinks(offset: number, callback?: (numberOfResources: number) => void): void {

    //     this.loading = true;

    //     this._incomingService.getIncomingLinksForResource(this.sequence.resources[0].id, offset).subscribe(
    //         (incomingResources: ReadResourcesSequence) => {
    //             // update ontology information
    //             this.ontologyInfo.updateOntologyInformation(incomingResources.ontologyInformation);

    //             // Append elements incomingResources to this.sequence.incomingLinks
    //             Array.prototype.push.apply(this.sequence.resources[0].incomingLinks, incomingResources.resources);

    //             // if callback is given, execute function with the amount of incoming resources as the parameter
    //             if (callback !== undefined) {
    //                 callback(incomingResources.resources.length);
    //             }

    //             this.loading = false;
    //         },
    //         (error: any) => {
    //             console.error(error);
    //             this.loading = false;
    //         }
    //     );
    // }

    openLink(id: string) {

        this.loading = true;
        // this.routeChanged.emit(id);
        this._router.navigate(['/resource/' + encodeURIComponent(id)]);

    }

    refreshProperties(index: number) {
        // console.log('from still-image-component: ', index);

        // TODO: commented for knora-api-js-lib:
        // this.currentResource = this.sequence.resources[0].incomingFileRepresentations[index];

    }


    toggleProps(show: boolean) {
        this.allProps = !this.allProps;
    }
}
