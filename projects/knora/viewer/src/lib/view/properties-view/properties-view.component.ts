import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Constants, IHasProperty, IResourceClassAndPropertyDefinitions, ReadResource, ReadValue, ResourcePropertyDefinition } from '@knora/api';
// import { KnoraConstants } from '@knora/core';
import { PropertyDefinition } from '@knora/api/src/models/v2/ontologies/property-definition';

export interface TempProp {
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

    loading: boolean = true;

    KnoraConstants = Constants;

    propArray: TempProp[] = [];

    // @Input() guiOrder?: GuiOrder;

    @Input() resource: ReadResource;




    // @Input() classType: string;

    // @Input() entityInfo: IResourceClassAndPropertyDefinitions;

    // @Input() properties: {
    //     [index: string]: ReadValue[];
    // };

    @Input() annotations?: ReadResource[];
    @Input() incomingLinks?: ReadResource[];

    // @Output() routeChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor(

        protected _router: Router) {

    }

    ngOnInit() {


        // HACK (until gui order is ready): convert properties object into array


        // console.log(Object.keys(this.properties));

        // this.propArray = Object.keys(this.properties);

        const hasProps: IHasProperty[] = this.resource.entityInfo.classes[this.resource.type].propertiesList;

        console.log('hasProps', hasProps);

        // this.propArray = Object.keys(this.properties).map(function (index) {
        //     console.log('index', index);

        //     const hasProp = hasProps.find(i => i.propertyIndex === index);







        //     // console.log(this.entityInfo.classes[this.classType].propertiesList.find((item: IHasProperty) => item.propertyIndex === index));
        //     return hasProp;
        // });

        // console.log(this.propArray);

        let i = 0;
        for (const hasProp of hasProps) {


            const index = hasProp.propertyIndex;

            if (this.resource.entityInfo.properties[index] && this.resource.entityInfo.properties[index] instanceof ResourcePropertyDefinition) {
                const tempProp: TempProp = {
                    guiDef: hasProp,
                    propDef: this.resource.entityInfo.properties[index],
                    values: this.resource.properties[index]
                };

                this.propArray.push(tempProp);
            }



            // console.log(Object.values());

            // entitiy info classes propertylist
            // console.log(this.entityInfo.classes[this.classType].propertiesList.find(i => i.propertyIndex === pid));


            //     console.log(prop);
            //     //this.entityInfo.classes[0].propertiesList[prop]);
            i++;
        }

        console.log(this.propArray);


        // console.log(this.entityInfo.classes[this.classType].propertiesList);

        /*
        this.propArray = Object.keys(this.properties).map(function (index) {
            console.log(index, this.properties[index]);
            const prop = this.resource.properties[index];
            console.log(prop);
            return prop;
        });

        console.log(this.propArray);

        /*
        if (this.resource.properties) {
            // set props in the correct gui order


            this.propArray = Object.keys(this.resource.properties).map(function (index) {
                const prop = this.resource.properties[index];
                console.log(prop);
                return prop;
            });
            console.log(this.propArray);
        } */
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

}
