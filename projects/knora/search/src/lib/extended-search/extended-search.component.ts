import { Component, EventEmitter, Inject, Input, OnInit, Output, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
    GravsearchGenerationService,
    OntologyCacheService,
    OntologyInformation,
    OntologyMetadata,
    Properties,
    PropertyWithValue,
    ReadResourcesSequence,
    ResourceClass
} from '@knora/core';
import { SelectPropertyComponent } from './select-property/select-property.component';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';

/**
 * The extended search allows you to filter by project, by source type (resource class), or by the metadata (properties) of source types. Each filter can be standalone or combined. The metadata field can be precisely filtered with criteria such as "contains", "like", "equals to", "exists" or in case of a date value with "before" or "after". In addition, for a metadata field that is connected to another source type, it's possible to filter by this second source type. If you are looking for the source type "Photograph" with the metadata field "Photographer", which is connected to source type "Person", you can search for photograph(s) taken by person(s) who is born before February 1970. The result of this request will be an intersection of the two source types.
 */
@Component({
    selector: 'kui-extended-search',
    templateUrl: './extended-search.component.html',
    styleUrls: ['./extended-search.component.scss']
})
export class ExtendedSearchComponent implements OnInit {

    /**
     * Route to navigate after search. This route path should contain a component for search results.
     *
     * @param  {string} route
     */
    @Input() route?;

    /**
     * Trigger toggle for extended search form.
     *
     * @param  {boolean} toggleExtendedSearchForm
     */
    @Output() toggleExtendedSearchForm = new EventEmitter<boolean>();

    /**
     * Send the gravsearch query back.
     *
     * @param  {string} gravsearch
     */
    @Output() gravsearch = new EventEmitter<string>();

    // all available ontologies
    ontologies: Array<OntologyMetadata> = [];

    // ontology chosen by the user
    activeOntology: string;

    // properties specified by the user
    activeProperties: boolean[] = [];

    // resource classes for the selected ontology
    resourceClasses: Array<ResourceClass> = [];

    // definition of the selected resource class, if set.
    activeResourceClass: ResourceClass;

    // properties for the selected ontology or selected resource class
    properties: Properties;

    result: ReadResourcesSequence = new ReadResourcesSequence([], 0);

    // reference to the component that controls the resource class selection
    @ViewChild('resourceClass') resourceClassComponent: SelectResourceClassComponent;

    // reference to the component controlling the property selection
    @ViewChildren('property') propertyComponents: QueryList<SelectPropertyComponent>;

    // FormGroup (used as parent for child components)
    form: FormGroup;

    // form validation status
    formValid = false;

    constructor(@Inject(FormBuilder) private fb: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _cacheService: OntologyCacheService,
        private _gravSearchService: GravsearchGenerationService) {
    }

    ngOnInit() {

        // parent form is empty, it gets passed to the child components
        this.form = this.fb.group({});

        // if form status changes, re-run validation
        this.form.statusChanges.subscribe((data) => {
            this.formValid = this.validateForm();
            // console.log(this.form);
        });

        // initialize ontologies to be used for the ontologies selection in the search form
        this.initializeOntologies();
    }

    /**
     * @ignore
     * Add a property to the search form.
     * @returns void
     */
    addProperty(): void {
        this.activeProperties.push(true);
    }

    /**
     * @ignore
     * Remove the last property from the search form.
     * @returns void
     */
    removeProperty(): void {
        this.activeProperties.splice(-1, 1);
    }

    /**
     * @ignore
     * Gets all available ontologies for the search form.
     * @returns void
     */
    initializeOntologies(): void {
        this._cacheService.getOntologiesMetadata().subscribe(
            (ontologies: Array<OntologyMetadata>) => {
                this.ontologies = ontologies;
            });
    }

    /**
     * @ignore
     * Once an ontology has been selected, gets its classes and properties.
     * The classes and properties will be made available to the user for selection.
     *
     * @param ontologyIri Iri of the ontology chosen by the user.
     * @returns void
     */
    getResourceClassesAndPropertiesForOntology(ontologyIri: string): void {

        // reset active resource class definition
        this.activeResourceClass = undefined;

        // reset specified properties
        this.activeProperties = [];

        this.activeOntology = ontologyIri;

        this._cacheService.getEntityDefinitionsForOntologies([ontologyIri]).subscribe(
            (ontoInfo: OntologyInformation) => {

                this.resourceClasses = ontoInfo.getResourceClassesAsArray(true);
                this.properties = ontoInfo.getProperties();

            }
        );

    }

    /**
     * @ignore
     * Once a resource class has been selected, gets its properties.
     * The properties will be made available to the user for selection.
     *
     * @param resourceClassIri
     * @returns void
     */
    getPropertiesForResourceClass(resourceClassIri: string): void {

        // reset specified properties
        this.activeProperties = [];

        // if the client undoes the selection of a resource class, use the active ontology as a fallback
        if (resourceClassIri === null) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        } else {

            this._cacheService.getResourceClassDefinitions([resourceClassIri]).subscribe(
                (ontoInfo: OntologyInformation) => {
                    this.properties = ontoInfo.getProperties();

                    this.activeResourceClass = ontoInfo.getResourceClasses()[resourceClassIri];

                }
            );

        }

    }

    /**
     * @ignore
     * Validates form and returns its status (boolean).
     */
    private validateForm() {

        // check that either a resource class is selected or at least one property is specified
        return this.form.valid &&
            (this.propertyComponents.length > 0 || (this.resourceClassComponent !== undefined && this.resourceClassComponent.getResourceClassSelected() !== false));

    }

    /**
     * @ignore
     * Resets the form (selected resource class and specified properties) preserving the active ontology.
     */
    resetForm() {
        if (this.activeOntology !== undefined) {
            this.getResourceClassesAndPropertiesForOntology(this.activeOntology);
        }
    }


    /**
     * @ignore
     * Creates a GravSearch query with the given form values and calls the extended search route.
     */
    submit() {

        if (!this.formValid) return; // check that from is valid

        const resClassOption = this.resourceClassComponent.getResourceClassSelected();

        let resClass;

        if (resClassOption !== false) {
            resClass = resClassOption;
        }

        const properties: PropertyWithValue[] = this.propertyComponents.map(
            (propComp) => {
                return propComp.getPropertySelectedWithValue();
            }
        );

        const gravsearch = this._gravSearchService.createGravsearchQuery(properties, resClass, 0);

        if (this.route) {
            this._router.navigate([this.route + '/extended/', gravsearch], { relativeTo: this._route });
        } else {
            this.gravsearch.emit(gravsearch);
        }


        // toggle extended search form
        this.toggleExtendedSearchForm.emit(true);

    }

}
