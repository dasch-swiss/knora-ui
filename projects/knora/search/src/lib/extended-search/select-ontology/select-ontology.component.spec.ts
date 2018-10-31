import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
} from '@angular/material';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SelectOntologyComponent } from './select-ontology.component';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { KuiCoreConfig, OntologyMetadata } from '@knora/core';
import { Component, DebugElement, Inject, OnInit, ViewChild } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('SelectOntologyComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SelectOntologyComponent,
                TestHostComponent
            ],
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatSelectModule,
                MatIconModule,
                MatCheckboxModule,
                MatDatepickerModule,
                MatAutocompleteModule,
                BrowserAnimationsModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    },
                },
                {
                    provide: 'config',
                    useValue: KuiCoreConfig
                },
                FormBuilder
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();

    });

    it('should create', () => {
        // access the test host component's child
        expect(testHostComponent.selectOntosComp).toBeTruthy();
    });

    it('should initialize the ontologies', () => {
        // access the test host component's child
        expect(testHostComponent.selectOntosComp).toBeTruthy();

        const selectOntologyCompInstance: SelectOntologyComponent = testHostComponent.selectOntosComp;

        const ontoMeta = [
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/anything/v2', 'The anything ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/something/v2', 'The something ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/00FF/images/v2', 'The images demo ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0801/beol/v2', 'The BEOL ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0802/biblio/v2', 'The Biblio ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0803/incunabula/v2', 'The incunabula ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0804/dokubib/v2', 'The dokubib ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/08AE/webern/v2', 'The Anton Webern project ontology'),
            new OntologyMetadata('http://api.knora.org/ontology/knora-api/v2', 'The knora-api ontology in the complex schema')
        ];

        expect(selectOntologyCompInstance.ontologies).toEqual(ontoMeta);

    });

    it('should create the selection for the ontologies', () => {

        // access the test host component's child
        expect(testHostComponent.selectOntosComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selOntos = hostCompDe.query(By.directive(SelectOntologyComponent));

        const matSelect = selOntos.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        // make sure that there are nine mat-option (one for each ontology)
        expect(options.length).toEqual(9);
    });

    it('should select the first ontology and emit its Iri', () => {

        // access the test host component's child
        expect(testHostComponent.selectOntosComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selOntos = hostCompDe.query(By.directive(SelectOntologyComponent));

        const matSelect = selOntos.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        (options[0].nativeElement as HTMLElement).click();

        testHostFixture.detectChanges();

        // make sure that the selected ontology's Iri was correctly emitted to the parent component
        expect(testHostComponent.selectedOnto).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2');

    });

});

/**
 * Test host component to simulate `ExtendedSearchComponent`.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-select-ontology #ontosComp [formGroup]="form" [ontologies]="ontos"
                             (ontologySelected)="ontoSelected($event)"></kui-select-ontology>`
})
class TestHostComponent implements OnInit {

    form;

    ontos: Array<OntologyMetadata> = [];

    selectedOnto: string;

    @ViewChild('ontosComp') selectOntosComp: SelectOntologyComponent;

    private ontoMeta = [
        new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/anything/v2', 'The anything ontology'),
        new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/something/v2', 'The something ontology'),
        new OntologyMetadata('http://0.0.0.0:3333/ontology/00FF/images/v2', 'The images demo ontology'),
        new OntologyMetadata('http://0.0.0.0:3333/ontology/0801/beol/v2', 'The BEOL ontology'),
        new OntologyMetadata('http://0.0.0.0:3333/ontology/0802/biblio/v2', 'The Biblio ontology'),
        new OntologyMetadata('http://0.0.0.0:3333/ontology/0803/incunabula/v2', 'The incunabula ontology'),
        new OntologyMetadata('http://0.0.0.0:3333/ontology/0804/dokubib/v2', 'The dokubib ontology'),
        new OntologyMetadata('http://0.0.0.0:3333/ontology/08AE/webern/v2', 'The Anton Webern project ontology'),
        new OntologyMetadata('http://api.knora.org/ontology/knora-api/v2', 'The knora-api ontology in the complex schema')
    ];

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ontoSelected(ontoIri) {
        this.selectedOnto = ontoIri;
    }

    ngOnInit() {
        this.form = this.fb.group({});

        this.ontos = this.ontoMeta;

    }

}
