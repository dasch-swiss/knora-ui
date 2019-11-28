import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UriElementComponent } from './uri-element.component';
import { Component, DebugElement, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { By } from '@angular/platform-browser';
import { IntElementComponent } from '..';

describe('UriElementComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UriElementComponent, TestHostViewerComponent, TestHostEditComponent],
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
            expect(testHostComponent.uriComp).toBeTruthy();
        });

        it('should display URI', () => {

            testHostFixture.detectChanges();

            const hostCompDe = testHostFixture.debugElement;

            const uriVal = hostCompDe.query(By.directive(UriElementComponent));

            const linkDebugElement: DebugElement = uriVal.query(By.css('a'));

            const linkNativeElement = linkDebugElement.nativeElement;

            expect(linkNativeElement.innerText).toEqual('https://knora.org');

            expect(linkDebugElement.properties.href).toEqual('https://knora.org');

        });

        it('should display the label if set', () => {

            testHostComponent.label = 'Link to Knora';

            testHostFixture.detectChanges();

            const hostCompDe = testHostFixture.debugElement;

            const uriVal = hostCompDe.query(By.directive(UriElementComponent));

            const linkDebugElement: DebugElement = uriVal.query(By.css('a'));

            const linkNativeElement = linkDebugElement.nativeElement;

            expect(linkNativeElement.innerText).toEqual('Link to Knora');

            expect(linkDebugElement.properties.href).toEqual('https://knora.org');

        });

    });

    describe('Edit mode', () => {

        let testHostComponent: TestHostEditComponent;
        let testHostFixture: ComponentFixture<TestHostEditComponent>;

        beforeEach(() => {
            testHostFixture = TestBed.createComponent(TestHostEditComponent);
            testHostComponent = testHostFixture.componentInstance;
            testHostFixture.detectChanges();

            expect(testHostComponent).toBeTruthy();
        });

        it('should create', () => {
            // access the test host component's child
            expect(testHostComponent.uriComp).toBeTruthy();
        });

        it('should set the correct value from the host edit component', () => {
            expect(testHostComponent.uriComp.eleVal).toEqual('https://knora.org');

            const hostCompDe = testHostFixture.debugElement;

            const integerVal = hostCompDe.query(By.directive(UriElementComponent));

            const inputDebugElement: DebugElement = integerVal.query(By.css('input'));

            const inputNativeElement = inputDebugElement.nativeElement;

            expect(inputNativeElement.value).toEqual('https://knora.org');

            expect(inputNativeElement.readOnly).toEqual(false);

            expect(testHostComponent.uriComp.form.valid).toBeTruthy();
        });

    });

});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-uri-element #uriVal [eleVal]="value" [label]="label" [formGroup]="form"
                         [readonlyValue]="readonly"></kui-uri-element>`
})
class TestHostViewerComponent implements OnInit {

    form: FormGroup;

    value: string;

    label?: string;

    readonly = true;

    @ViewChild('uriVal', {static: false}) uriComp: UriElementComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
        this.value = 'https://knora.org';
    }
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-uri-element #uriVal [eleVal]="value" [formGroup]="form" [readonlyValue]="false"></kui-uri-element>`
})
class TestHostEditComponent implements OnInit {

    form: FormGroup;

    value: string;

    label?: string;

    readonly = false;

    @ViewChild('uriVal', {static: false}) uriComp: UriElementComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
        this.value = 'https://knora.org';
    }
}
