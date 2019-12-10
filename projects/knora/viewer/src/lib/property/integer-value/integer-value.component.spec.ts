import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadIntValue } from '@knora/api';
import { By } from '@angular/platform-browser';

import { IntegerValueComponent } from './integer-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `<kui-integer-value #integerVal [valueObject]="integerValue"></kui-integer-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('integerVal', { static: false }) integerValueComponent: IntegerValueComponent;

    integerValue;

    constructor() {
    }

    ngOnInit() {
        this.integerValue = new ReadIntValue();
        this.integerValue.int = 2018;
    }
}

describe('IntegerValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [IntegerValueComponent, TestHostComponent]
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
        expect(testHostComponent.integerValueComponent).toBeTruthy();
    });

    it('should be equal to the integer value 2018', () => {
        expect(testHostComponent.integerValueComponent.valueObject.int).toEqual(2018);

        const hostCompDe = testHostFixture.debugElement;

        const integerVal = hostCompDe.query(By.directive(IntegerValueComponent));

        const spanDebugElement: DebugElement = integerVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('2018');
    });

    it('should be equal to the integer value 2019', () => {
        testHostComponent.integerValue = new ReadIntValue();
        testHostComponent.integerValue.int = 2019;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const integerVal = hostCompDe.query(By.directive(IntegerValueComponent));

        const spanDebugElement: DebugElement = integerVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('2019');
    });
});
