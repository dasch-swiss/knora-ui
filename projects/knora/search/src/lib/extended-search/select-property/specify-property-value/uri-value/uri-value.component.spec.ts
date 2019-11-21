import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule, ValueLiteral } from '@knora/core';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { UriValueComponent } from './uri-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `kui-host-component`,
    template: `
        <uri-value #uriVal [formGroup]="form"></uri-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('uriVal', { static: false }) uriValue: UriValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}

describe('UriValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                UriValueComponent,
                TestHostComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
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
        expect(testHostComponent.uriValue).toBeTruthy();
    });

    it('should get a URI literal of test', () => {
        // access the test host component's child
        expect(testHostComponent.uriValue).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const uriLiteralVal = new ValueLiteral('http://www.knra.org', 'http://www.w3.org/2001/XMLSchema#anyURI');

        const uriVal = hostCompDe.query(By.directive(UriValueComponent));

        const matInput = uriVal.query(By.css('input'));

        matInput.nativeElement.value = 'http://www.knra.org';

        matInput.triggerEventHandler('input', { target: matInput.nativeElement });

        testHostFixture.detectChanges();

        expect(testHostComponent.uriValue.getValue()).toEqual(uriLiteralVal);

    });
});
