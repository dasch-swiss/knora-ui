import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadIntervalValue } from '@knora/api';
import { By } from '@angular/platform-browser';

import { IntervalValueComponent } from './interval-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `<kui-interval-value #intervalVal [valueObject]="intervalValue"></kui-interval-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('intervalVal', { static: false }) intervalValueComponent: IntervalValueComponent;

    intervalValue;

    constructor() {
    }

    ngOnInit() {
        this.intervalValue = new ReadIntervalValue();
        this.intervalValue.start = 1638;
        this.intervalValue.end = 1715;
    }
}

describe('IntervalValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [IntervalValueComponent, TestHostComponent]
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
        expect(testHostComponent.intervalValueComponent).toBeTruthy();
    });

    it('should be equal to the interval value 1638 - 1715', () => {
        expect(testHostComponent.intervalValueComponent.valueObject.start).toEqual(1638);
        expect(testHostComponent.intervalValueComponent.valueObject.end).toEqual(1715);

        const hostCompDe = testHostFixture.debugElement;

        const intervalVal = hostCompDe.query(By.directive(IntervalValueComponent));

        const spanDebugElement: DebugElement = intervalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('1638 - 1715');
    });

    it('should be equal to the interval value 1977 - 1983', () => {
        testHostComponent.intervalValue = new ReadIntervalValue();
        testHostComponent.intervalValue.start = 1977;
        testHostComponent.intervalValue.end = 1983;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const intervalVal = hostCompDe.query(By.directive(IntervalValueComponent));

        const spanDebugElement: DebugElement = intervalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('1977 - 1983');
    });

});
