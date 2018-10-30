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

import { SpecifyPropertyValueComponent } from './specify-property-value.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { Property } from '../../../../../../core/src/lib/services';
import { BooleanValueComponent } from './boolean-value/boolean-value.component';
import { DateValueComponent } from './date-value/date-value.component';
import { DecimalValueComponent } from './decimal-value/decimal-value.component';
import { IntegerValueComponent } from './integer-value/integer-value.component';
import { LinkValueComponent } from './link-value/link-value.component';
import { TextValueComponent } from './text-value/text-value.component';
import { UriValueComponent } from './uri-value/uri-value.component';
import { JdnDatepickerDirective } from '../../../../../../action/src/lib/directives/jdn-datepicker.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { KuiCoreConfig } from '../../../../../../core/src/lib/declarations';

fdescribe('SpecifyPropertyValueComponent', () => {
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
        expect(testHostComponent.specifyPropValueComp).toBeTruthy();
    });

    it('should correctly set the active property from the parent component', () => {
        expect(testHostComponent.specifyPropValueComp.property).toEqual(textProperty);
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

