import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement, Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DateAdapter, MAT_DATE_LOCALE, MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';

import { JdnDatepickerDirective } from './jdn-datepicker.directive';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { DateValueComponent } from '@knora/search';

describe('JdnDatepickerDirective', () => {
    let jdnDatepicker: DebugElement;
    let adapter: DateAdapter<JDNConvertibleCalendar>;

    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                MatDatepickerModule,
                MatFormFieldModule,
                MatNativeDateModule,
                FormsModule,
                ReactiveFormsModule
            ],
            declarations: [
                DateValueComponent,
                TestHostComponent,
                JdnDatepickerDirective
            ],
            providers: [
                { provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter, deps: [MAT_DATE_LOCALE] },
                FormBuilder
            ]
        });
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        jdnDatepicker = testHostFixture.debugElement.query(By.css('jdnDatepicker'));
    });

    it('should create an instance', () => {
        const directive = new JdnDatepickerDirective(adapter);
        expect(directive).toBeTruthy();
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

    @ViewChild('dateVal', { static: false }) dateValue: DateValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
    }
}
