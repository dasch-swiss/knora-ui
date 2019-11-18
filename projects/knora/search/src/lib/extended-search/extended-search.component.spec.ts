import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { JdnDatepickerDirective } from '@knora/action';
import { Cardinality, CardinalityOccurrence, GuiOrder, KuiCoreConfig, KuiCoreConfigToken, OntologyCacheService, OntologyInformation, OntologyMetadata, Property, ResourceClass, ResourceClasses, ResourceClassIrisForOntology } from '@knora/core';
import { of } from 'rxjs';
import { ExtendedSearchComponent } from './extended-search.component';
import { SelectOntologyComponent } from './select-ontology/select-ontology.component';
import { SelectPropertyComponent } from './select-property/select-property.component';
import { BooleanValueComponent } from './select-property/specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from './select-property/specify-property-value/date-value/date-value.component';
import { DecimalValueComponent } from './select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from './select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from './select-property/specify-property-value/link-value/link-value.component';
import { ListDisplayComponent } from './select-property/specify-property-value/list-value/list-display/list-display.component';
import { ListValueComponent } from './select-property/specify-property-value/list-value/list-value.component';
import { SpecifyPropertyValueComponent } from './select-property/specify-property-value/specify-property-value.component';
import { TextValueComponent } from './select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from './select-property/specify-property-value/uri-value/uri-value.component';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';
import { IntElementComponent } from '@knora/viewer';

describe('ExtendedSearchComponent', () => {

    let componentInstance: ExtendedSearchComponent;
    let fixture: ComponentFixture<ExtendedSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ExtendedSearchComponent,
                SelectOntologyComponent,
                SelectResourceClassComponent,
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
                ListValueComponent,
                ListDisplayComponent,
                IntElementComponent
            ],
            imports: [
                HttpClientTestingModule,
                ReactiveFormsModule,
                FormsModule,
                HttpClientModule,
                MatCheckboxModule,
                MatIconModule,
                MatFormFieldModule,
                MatMenuModule,
                MatSelectModule,
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
                    }
                },
                {
                    provide: KuiCoreConfigToken,
                    useValue: KuiCoreConfig
                },
                FormBuilder,
                OntologyCacheService,
                HttpClient,
                ExtendedSearchComponent
            ]
        })
            .compileComponents();

    }));

    beforeEach(inject([OntologyCacheService], (ontoCacheService) => {

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

        spyOn(ontoCacheService, 'getOntologiesMetadata').and.returnValue(of(ontoMeta));

        fixture = TestBed.createComponent(ExtendedSearchComponent);
        componentInstance = fixture.componentInstance;
        fixture.detectChanges();

    }));

    it('should create', () => {
        expect(componentInstance).toBeTruthy();
    });

    describe('Component init state', () => {

        it('should correctly initialized the ontologies\' metadata', async(() => {

            const expectedOntoMetata =
                [
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

            expect(componentInstance.ontologies).toEqual(expectedOntoMetata);

        }));

        it('should check that add properties is disabled after init', () => {

            const ele: DebugElement = fixture.debugElement;
            const addPropDe = ele.query(By.css('.add-property-button'));

            const addProp = addPropDe.nativeElement;

            expect(addProp.disabled).toBeTruthy();

        });

        it('should check that remove properties is disabled after init', () => {

            const ele: DebugElement = fixture.debugElement;
            const rmPropDe = ele.query(By.css('.remove-property-button'));

            const rmProp = rmPropDe.nativeElement;

            expect(rmProp.disabled).toBeTruthy();

        });

        it('should check that the submit button is disabled after init', () => {

            const ele: DebugElement = fixture.debugElement;
            const submitDe = ele.query(By.css('button[type="submit"]'));

            const submit = submitDe.nativeElement;

            expect(submit.disabled).toBeTruthy();

        });

        it('should check that the reset button is disabled after init', () => {

            const ele: DebugElement = fixture.debugElement;
            const resetDe = ele.query(By.css('button.reset'));

            const reset = resetDe.nativeElement;

            expect(reset.disabled).toBeTruthy();

        });

    });

    describe('Choose a specific ontology', () => {

        const resClassesForOnto: ResourceClassIrisForOntology = {
            'http://0.0.0.0:3333/ontology/0001/anything/v2': [
                'http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing'
            ]
        };

        const resClasses: ResourceClasses = {
            'http://0.0.0.0:3333/ontology/0001/anything/v2#BlueThing':
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
                )
        };

        const properties = {
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
                [])
        };

        const ontoInfo = new OntologyInformation(resClassesForOnto, resClasses, properties);

        beforeEach(inject([OntologyCacheService], (ontoCacheService) => {

            // choose the anything ontology

            spyOn(ontoCacheService, 'getEntityDefinitionsForOntologies').and.callFake((ontoIri: string) => {

                return of(ontoInfo);

            });

            componentInstance.getResourceClassesAndPropertiesForOntology('http://0.0.0.0:3333/ontology/0801/anything/v2');

            expect(componentInstance.activeResourceClass).toBeUndefined();

            expect(componentInstance.activeProperties).toEqual([]);

            expect(componentInstance.activeOntology).toEqual('http://0.0.0.0:3333/ontology/0801/anything/v2');

            expect(componentInstance.resourceClasses).toEqual(ontoInfo.getResourceClassesAsArray());

            expect(componentInstance.properties).toEqual(ontoInfo.getProperties());

            fixture.detectChanges();

        }));

        it('should be able to add a property', () => {

            const ele: DebugElement = fixture.debugElement;
            const addPropDe = ele.query(By.css('.add-property-button'));

            const addProp = addPropDe.nativeElement;

            expect(addProp.disabled).toBeFalsy();


        });

        it('should add a property', () => {

            const ele: DebugElement = fixture.debugElement;
            const addPropDe = ele.query(By.css('.add-property-button'));

            const addProp: HTMLElement = addPropDe.nativeElement;

            addProp.click();

            fixture.detectChanges();

            expect(componentInstance.activeProperties.length).toEqual(1);

        });

        it('should remove a property', () => {

            const ele: DebugElement = fixture.debugElement;
            const addPropDe = ele.query(By.css('.add-property-button'));

            const addProp: HTMLElement = addPropDe.nativeElement;

            addProp.click();

            fixture.detectChanges();

            expect(componentInstance.activeProperties.length).toEqual(1);

            const rmPropDe = ele.query(By.css('.remove-property-button'));

            const rmProp = rmPropDe.nativeElement;

            expect(rmProp.disabled).toBeFalsy();

            rmProp.click();

            fixture.detectChanges();

            expect(componentInstance.activeProperties.length).toEqual(0);

        });

    });
});
