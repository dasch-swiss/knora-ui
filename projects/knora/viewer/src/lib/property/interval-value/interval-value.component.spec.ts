import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntervalValueComponent } from './interval-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadIntervalValue } from '@knora/core';
import { By } from '@angular/platform-browser';

fdescribe('IntervalValueComponent', () => {
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
        expect(testHostComponent.intervalValueComponent.valueObject.intervalStart).toEqual(1638);
        expect(testHostComponent.intervalValueComponent.valueObject.intervalEnd).toEqual(1715);

        const hostCompDe = testHostFixture.debugElement;

        const intervalVal = hostCompDe.query(By.directive(IntervalValueComponent));

        const spanDebugElement: DebugElement = intervalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('1638 - 1715');
    });

    it('should be equal to the interval value 1977 - 1983', () => {
        testHostComponent.intervalValue = new ReadIntervalValue('id', 'propIri', 1977, 1983);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const intervalVal = hostCompDe.query(By.directive(IntervalValueComponent));

        const spanDebugElement: DebugElement = intervalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('1977 - 1983');
    });

});



/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-interval-value #intervalVal [valueObject]="intervalValue"></kui-interval-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('intervalVal') intervalValueComponent: IntervalValueComponent;

    intervalValue;

    constructor() {
    }

    ngOnInit() {
        this.intervalValue = new ReadIntervalValue('id', 'propIri', 1638, 1715);
    }
}
