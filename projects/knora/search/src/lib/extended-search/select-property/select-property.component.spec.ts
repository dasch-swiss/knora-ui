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

import { SelectPropertyComponent } from './select-property.component';
import { SpecifyPropertyValueComponent } from './specify-property-value/specify-property-value.component';
import { ActivatedRoute } from '@angular/router';
import {
    Cardinality,
    CardinalityOccurrence,
    KuiCoreConfig,
    KuiCoreConfigToken,
    Properties,
    Property,
    ResourceClass,
    GuiOrder
} from '@knora/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, DebugElement, Inject, OnInit, ViewChild } from '@angular/core';
import { IntegerValueComponent } from './specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from './specify-property-value/link-value/link-value.component';
import { BooleanValueComponent } from './specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from './specify-property-value/date-value/date-value.component';
import { TextValueComponent } from './specify-property-value/text-value/text-value.component';
import { JdnDatepickerDirective } from '@knora/action';
import { DecimalValueComponent } from './specify-property-value/decimal-value/decimal-value.component';
import { UriValueComponent } from './specify-property-value/uri-value/uri-value.component';
import { By } from '@angular/platform-browser';

describe('SelectPropertyComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SelectPropertyComponent,
                SpecifyPropertyValueComponent,
                BooleanValueComponent,
                DateValueComponent,
                DecimalValueComponent,
                IntegerValueComponent,
                LinkValueComponent,
                TextValueComponent,
                UriValueComponent,
                JdnDatepickerDirective,
                TestHostComponent
            ],
            imports: [
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
        expect(testHostComponent.selectPropertyComp).toBeTruthy();
    });

    it('should initialize the ontologies', () => {
        // access the test host component's child
        expect(testHostComponent.selectPropertyComp).toBeTruthy();

        const selectPropCompInstance = testHostComponent.selectPropertyComp;

        expect(selectPropCompInstance.properties).toEqual(initProps);

        expect(selectPropCompInstance.propertiesAsArray).toEqual(
            [
                initProps['http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething'],
                initProps['http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger'],
                initProps['http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'],
            ]);

        expect(testHostComponent.selectPropertyComp.specifyPropertyValue).toBeUndefined();
    });

    it('should create the selection for the properties', () => {

        // access the test host component's child
        expect(testHostComponent.selectPropertyComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selProps = hostCompDe.query(By.directive(SelectPropertyComponent));

        const matSelect = selProps.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        // make sure that there are two mat-option (one for no selection)
        expect(options.length).toEqual(3);

        expect(testHostComponent.selectPropertyComp.specifyPropertyValue).toBeUndefined();
    });

    it('should select a property', () => {

        // access the test host component's child
        expect(testHostComponent.selectPropertyComp).toBeTruthy();

        expect(testHostComponent.selectPropertyComp.specifyPropertyValue).toBeUndefined();

        const hostCompDe = testHostFixture.debugElement;

        const selProps = hostCompDe.query(By.directive(SelectPropertyComponent));

        const matSelect = selProps.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        (options[2].nativeElement as HTMLElement).click();

        testHostFixture.detectChanges();

        expect(testHostComponent.selectPropertyComp.propertySelected).toEqual(initProps['http://0.0.0.0:3333/ontology/0001/anything/v2#hasText']);

        expect(testHostComponent.selectPropertyComp.specifyPropertyValue).toBeTruthy();

        // no resource class selected yet
        expect(testHostComponent.selectPropertyComp.sortCriterion()).toBeFalsy();


        const activeResClass = new ResourceClass(
            'http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing',
            'blueting.png',
            'A blue thing.',
            'blue thing',
            [
                new Cardinality(
                    CardinalityOccurrence.card,
                    1,
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
                    'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue'
                ),
                new Cardinality(
                    CardinalityOccurrence.card,
                    1,
                    'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue'
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
            ],
            [
                new GuiOrder(
                    2,
                    'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText'
                ),
            ]
        );

        testHostComponent.activeResourceCass = activeResClass;

        testHostFixture.detectChanges();

        // active resource class has cardinality one for selected property
        expect(testHostComponent.selectPropertyComp.sortCriterion()).toBeTruthy();

        const checkbox = selProps.query(By.css('mat-checkbox'));

        // there should be a checkbox in the template
        expect(checkbox).toBeTruthy();
    });

});

