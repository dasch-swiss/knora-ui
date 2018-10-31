import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateValueComponent } from './date-value.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
} from '@angular/material';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { KuiCoreConfig, ValueLiteral } from '@knora/core';
import { JdnDatepickerDirective } from '@knora/action';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { GregorianCalendarDate, JDNPeriod } from 'jdnconvertiblecalendar';

describe('DateValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DateValueComponent,
                TestHostComponent,
                JdnDatepickerDirective
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
                MatDatepickerModule,
                MatJDNConvertibleCalendarDateAdapterModule,
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
        expect(testHostComponent.dateValue).toBeTruthy();
    });

    it('should get a date', () => {

        testHostComponent.dateValue.form.setValue({'dateValue': new GregorianCalendarDate(new JDNPeriod(2458422, 2458422))});

        const gregorianDate = new ValueLiteral('GREGORIAN:2018-10-30:2018-10-30', 'http://api.knora.org/ontology/knora-api/v2#DateValue');

        const dateVal = testHostComponent.dateValue.getValue();

        expect(dateVal).toEqual(gregorianDate);

    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <date-value #dateVal [formGroup]="form"></date-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('dateVal') dateValue: DateValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}
