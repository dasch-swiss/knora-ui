import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule, ValueLiteral } from '@knora/core';
import { By } from '@angular/platform-browser';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { BooleanValueComponent } from './boolean-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `kui-host-component`,
    template: `
        <boolean-value #boolVal [formGroup]="form"></boolean-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('boolVal', { static: false }) booleanValue: BooleanValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}

describe('BooleanValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                BooleanValueComponent,
                TestHostComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
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
        expect(testHostComponent.booleanValue).toBeTruthy();
    });

    it('should get a boolean value literal that is false', () => {

        // access the test host component's child
        expect(testHostComponent.booleanValue).toBeTruthy();

        const boolValLiteralFalse = new ValueLiteral('false', 'http://www.w3.org/2001/XMLSchema#boolean');

        expect(testHostComponent.booleanValue.getValue()).toEqual(boolValLiteralFalse);

    });

    it('should get a boolean value literal that is true', () => {

        // access the test host component's child
        expect(testHostComponent.booleanValue).toBeTruthy();

        const boolValLiteralTrue = new ValueLiteral('true', 'http://www.w3.org/2001/XMLSchema#boolean');

        const hostCompDe = testHostFixture.debugElement;

        const boolVal = hostCompDe.query(By.directive(BooleanValueComponent));

        const matCheckbox = boolVal.query(By.css('mat-checkbox input'));

        const checkboxEle: HTMLElement = matCheckbox.nativeElement;

        checkboxEle.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.booleanValue.getValue()).toEqual(boolValLiteralTrue);

    });
});
