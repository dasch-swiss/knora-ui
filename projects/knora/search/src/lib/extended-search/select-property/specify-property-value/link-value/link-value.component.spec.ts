import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { IRI, KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule, SearchService } from '@knora/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { KnoraApiConfig, KnoraApiConnection, ReadResource } from '@knora/api';

import { LinkValueComponent } from './link-value.component';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `kui-host-component`,
    template: `
        <link-value #linkVal [formGroup]="form"
                    [restrictResourceClass]="'http://0.0.0.0:3333/ontology/0801/beol/v2#person'"></link-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('linkVal', { static: false }) linkValue: LinkValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}

describe('LinkValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    const config = new KnoraApiConfig('http', '0.0.0.0', 3333);

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
                RouterTestingModule.withRoutes([]),
                KuiCoreModule
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    },
                },
                {
                    provide: KnoraApiConfigToken,
                    useValue: config
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: new KnoraApiConnection(config)
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

    it('should search for resources by their label', inject([KnoraApiConnectionToken], (knoraApiConnection) => {

        spyOn(knoraApiConnection.v2.search, 'doSearchByLabel').and.callFake(
            (searchTerm) => {
                const res = new ReadResource();
                res.id = 'http://rdfh.ch/00505cf0a803';
                res.label = 'leo';
                return of([res]);
            }
        );

        testHostComponent.linkValue.searchByLabel('Leonhard Euler');

        testHostFixture.detectChanges();

        expect(testHostComponent.linkValue.resources.length).toEqual(1);

        expect(testHostComponent.linkValue.resources[0].id).toEqual('http://rdfh.ch/00505cf0a803');
    }));

    it('should return a selected resource', () => {

        testHostComponent.linkValue.form.setValue({ 'resource': new ReadResource() });

        testHostFixture.detectChanges();

        expect(testHostComponent.linkValue.getValue()).toEqual(new IRI('http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ'));
    });
});
