import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextValueComponent } from './text-value.component';
import { MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { By } from '@angular/platform-browser';
import { KuiCoreConfig } from '../../../../../../../core/src/lib/declarations';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { ValueLiteral } from '@knora/core';

describe('TextValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextValueComponent,
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
        expect(testHostComponent.textValue).toBeTruthy();
    });

    it('should get a text literal of test', () => {
        // access the test host component's child
        expect(testHostComponent.textValue).toBeTruthy();

        const hostCompDe = testHostFixture.debugElement;

        const textLiteralVal = new ValueLiteral('test', 'http://www.w3.org/2001/XMLSchema#string');

        const textVal = hostCompDe.query(By.directive(TextValueComponent));

        const matInput = textVal.query(By.css('input'));

        matInput.nativeElement.value = 'test';

        matInput.triggerEventHandler('input', {target: matInput.nativeElement});

        testHostFixture.detectChanges();

        expect(testHostComponent.textValue.getValue()).toEqual(textLiteralVal);

    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <text-value #textVal [formGroup]="form"></text-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('textVal') textValue: TextValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}
