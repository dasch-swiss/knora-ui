import { Component, Inject, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { KuiMessageData } from '@knora/action';
import { ApiResponseError, Constants, KnoraApiConnection, ReadResource } from '@knora/api';
import { GuiOrder, KnoraApiConnectionToken, OntologyInformation, ResourcesSequence } from '@knora/core';

import { StillImageComponent } from '../../resource';

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


    // if resource hasFileRepresentation: this would the iri
    hasFileRepresentation: string;

    // TODO: needs probably general fileRepresentation container to watch on
    @ViewChild('kuiStillImage', { static: false }) kuiStillImage: StillImageComponent;

    resource: ReadResource;


    sequence: ResourcesSequence;

    ontologyInfo: OntologyInformation;
    guiOrder: GuiOrder[];
    loading: boolean;
    error: KuiMessageData;

    // does the resource has a file representation (media file)?
    fileRepresentation: boolean;

    // current resource in case of compound object
    currentResource: ReadResource;

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

                // TODO: set properties in correct gui order to send to properties view

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
}
