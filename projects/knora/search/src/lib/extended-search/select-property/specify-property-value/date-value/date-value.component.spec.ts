import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule, ValueLiteral } from '@knora/core';
import { JdnDatepickerDirective } from '@knora/action';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { GregorianCalendarDate, JDNPeriod } from 'jdnconvertiblecalendar';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { DateValueComponent } from './date-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `kui-host-component`,
    template: `
        <date-value #dateVal [formGroup]="form"></date-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('dateVal', { static: false }) dateValue: DateValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}

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
                RouterTestingModule.withRoutes([]),
                KuiCoreModule.forRoot({
                    knora: {
                        apiProtocol: 'http',
                        apiHost: '0.0.0.0',
                        apiPort: 3333,
                        apiUrl: '',
                        apiPath: '',
                        jsonWebToken: '',
                        logErrors: true
                    },
                    app: {
                        name: 'Knora-UI-APP',
                        url: 'localhost:4200'
                    }
                })
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
                    useValue: KnoraApiConfig
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: KnoraApiConnection
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

        testHostComponent.dateValue.form.setValue({ 'dateValue': new GregorianCalendarDate(new JDNPeriod(2458422, 2458422)) });

        const gregorianDate = new ValueLiteral('GREGORIAN:2018-10-30:2018-10-30', 'http://api.knora.org/ontology/knora-api/simple/v2#Date');

        const dateVal = testHostComponent.dateValue.getValue();

        expect(dateVal).toEqual(gregorianDate);

    });
});

