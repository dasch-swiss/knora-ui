import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UriElementComponent } from './uri-element.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

describe('UriElementComponent', () => {

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [UriElementComponent, TestHostViewerComponent],
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

    });

});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <kui-uri-element #strVal [eleVal]="value" [formGroup]="form" [readonlyValue]="readonly"></kui-uri-element>`
})
class TestHostViewerComponent implements OnInit {

    form: FormGroup;

    value: string;

    readonly = true;

    @ViewChild('strVal', {static: false}) strComp: UriElementComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});
        this.value = 'https://knora.org';
    }
}
