import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { KuiCoreConfig } from '../../../../../../../core/src/lib/declarations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ValueLiteral } from '@knora/core';
import { UriValueComponent } from './uri-value.component';

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

        matInput.triggerEventHandler('input', {target: matInput.nativeElement});

        testHostFixture.detectChanges();

        expect(testHostComponent.uriValue.getValue()).toEqual(uriLiteralVal);

    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <uri-value #uriVal [formGroup]="form"></uri-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('uriVal') uriValue: UriValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}
