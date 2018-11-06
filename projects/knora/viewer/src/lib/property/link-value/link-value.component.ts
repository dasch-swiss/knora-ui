import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogConfig } from '@angular/material';
import {
    ApiServiceResult,
    ConvertJSONLD,
    IRI,
    KnoraConstants,
    OntologyCacheService,
    OntologyInformation,
    ReadLinkValue,
    ReadResource,
    ReadResourcesSequence,
    SearchService,
    Value
} from '@knora/core';

@Component({
    selector: 'kui-link-value',
    templateUrl: './link-value.component.html',
    styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent implements OnInit {

    @Input() valueObject: ReadLinkValue;
    @Input() ontologyInfo?: OntologyInformation;

    referredResource: string;

    constructor() { }

    ngOnInit() {
        if (this.valueObject.referredResource !== undefined) {
            this.referredResource = this.valueObject.referredResource.label;
        } else {
            this.referredResource = this.valueObject.referredResourceIri;
        }

    }

}
