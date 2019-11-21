import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, ElementRef, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCalendar, MatDatepickerContent, MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule } from '@knora/core';
import { JdnDatepickerDirective } from '@knora/action';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { BrowserDynamicTestingModule } from '@angular/platform-browser-dynamic/testing';
import { By } from '@angular/platform-browser';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { HeaderComponent } from './header-calendar.component';

class MockElementRef implements ElementRef {
    nativeElement = {};
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `kui-host-component`,
    template: `
        <mat-calendar #cal [headerComponent]="headerComponent"></mat-calendar>`
})
class TestHostComponent implements OnInit {

    form;

    headerComponent = HeaderComponent;

    @ViewChild('cal', { static: false }) calendar: MatCalendar<JDNConvertibleCalendar>;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
    }
}

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
                { provide: ElementRef, useClass: MockElementRef },
                { provide: MatDatepickerContent, useClass: MatDatepickerContent }
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
