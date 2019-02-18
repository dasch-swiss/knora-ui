import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
} from '@angular/material';

import { SpecifyPropertyValueComponent } from './specify-property-value.component';
import { Component, DebugElement, Inject, OnInit, ViewChild } from '@angular/core';
import { Equals, Exists, KuiCoreConfig, KuiCoreConfigToken, Like, Match, NotEquals, Property } from '@knora/core';
import { BooleanValueComponent } from './boolean-value/boolean-value.component';
import { DateValueComponent } from './date-value/date-value.component';
import { DecimalValueComponent } from './decimal-value/decimal-value.component';
import { IntegerValueComponent } from './integer-value/integer-value.component';
import { LinkValueComponent } from './link-value/link-value.component';
import { TextValueComponent } from './text-value/text-value.component';
import { UriValueComponent } from './uri-value/uri-value.component';
import { JdnDatepickerDirective } from '@knora/action';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('SpecifyPropertyValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SpecifyPropertyValueComponent,
                SpecifyPropertyValueComponent,
                SpecifyPropertyValueComponent,
                BooleanValueComponent,
                DateValueComponent,
                DecimalValueComponent,
                IntegerValueComponent,
                LinkValueComponent,
                TextValueComponent,
                UriValueComponent,
                JdnDatepickerDirective,
                TestHostComponent],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatInputModule,
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
        expect(testHostComponent.specifyPropValueComp).toBeTruthy();
    });

    it('should correctly set the active property from the parent component', () => {
        expect(testHostComponent.specifyPropValueComp.property).toEqual(textProperty);

        expect(testHostComponent.specifyPropValueComp.comparisonOperators).toEqual([new Like(), new Match(), new Equals(), new NotEquals(), new Exists()]);
    });

    it('should create a selection for the comparison operators', () => {

        // access the test host component's child
        expect(testHostComponent.specifyPropValueComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selcompOps = hostCompDe.query(By.directive(SpecifyPropertyValueComponent));

        const matSelect = selcompOps.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        // make sure that there are two mat-option (one for no selection)
        expect(options.length).toEqual(5);
    });

    it('should select a comparison operator', () => {

        // access the test host component's child
        expect(testHostComponent.specifyPropValueComp).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const selcompOps = hostCompDe.query(By.directive(SpecifyPropertyValueComponent));

        const matSelect = selcompOps.query(By.css('mat-select'));

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        const options: DebugElement[] = matSelect.queryAll(By.css('mat-option'));

        // make sure that there are two mat-option (one for no selection)
        expect(options.length).toEqual(5);

        matSelect.nativeElement.click();

        testHostFixture.detectChanges();

        // choose isLike
        (options[0].nativeElement as HTMLElement).click();

        testHostFixture.detectChanges();

        expect(testHostComponent.specifyPropValueComp.comparisonOperatorSelected).toEqual(new Like());

        expect(testHostComponent.specifyPropValueComp.propertyValueComponent).toBeTruthy();
    });

});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-specify-property-value #propValue [formGroup]="form"
                                    [property]="activeProperty"></kui-specify-property-value>`
})
class TestHostComponent implements OnInit {

    form;

    activeProperty: Property;

    @ViewChild('propValue') specifyPropValueComp: SpecifyPropertyValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        this.activeProperty = textProperty;
    }
}

const textProperty = new Property(
    'http://0.0.0.0:3333/ontology/0001/anything/v2#hasText',
    'http://api.knora.org/ontology/knora-api/v2#TextValue',
    undefined,
    'Text',
    ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
    true,
    false,
    false);

