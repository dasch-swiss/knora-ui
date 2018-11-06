import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DecimalValueComponent } from './decimal-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadDecimalValue } from '@knora/core';
import { By } from '@angular/platform-browser';

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
        testHostComponent.decimalValue = new ReadDecimalValue('id', 'propIri', 56.78);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const decimalVal = hostCompDe.query(By.directive(DecimalValueComponent));

        const spanDebugElement: DebugElement = decimalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('56.78');
    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-decimal-value #decimalVal [valueObject]="decimalValue"></kui-decimal-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('decimalVal') decimalValueComponent: DecimalValueComponent;

    decimalValue;

    constructor() {
    }

    ngOnInit() {
        this.decimalValue = new ReadDecimalValue('id', 'propIri', 1234);
    }
}
