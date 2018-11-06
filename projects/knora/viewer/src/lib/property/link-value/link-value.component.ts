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

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'kui-link-value',
    templateUrl: './link-value.component.html',
    styleUrls: ['./link-value.component.scss']
})
export class LinkValueComponent implements OnInit {

    @Input() valueObject?: ReadLinkValue;
    @Input() ontologyInfo?: OntologyInformation;


    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = KnoraConstants.LinkValue;

    form: FormGroup;

    resources: ReadResource[];

    private _restrictToResourceClass: string;

    @Input()
    set restrictResourceClass(value: string) {
        this._restrictToResourceClass = value;
    }

    constructor(@Inject(FormBuilder) private fb: FormBuilder,
        private _searchService: SearchService,
        private _cacheService: OntologyCacheService) {

    }

    /**
     * Displays a selected resource using its label.
     *
     * @param resource the resource to be displayed (or no selection yet).
     * @returns
     */
    displayResource(resource: ReadResource | null) {

        // null is the initial value (no selection yet)
        if (resource !== null) {
            return resource.label;
        }
    }

    /**
     * Search for resources whose labels contain the given search term, restricting to to the given properties object constraint.
     *
     * @param searchTerm
     */
    searchByLabel(searchTerm: string) {

        // at least 3 characters are required
        if (searchTerm.length >= 3) {

            this._searchService.searchByLabel(searchTerm, this._restrictToResourceClass).subscribe(
                (result: ApiServiceResult) => {
                    const promises = jsonld.promises;
                    // compact JSON-LD using an empty context: expands all Iris
                    const promise = promises.compact(result.body, {});

                    promise.then((compacted) => {

                        const resourceSeq: ReadResourcesSequence = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(compacted);

                        this.resources = resourceSeq.resources;


                    }, function (err) {

                        console.log('JSONLD of full resource request could not be expanded:' + err);
                    });

                }
            );
        } else {
            // clear selection
            this.resources = undefined;
        }

    }

    /**
     * Checks that the selection is a [[ReadResource]].
     *
     * Surprisingly, [null] has to be returned if the value is valid: https://angular.io/guide/form-validation#custom-validators
     *
     * @param c the form element whose value has to be checked.
     * @returns
     */
    validateResource(c: FormControl) {

        const isValidResource = (c.value instanceof ReadResource);

        if (isValidResource) {
            return null;
        } else {
            return {
                noResource: {
                    value: c.value
                }
            };
        }

    }

    ngOnInit() {
        this.form = this.fb.group({
            resource: [null, Validators.compose([
                Validators.required,
                this.validateResource
            ])]
        });

        this.form.valueChanges.subscribe((data) => {
            this.searchByLabel(data.resource);
        });

        resolvedPromise.then(() => {
            // add form to the parent form group
            // this.formGroup.addControl('propValue', this.form);
        });
    }

    /*  ngOnDestroy() {
 
         // remove form from the parent form group
         resolvedPromise.then(() => {
             this.formGroup.removeControl('propValue');
         });
 
     } */

    getValue(): Value {

        return new IRI(this.form.value.resource.id);
    }

    showReferredResourceInDialog() {
        // TODO: create ObjectDialogComponent

        // const config: MatDialogConfig = ResourceDialogComponent.createConfiguration(this.valueObject.referredResourceIri);
        //
        // this.dialog.open(ResourceDialogComponent, config);

    }

}