/**
 * Test host component to simulate `ExtendedSearchComponent`.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-select-property #props [formGroup]="form" [properties]="properties"
                             [activeResourceClass]="activeResourceCass"></kui-select-property>`
})
class TestHostComponent implements OnInit {

    form;

    properties: Properties;

    activeResourceCass: ResourceClass;

    @ViewChild('props') selectPropertyComp: SelectPropertyComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        this.properties = initProps;
    }
}

// properties passed to `SelectPropertyComponent` from parent component
const initProps = {
    'http://api.knora.org/ontology/knora-api/v2#attachedToProject': new Property(
        'http://api.knora.org/ontology/knora-api/v2#attachedToProject',
        'http://api.knora.org/ontology/knora-api/v2#knoraProject',
        'Connects something to a project',
        'attached to project',
        [],
        false,
        false,
        false,
        []
    ),
    'http://api.knora.org/ontology/knora-api/v2#attachedToUser': new Property(
        'http://api.knora.org/ontology/knora-api/v2#attachedToUser',
        'http://api.knora.org/ontology/knora-api/v2#User',
        'Connects something to a user',
        'attached to user',
        [],
        false,
        false,
        false,
        []
    ),
    'http://api.knora.org/ontology/knora-api/v2#creationDate': new Property(
        'http://api.knora.org/ontology/knora-api/v2#creationDate',
        'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
        'Indicates when a resource was created',
        undefined,
        [],
        false,
        false,
        false,
        []
    ),
    'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue': new Property(
        'http://api.knora.org/ontology/knora-api/v2#hasIncomingLinkValue',
        'http://api.knora.org/ontology/knora-api/v2#LinkValue',
        'Indicates that this resource referred to by another resource',
        'has incoming link',
        ['http://api.knora.org/ontology/knora-api/v2#hasLinkToValue'],
        false,
        false,
        true,
        []
    ),
    'http://api.knora.org/ontology/knora-api/v2#hasPermissions': new Property(
        'http://api.knora.org/ontology/knora-api/v2#hasPermissions',
        'http://www.w3.org/2001/XMLSchema#string',
        undefined,
        undefined,
        [],
        false,
        false,
        false,
        []
    ),
    'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo': new Property(
        'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkTo',
        'http://api.knora.org/ontology/knora-api/v2#Resource',
        'Represents a link in standoff markup from one resource to another.',
        'has Standoff Link to',
        ['http://api.knora.org/ontology/knora-api/v2#hasLinkTo'],
        false,
        true,
        false,
        []
    ),
    'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue': new Property(
        'http://api.knora.org/ontology/knora-api/v2#hasStandoffLinkToValue',
        'http://api.knora.org/ontology/knora-api/v2#LinkValue',
        'Represents a link in standoff markup from one resource to another.',
        'has Standoff Link to',
        ['http://api.knora.org/ontology/knora-api/v2#hasLinkToValue'],
        false,
        false,
        true,
        []
    ),
    'http://api.knora.org/ontology/knora-api/v2#lastModificationDate': new Property(
        'http://api.knora.org/ontology/knora-api/v2#lastModificationDate',
        'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
        undefined,
        undefined,
        [],
        false,
        false,
        false,
        []
    ),
    'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText': new Property(
        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText',
        'http://api.knora.org/ontology/knora-api/v2#TextValue',
        undefined,
        'Text',
        ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
        true,
        false,
        false,
        []
    ),
    'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger': new Property(
        'http://0.0.0.0:3333/ontology/0001/anything/v2#hasInteger',
        'http://api.knora.org/ontology/knora-api/v2#IntValue',
        undefined,
        'Integer',
        ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
        true,
        false,
        false,
        []
    ),
    'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething': new Property(
        'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomething',
        'http://0.0.0.0:3333/ontology/0001/something/v2#Something',
        'Has another something.',
        'has other something',
        ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThing'],
        true,
        true,
        false,
        []
    ),
    'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue': new Property(
        'http://0.0.0.0:3333/ontology/0001/something/v2#hasOtherSomethingValue',
        'http://api.knora.org/ontology/knora-api/v2#LinkValue',
        'Has another something.',
        'has other something',
        ['http://0.0.0.0:3333/ontology/0001/anything/v2#hasOtherThingValue'],
        true,
        false,
        true,
        []
    )
};
