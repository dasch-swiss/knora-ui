import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadDecimalValue } from '@knora/api';
import { By } from '@angular/platform-browser';

import { DecimalValueComponent } from './decimal-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-decimal-value #decimalVal [valueObject]="decimalValue"></kui-decimal-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('decimalVal', { static: false }) decimalValueComponent: DecimalValueComponent;

    decimalValue;

    constructor() {
    }

    ngOnInit() {
        this.decimalValue = new ReadDecimalValue();
        this.decimalValue.decimal = 1234;
    }
}

describe('DecimalValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [DecimalValueComponent, TestHostComponent]
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
        expect(testHostComponent.decimalValueComponent).toBeTruthy();
    });

    it('should contain the decimal value 1234', () => {
        expect(testHostComponent.decimalValueComponent.valueObject.decimal).toEqual(1234);

        const hostCompDe = testHostFixture.debugElement;

        const decimalVal = hostCompDe.query(By.directive(DecimalValueComponent));

        const spanDebugElement: DebugElement = decimalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('1234');
    });

    it('should contain the decimal value 56.78', () => {
        testHostComponent.decimalValue = new ReadDecimalValue();
        testHostComponent.decimalValue.decimal = 56.78;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const decimalVal = hostCompDe.query(By.directive(DecimalValueComponent));

        const spanDebugElement: DebugElement = decimalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('56.78');
    });
});
