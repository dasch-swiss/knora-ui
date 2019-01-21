import { Component, EventEmitter, Inject, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { OntologyMetadata } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'kui-select-ontology',
    templateUrl: './select-ontology.component.html',
    styleUrls: ['./select-ontology.component.scss']
})
export class SelectOntologyComponent implements OnInit, OnDestroy {

    @Input() formGroup: FormGroup;

    @Input() ontologies: Array<OntologyMetadata>;

    @Output() ontologySelected = new EventEmitter<string>();

    form: FormGroup;

    formSubscription: Subscription;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {

        // build a form for the named graph selection
        this.form = this.fb.group({
            ontology: [null, Validators.required]
        });

        // emit Iri of the ontology when being selected
        this.formSubscription = this.form.valueChanges.subscribe((data) => {
            this.ontologySelected.emit(data.ontology);
        });

        // add form to the parent form group
        this.formGroup.addControl('ontology', this.form);

    }

    ngOnDestroy() {

        if (this.formSubscription !== undefined) {
            this.formSubscription.unsubscribe();
        }
    }

}
