import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextElementComponent } from './text-element.component';
import { Component, DebugElement, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('StringElementComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextElementComponent,
                TestHostViewerComponent
            ],
            imports: [
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                BrowserAnimationsModule,
                MatInputModule,
            ]
        })
            .compileComponents();
    }));

    describe('View mode', () => {

        let testHostComponent: TestHostViewerComponent;
        let testHostFixture: ComponentFixture<TestHostViewerComponent>;

        beforeEach(() => {
            testHostFixture = TestBed.createComponent(TestHostViewerComponent);
            testHostComponent = testHostFixture.componentInstance;
            testHostFixture.detectChanges();

            expect(testHostComponent).toBeTruthy();
        });

        it('should create', () => {
            // access the test host component's child
            expect(testHostComponent.strComp).toBeTruthy();
        });

        it('should set the correct value from the host viewer component', () => {
            expect(testHostComponent.strComp.eleVal).toEqual('test');

            const hostCompDe = testHostFixture.debugElement;

            const integerVal = hostCompDe.query(By.directive(TextElementComponent));

            const inputDebugElement: DebugElement = integerVal.query(By.css('input'));

            const inputNativeElement = inputDebugElement.nativeElement;

            expect(inputNativeElement.value).toEqual('test');

            expect(inputNativeElement.readOnly).toEqual(true);

            expect(testHostComponent.strComp.form.valid).toBeTruthy();
        });

    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-text-element #strVal [eleVal]="value" [formGroup]="form" [readonlyValue]="readonly"></kui-text-element>`
})
class TestHostViewerComponent implements OnInit {

    form: FormGroup;

    value: string;

    readonly = true;

    @ViewChild('strVal', {static: false}) strComp: TextElementComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
        this.value = 'test';
    }
}
