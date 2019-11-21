import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextValueAsStringComponent } from './text-value-as-string.component';
import { ReadTextValueAsString } from '@knora/core';
import { GndDirective } from '@knora/action';
import { Component, OnInit, ViewChild } from '@angular/core';
import { TextElementComponent } from '../../../element';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';

describe('TextValueAsStringComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                BrowserAnimationsModule,
                MatInputModule],
            declarations: [
                TextValueAsStringComponent,
                GndDirective,
                TestHostComponent,
                TextElementComponent
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
        expect(testHostComponent.stringValueComponent).toBeTruthy();
    });

    it('should contain the string "Number theory"', () => {
        expect(testHostComponent.stringValueComponent.valueObject.str).toEqual('Number theory');

        expect(testHostComponent.stringValueComponent.stringValueElement.eleVal).toEqual('Number theory');
    });

    it('should contain the string "Natural Science"', () => {
        testHostComponent.stringValue = new ReadTextValueAsString('id', 'propIri', 'Natural Science');

        testHostFixture.detectChanges();

        expect(testHostComponent.stringValueComponent.stringValueElement.eleVal).toEqual('Natural Science');
    });

    it('should handle special characters in HTML correctly', () => {

        testHostComponent.stringValue = new ReadTextValueAsString('id', 'propIri', '<>&\'"');

        testHostFixture.detectChanges();

        expect(testHostComponent.stringValueComponent.stringValueElement.eleVal).toEqual('<>&\'"');

    });

});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-text-value-as-string #stringVal [valueObject]="stringValue"></kui-text-value-as-string>`
})
class TestHostComponent implements OnInit {

    @ViewChild('stringVal', { static: false }) stringValueComponent: TextValueAsStringComponent;

    stringValue;

    constructor() {
    }

    ngOnInit() {
        this.stringValue = new ReadTextValueAsString('id', 'propIri', 'Number theory');
    }
}
