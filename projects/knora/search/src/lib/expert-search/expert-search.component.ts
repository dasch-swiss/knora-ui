import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ExtendedSearchParams, KuiCoreConfigToken, SearchParamsService, SearchService } from '@knora/core';

@Component({
    selector: 'kui-expert-search',
    templateUrl: './expert-search.component.html',
    styleUrls: ['./expert-search.component.scss', '../assets/style/search.scss']
})
export class ExpertSearchComponent implements OnInit {

    /**
     * @param  {string} route Route to navigate after search. This route path should contain a component for search results.
     */
    @Input() route?;

    /**
     * @param gravsearch Send the gravsearch query back.
     */
    @Output() gravsearch = new EventEmitter<string>();


    /**
     * @param  {boolean} toggleExtendedSearchForm Trigger toggle for extended search form.
     */
    @Output() toggleExpertSearchForm = new EventEmitter<boolean>();

    expertSearchForm: FormGroup;

    constructor (
        private fb: FormBuilder,
        private _route: ActivatedRoute,
        private _router: Router,
        private _searchService: SearchService,
        private _searchParamsService: SearchParamsService,
        @Inject(KuiCoreConfigToken) public config
    ) { }

    ngOnInit() {
        this.initForm();
    }

    /**
     * @ignore
     * Initiate the form with predefined Gravsearch query as example.
     */
    private initForm() {
        this.expertSearchForm = this.fb.group({
            gravquery: [
                `
PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
PREFIX incunabula: <${this.config.api}/ontology/0803/incunabula/simple/v2#>

CONSTRUCT {
    ?book knora-api:isMainResource true .
    ?book incunabula:title ?title .

} WHERE {
    ?book a incunabula:book .
    ?book incunabula:title ?title .
}
`,
                Validators.required
            ]
        });
    }

    /**
     * @ignore
     * Send the gravsearch query to the result view, either through the route or by emitting the gravsearch as an output.
     */
    submitQuery() {
        const gravsearch = this.generateGravsearch(0);

        if (this.route) {
            this._router.navigate([this.route + '/extended/', gravsearch], { relativeTo: this._route });
        } else {
            this.gravsearch.emit(gravsearch);
        }

        // toggle expert search form
        this.toggleExpertSearchForm.emit(true);
    }

    /**
     * @ignore
     * Generate the whole gravsearch query matching the query given by the form.
     */
    private generateGravsearch(offset: number = 0): string {
        const queryTemplate = this.expertSearchForm.controls['gravquery'].value;

        // offset component of the Gravsearch query
        const offsetTemplate = `
         OFFSET ${offset}
         `;

        // function that generates the same Gravsearch query with the given offset
        const generateGravsearchWithCustomOffset = (
            localOffset: number
        ): string => {
            const offsetCustomTemplate = `
             OFFSET ${localOffset}
             `;

            return queryTemplate + offsetCustomTemplate;
        };

        if (offset === 0) {
            // store the function so another Gravsearch query can be created with an increased offset
            this._searchParamsService.changeSearchParamsMsg(
                new ExtendedSearchParams(generateGravsearchWithCustomOffset)
            );
        }
        return queryTemplate + offsetTemplate;
    }

    /**
     * @ignore
     * Reset the form to the initial state.
     */
    resetForm() {
        this.initForm();
    }
}
