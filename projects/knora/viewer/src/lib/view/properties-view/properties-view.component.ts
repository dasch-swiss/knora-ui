import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IHasProperty, ReadResource, ReadValue, ResourcePropertyDefinition } from '@knora/api';
import { PropertyDefinition } from '@knora/api/src/models/v2/ontologies/property-definition';

import { FileRepresentation } from '..';

export interface TempProperty {
    guiDef: IHasProperty;
    propDef: PropertyDefinition;
    values: ReadValue[];
}

/**
 * Shows all metadata (properties) in the resource viewer
 *
 */
@Component({
    selector: 'kui-properties-view',
    templateUrl: './properties-view.component.html',
    styleUrls: ['./properties-view.component.scss']
})
export class PropertiesViewComponent implements OnInit {

    /**
     * Resource object
     *
     * @param  {ReadResource} resource
     */
    @Input() resource: ReadResource;

    /**
     * Show all properties, even they don't have a value.
     *
     * @param  {boolean=false} [allProps]
     */
    @Input() allProps?: boolean = false;

    /**
     * Show toolbar with project info and some action tools
     *
     * @param  {boolean=false} [toolbar]
     */
    @Input() toolbar?: boolean = false;

    loading: boolean = true;

    FileRepresentation = FileRepresentation;

    propArray: TempProperty[] = [];

    constructor(
        protected _router: Router) {
    }

    ngOnInit() {
        this.loading = true;

        // get list of all properties
        const hasProps: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;

        let i = 0;
        for (const hasProp of hasProps) {

            const index = hasProp.propertyIndex;

            // filter all properties by type ResourcePropertyDefinition and exclude hasFileRepresentations
            if (this.resource.entityInfo.properties[index] &&
                this.resource.entityInfo.properties[index] instanceof ResourcePropertyDefinition &&
                !this.FileRepresentation.list.includes(index)) {

                const tempProp: TempProperty = {
                    guiDef: hasProp,
                    propDef: this.resource.entityInfo.properties[index],
                    values: this.resource.properties[index]
                };

                this.propArray.push(tempProp);
            }

            i++;
        }

        // sort properties by guiOrder
        this.propArray.sort((a, b) => (a.guiDef.guiOrder > b.guiDef.guiOrder) ? 1 : -1);

        console.log(this.propArray);

        this.loading = false;

    }

    /**
     * Navigate to the incoming resource view.
     *
     * @param {string} id Incoming resource iri
     */
    openLink(id: string) {

        this.loading = true;
        // this.routeChanged.emit(id);
        this._router.navigate(['/resource/' + encodeURIComponent(id)]);

    }


    toggleProps(show: boolean) {
        this.allProps = !this.allProps;
    }

}
