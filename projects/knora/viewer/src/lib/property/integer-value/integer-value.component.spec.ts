import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IntegerValueComponent } from './integer-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadIntegerValue } from '@knora/core';
import { By } from '@angular/platform-browser';

fdescribe('IntegerValueComponent', () => {
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
        expect(testHostComponent.integerValueComponent.valueObject.integer).toEqual(2018);

        const hostCompDe = testHostFixture.debugElement;

        const integerVal = hostCompDe.query(By.directive(IntegerValueComponent));

        const spanDebugElement: DebugElement = integerVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('2018');
    });

    it('should be equal to the integer value 2019', () => {
        testHostComponent.integerValue = new ReadIntegerValue('id', 'propIri', 2019);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const integerVal = hostCompDe.query(By.directive(IntegerValueComponent));

        const spanDebugElement: DebugElement = integerVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('2019');
    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-integer-value #integerVal [valueObject]="integerValue"></kui-integer-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('integerVal') integerValueComponent: IntegerValueComponent;

    integerValue;

    constructor() {
    }

    ngOnInit() {
        this.integerValue = new ReadIntegerValue('id', 'propIri', 2018);
    }
}
