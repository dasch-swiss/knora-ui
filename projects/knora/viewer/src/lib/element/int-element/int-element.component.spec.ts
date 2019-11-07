import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntElementComponent } from './int-element.component';
import { Component, DebugElement, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';

describe('IntElementComponent', () => {
    let testHostComponent: TestHostViewerComponent;
    let testHostFixture: ComponentFixture<TestHostViewerComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                IntElementComponent,
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

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostViewerComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should create', () => {
        // access the test host component's child
        expect(testHostComponent.intComp).toBeTruthy();
    });

    it('should set the correct value from the host viewer component', () => {
        expect(testHostComponent.intComp.eleVal).toEqual(10);

        const hostCompDe = testHostFixture.debugElement;

        const integerVal = hostCompDe.query(By.directive(IntElementComponent));

        const inputDebugElement: DebugElement = integerVal.query(By.css('input'));

        const inputNativeElement = inputDebugElement.nativeElement;

        expect(inputNativeElement.value).toEqual('10');

        expect(inputNativeElement.readOnly).toEqual(true);

        expect(testHostComponent.intComp.form.valid).toBeTruthy();
    });

    it('should detect an invalid value from the host viewer component', () => {
        testHostComponent.value = 1.5;

        testHostFixture.detectChanges();

        expect(testHostComponent.intComp.eleVal).toEqual(1.5);

        const hostCompDe = testHostFixture.debugElement;

        const integerVal = hostCompDe.query(By.directive(IntElementComponent));

        const inputDebugElement: DebugElement = integerVal.query(By.css('input'));

        const inputNativeElement = inputDebugElement.nativeElement;

        expect(inputNativeElement.value).toEqual('1.5');

        expect(inputNativeElement.readOnly).toEqual(true);

        expect(testHostComponent.intComp.form.valid).toBeFalsy();
    });

});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-int-element #intVal [eleVal]="value" [formGroup]="form" [readonlyValue]="true"></kui-int-element>`
})
class TestHostViewerComponent implements OnInit {

    form;

    value: number;

    @ViewChild('intVal', {static: false}) intComp: IntElementComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
        this.value = 10;
    }
}
