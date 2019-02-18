import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header-calendar.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatCalendar,
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
import { KuiCoreConfig, KuiCoreConfigToken } from '@knora/core';
import { JdnDatepickerDirective } from '@knora/action';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';

describe('HeaderComponent', () => {
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
                {
                    provide: KuiCoreConfigToken,
                    useValue: KuiCoreConfig
                },
                FormBuilder
            ]
        });

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
        expect(testHostComponent.calendar).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        // get the header
        const header = hostCompDe.query(By.directive(HeaderComponent));

        expect(header).toBeTruthy();

        // TODO: header HTML seems no to be initialized correctly

        // header.componentInstance.ngOnInit();

        // console.log(header.componentInstance);

        // const calSel = header.query(By.css('mat-select'));

        // console.log(calSel);

        // const calSelEle: HTMLElement = calSel.nativeElement;

        // calSelEle.click();

        // testHostFixture.detectChanges();
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
        <mat-calendar #cal [headerComponent]="headerComponent"></mat-calendar>`
})
class TestHostComponent implements OnInit {

    form;

    headerComponent = HeaderComponent;

    @ViewChild('cal') calendar: MatCalendar<JDNConvertibleCalendar>;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}
