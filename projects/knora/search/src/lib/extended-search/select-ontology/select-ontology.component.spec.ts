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
import { KuiCoreConfig } from '../../../../../core/src/lib/declarations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { OntologyMetadata } from '../../../../../core/src/lib/services';

fdescribe('SelectOntologyComponent', () => {
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
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    },
                },
                {provide: 'config', useValue: KuiCoreConfig},
                FormBuilder]
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
        expect(testHostComponent.selectOntologies).toBeTruthy();
    });

});

/**
 * Test host component to simulate `ExtendedSearchComponent`.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-select-ontology #ontologies [formGroup]="form" [ontologies]="ontologies"></kui-select-ontology>`
})
class TestHostComponent implements OnInit {

    form;

    ontologies: Array<OntologyMetadata> = [];

    @ViewChild('ontologies') selectOntologies: SelectOntologyComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
    }

}
