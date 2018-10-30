import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DateValue } from '@knora/core';

@Component({
    selector: 'app-properties',
    templateUrl: './properties.component.html',
    styleUrls: ['./properties.component.scss']
})
export class PropertiesComponent implements OnInit {

    property: any = {
        colorVal: {
            colorHex: '#f06a33'
        }
    };

    propDate: DateValue[] = [
        {
            calendar: 'JULIAN',
            endDay: 3,
            endEra: 'CE',
            endMonth: 1,
            endYear: 1732,
            id: 'http://rdfh.ch/0801/-PlaC5rTSdC1Tf0WCcYwZQ/values/ZGH6YmfFRSiW_yMVlwF0Ug',
            propIri: 'http://0.0.0.0:3333/ontology/0801/beol/v2#creationDate',
            separator: '-',
            startDay: 3,
            startEra: 'CE',
            startMonth: 1,
            startYear: 1732,
            type: 'http://api.knora.org/ontology/knora-api/v2#DateValue'
        }
    ];

    partOf: any;

    constructor(private _route: ActivatedRoute) {
        this._route.data
            .subscribe(
                (mod: any) => {
                    this.partOf = mod.partOf;
                }
            );
    }

    ngOnInit() {
    }

}
