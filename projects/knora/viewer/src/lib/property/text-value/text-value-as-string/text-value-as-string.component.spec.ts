import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReadTextValueAsString } from '@knora/api';
import { GndDirective } from '@knora/action';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

import { TextValueAsStringComponent } from './text-value-as-string.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-text-value-as-string #stringVal [valueObject]="stringValue"></kui-text-value-as-string>`
})
class TestHostComponent implements OnInit {

    @ViewChild('stringVal', { static: false }) stringValueComponent: TextValueAsStringComponent;

    stringValue: ReadTextValueAsString;

    constructor() {
    }

    ngOnInit() {
        this.stringValue = new ReadTextValueAsString();
        this.stringValue.text = 'Number theory';
    }
}

describe('TextValueAsStringComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                TextValueAsStringComponent,
                GndDirective,
                TestHostComponent
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
        expect(testHostComponent.stringValueComponent.valueObject.text).toEqual('Number theory');

        const hostCompDe = testHostFixture.debugElement;

        const stringVal = hostCompDe.query(By.directive(TextValueAsStringComponent));

        const spanDebugElement: DebugElement = stringVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('Number theory');
    });

    it('should contain the string "Natural Science"', () => {
        testHostComponent.stringValue = new ReadTextValueAsString();
        testHostComponent.stringValue.text = 'Natural Science';

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const stringVal = hostCompDe.query(By.directive(TextValueAsStringComponent));
        console.log('stringVal', stringVal);

        const spanDebugElement: DebugElement = stringVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('Natural Science');
    });

    it('should handle special characters in HTML correctly', () => {

        testHostComponent.stringValue = new ReadTextValueAsString();
        testHostComponent.stringValue.text = '<>&\'"';

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const stringVal = hostCompDe.query(By.directive(TextValueAsStringComponent));

        const spanDebugElement: DebugElement = stringVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('<>&\'"');

        expect(spanNativeElement.innerHTML).toEqual('&lt;&gt;&amp;\'"');

    });

});
