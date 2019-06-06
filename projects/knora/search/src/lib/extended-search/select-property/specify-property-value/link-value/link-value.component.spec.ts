import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { LinkValueComponent } from './link-value.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiServiceResult, IRI, KuiCoreConfig, KuiCoreConfigToken, ReadResource, SearchService } from '@knora/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ConvertJSONLD } from '@knora/core';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

describe('LinkValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LinkValueComponent,
                TestHostComponent
            ],
            imports: [
                HttpClientTestingModule,
                FormsModule,
                MatAutocompleteModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
                MatInputModule,
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
                    provide: KuiCoreConfigToken,
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
        expect(testHostComponent.linkValue).toBeTruthy();
    });

    it('should have the correct resource class restriction', () => {
        // access the test host component's child
        expect(testHostComponent.linkValue).toBeTruthy();

        expect(testHostComponent.linkValue.restrictResourceClass).toEqual('http://0.0.0.0:3333/ontology/0801/beol/v2#person');
    });

    it('should search for resources by their label', inject([SearchService], (searchService) => {
        const labelSearchRes = require('../../../../../../../core/src/lib/test-data/search/SearchResultNarr-expanded.json');
        const result = ConvertJSONLD.createReadResourcesSequenceFromJsonLD(labelSearchRes);

        spyOn(searchService, 'searchByLabelReadResourceSequence').and.callFake(() => of(result));

        testHostComponent.linkValue.searchByLabel('Leonhard Euler');

        testHostFixture.detectChanges();

        expect(searchService.searchByLabelReadResourceSequence).toHaveBeenCalledTimes(1);

        expect(searchService.searchByLabelReadResourceSequence).toHaveBeenCalledWith('Leonhard Euler', 0, { limitToResourceClass: 'http://0.0.0.0:3333/ontology/0801/beol/v2#person' });

        expect(testHostComponent.linkValue.resources.length).toEqual(25);

        expect(testHostComponent.linkValue.resources[0].id).toEqual('http://rdfh.ch/00505cf0a803');

        expect(testHostComponent.linkValue.resources[1].id).toEqual('http://rdfh.ch/00c650d23303');
    }));

    it('should return a selected resource', () => {

        testHostComponent.linkValue.form.setValue({ 'resource': new ReadResource('http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ', 'testtype', 'testlabel', [], [], [], [], {}) });

        testHostFixture.detectChanges();

        expect(testHostComponent.linkValue.getValue()).toEqual(new IRI('http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ'));
    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <link-value #linkVal [formGroup]="form"
                    [restrictResourceClass]="'http://0.0.0.0:3333/ontology/0801/beol/v2#person'"></link-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('linkVal') linkValue: LinkValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}
