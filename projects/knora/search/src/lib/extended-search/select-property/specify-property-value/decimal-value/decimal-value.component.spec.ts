import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiCoreModule, ValueLiteral } from '@knora/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';

import { DecimalValueComponent } from './decimal-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `kui-host-component`,
    template: `
        <decimal-value #decimalVal [formGroup]="form"></decimal-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('decimalVal', { static: false }) decimalValue: DecimalValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}

describe('DecimalValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    const config = new KnoraApiConfig('http', '0.0.0.0', 3333);

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                DecimalValueComponent,
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
                KuiCoreModule
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
                    useValue: config
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: new KnoraApiConnection(config)
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
        expect(testHostComponent.decimalValue).toBeTruthy();
    });

    it('should get a decimal literal of 1.1', () => {
        // access the test host component's child
        expect(testHostComponent.decimalValue).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const decLiteralVal = new ValueLiteral('1.1', 'http://www.w3.org/2001/XMLSchema#decimal');

        const decVal = hostCompDe.query(By.directive(DecimalValueComponent));

        const matInput = decVal.query(By.css('input'));

        matInput.nativeElement.value = '1.1';

        matInput.triggerEventHandler('input', { target: matInput.nativeElement });

        testHostFixture.detectChanges();

        expect(testHostComponent.decimalValue.getValue()).toEqual(decLiteralVal);

    });
});
