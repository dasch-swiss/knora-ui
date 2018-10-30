import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header-calendar.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatDatepicker,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule
} from '@angular/material';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { KuiCoreConfig } from '../../../../../../../../core/src/lib/declarations';
import { JdnDatepickerDirective } from '@knora/action';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { SpecifyPropertyValueComponent } from '../../specify-property-value.component';
import { By } from '@angular/platform-browser';

fdescribe('HeaderComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                HeaderComponent,
                TestHostComponent,
                JdnDatepickerDirective
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatSelectModule,
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
                {provide: 'config', useValue: KuiCoreConfig},
                FormBuilder
            ]
        })

        TestBed.overrideModule(BrowserDynamicTestingModule, {
            set: {
                entryComponents: [HeaderComponent]
            }
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
        expect(testHostComponent.datePicker).toBeTruthy();

        testHostComponent.datePicker.open();

        testHostFixture.detectChanges();

        expect(testHostComponent.datePicker.calendarHeaderComponent).toBeTruthy();

        expect(testHostComponent.datePicker.calendarHeaderComponent).toBe(HeaderComponent);
    });

    /*it('should create the selection fot the calendars', () => {

        // access the test host component's child
        expect(testHostComponent.datePicker).toBeTruthy();

        testHostComponent.datePicker.open();

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        // get the header
        const header = hostCompDe.query(By.directive(HeaderComponent));

        const calSel = header.query(By.css('mat-select'));

        const calSelEle: HTMLElement = calSel.nativeElement;

        calSelEle.click();

        testHostFixture.detectChanges();

        const matOptions = calSel.queryAll(By.css('mat-option'));

        console.log(matOptions);
    });*/


});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <jdn-datepicker>
            <input matInput [matDatepicker]="picker" placeholder="Choose a date">
            <mat-datepicker #picker [calendarHeaderComponent]="headerComponent"></mat-datepicker>
        </jdn-datepicker>
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>`
})
class TestHostComponent implements OnInit {

    form;

    headerComponent = HeaderComponent;

    @ViewChild('picker') datePicker: MatDatepicker<JDNConvertibleCalendar>;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}
