import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IResourceClassAndPropertyDefinitions, ReadResource, ReadValue, ClassDefinition, IHasProperty } from '@knora/api';
import { GuiOrder, KnoraConstants } from '@knora/core';

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

    KnoraConstants = KnoraConstants;

    // @Input() guiOrder?: GuiOrder;

    @Input() classType: string;

    @Input() entityInfo: IResourceClassAndPropertyDefinitions;

    @Input() properties: {
        [index: string]: ReadValue[];
    };

    @Input() annotations?: ReadResource[];
    @Input() incomingLinks?: ReadResource[];

    propArray: any[] = [];

    // @Output() routeChanged: EventEmitter<string> = new EventEmitter<string>();

    constructor(protected _router: Router) {

    }

    ngOnInit() {
        // HACK (until gui order is ready): convert properties object into array


        // console.log(Object.keys(this.properties));

        // this.propArray = Object.keys(this.properties);

        const hasProps: IHasProperty[] = this.entityInfo.classes[this.classType].propertiesList;

        // console.log('hasProps', hasProps);

        this.propArray = Object.keys(this.properties).map(function (index) {
            console.log('index', index);

            const hasProp = hasProps.find(i => i.propertyIndex === index);



            // console.log(this.entityInfo.classes[this.classType].propertiesList.find((item: IHasProperty) => item.propertyIndex === index));
            return hasProp;
        });

        console.log(this.propArray);

        for (const pid of Object.keys(this.properties)) {
            // console.log('pid', pid);

            // console.log(Object.values());

            // entitiy info classes propertylist
            // console.log(this.entityInfo.classes[this.classType].propertiesList.find(i => i.propertyIndex === pid));


            //     console.log(prop);
            //     //this.entityInfo.classes[0].propertiesList[prop]);
        }


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
