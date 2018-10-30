import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
} from '@angular/material';
import { ResourceClass } from '@knora/core';

import { SelectResourceClassComponent } from './select-resource-class.component';
import { Component, DebugElement, Inject, OnInit, ViewChild } from '@angular/core';

import { Cardinality, CardinalityOccurrence } from '../../../../../core/src/lib/services';
import { ActivatedRoute } from '@angular/router';
import { KuiCoreConfig } from '../../../../../core/src/lib/declarations';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';

describe('SelectResourceClassComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SelectResourceClassComponent,
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
                {provide: 'config', useValue: KuiCoreConfig},
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
        expect(testHostComponent.selectResClassesComp).toBeTruthy();
    });

    it('should initialize the ontologies', () => {
        // access the test host component's child
        expect(testHostComponent.selectResClassesComp).toBeTruthy();

        const selectResClassCompInstance = testHostComponent.selectResClassesComp;

        expect(selectResClassCompInstance.resourceClasses).toEqual(initResClasses);

    });

    it('should create the selection for the resource classes', () => {

        // access the test host component's child
        expect(testHostComponent.selectResClassesComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selResClasses = hostCompDe.query(By.directive(SelectResourceClassComponent));

        const matSelect = selResClasses.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        // make sure that there are two mat-option (one for no selection)
        expect(options.length).toEqual(2);
    });

    it('should select a resource class', () => {

        // access the test host component's child
        expect(testHostComponent.selectResClassesComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selResClasses = hostCompDe.query(By.directive(SelectResourceClassComponent));

        const matSelect = selResClasses.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        (options[1].nativeElement as HTMLElement).click();

        testHostFixture.detectChanges();

        // make sure that the selected resource class's Iri was correctly emitted to the parent component
        expect(testHostComponent.selectedResClass).toEqual('http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing');
    });

    it('should select option "no selection"', () => {

        // access the test host component's child
        expect(testHostComponent.selectResClassesComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selResClasses = hostCompDe.query(By.directive(SelectResourceClassComponent));

        const matSelect = selResClasses.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        (options[0].nativeElement as HTMLElement).click();

        testHostFixture.detectChanges();

        // make sure that the "no selection" was correctly emitted to the parent component
        expect(testHostComponent.selectedResClass).toEqual(null);
    });

    it('should update the resource classes through the input', () => {

        testHostComponent.resClasses = updatedResClasses;

        testHostFixture.detectChanges();

        expect(testHostComponent.selectResClassesComp.resourceClasses).toEqual(updatedResClasses);

    });


});

/**
 * Test host component to simulate `ExtendedSearchComponent`.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-select-resource-class #resClass [formGroup]="form" [resourceClasses]="resClasses"
                                   (resourceClassSelectedEvent)="getPropertiesForResourceClass($event)"></kui-select-resource-class>`
})
class TestHostComponent implements OnInit {

    form;

    resClasses: Array<ResourceClass> = [];

    selectedResClass: string;

    @ViewChild('resClass') selectResClassesComp: SelectResourceClassComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    getPropertiesForResourceClass(resClassIri) {
        this.selectedResClass = resClassIri;
    }

    ngOnInit() {
        this.form = this.fb.group({});

        this.resClasses = initResClasses;
    }

}

// resource classes passed to `SelectResourceClass` from parent component
const initResClasses = [
    new ResourceClass(
        'http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing',
        'blueting.png',
        'A blue thing.',
        'blue thing',
        [
            new Cardinality(
                CardinalityOccurrence.minCard,
                0,
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#attachedToProject'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#creationDate'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#lastModificationDate'
            )
        ]
    )
];

const updatedResClasses = [
    new ResourceClass(
        'http://0.0.0.0:3333/ontology/0001/anything/v2#RedThing',
        'blueting.png',
        'A blue thing.',
        'blue thing',
        [
            new Cardinality(
                CardinalityOccurrence.minCard,
                0,
                'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#attachedToProject'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#creationDate'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasIncomingLink'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue'
            ),
            new Cardinality(
                CardinalityOccurrence.card,
                1,
                'http://api.knora.org/ontology/knora-api/v2#lastModificationDate'
            )
        ]
    )
];
