import { Component, EventEmitter, Inject, Input, OnInit, Output } from '@angular/core';
import { OntologyMetadata } from '@knora/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'kui-select-ontology',
  templateUrl: './select-ontology.component.html',
  styleUrls: ['./select-ontology.component.scss', '../../assets/style/search.scss']
})
export class SelectOntologyComponent implements OnInit {

  @Input() formGroup: FormGroup;

  @Input() ontologies: Array<OntologyMetadata>;

  @Output() ontologySelected = new EventEmitter<string>();

  form: FormGroup;

  constructor(@Inject(FormBuilder) private fb: FormBuilder) { }

  ngOnInit() {

    // build a form for the named graph selection
    this.form = this.fb.group({
      ontology: [null, Validators.required]
    });

    // emit Iri of the ontology when being selected
    this.form.valueChanges.subscribe((data) => {
      this.ontologySelected.emit(data.ontology);
    });

    // add form to the parent form group
    this.formGroup.addControl('ontology', this.form);

  }

}
