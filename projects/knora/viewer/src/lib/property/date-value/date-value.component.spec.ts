import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadDateValue } from '@knora/api';
import { By } from '@angular/platform-browser';
import { ParseReadDateValue } from '@knora/api/src/models/v2/resources/values/read/read-date-value';

import { DateValueComponent } from './date-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `<kui-date-value #dateVal [valueObject]="dateValue" [calendar]="calendar" [era]="era"></kui-date-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('dateVal', { static: false }) dateValueComponent: DateValueComponent;

    dateValue: ReadDateValue;
    date: ParseReadDateValue;
    calendar = true;
    era = true;

    constructor() {
    }

    ngOnInit() {
        this.date = new ParseReadDateValue('', '', '', '', '', '', '', '', '', '', '', '', '', '');
        this.dateValue = new ReadDateValue(this.date);
    }
}

describe('DateValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [DateValueComponent, TestHostComponent]
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
        expect(testHostComponent.dateValueComponent).toBeTruthy();
    });

    // TODO: use the MockFactory from knora-api-js-lib to fix the tests

    /* it('should contain a period with a year precision', () => {

        expect(testHostComponent.dateValueComponent.valueObject.date instanceof KnoraDate).toBeTruthy();

        const knoraDate = testHostComponent.dateValueComponent.valueObject.date as KnoraDate;
        expect(knoraDate.year).toEqual(1750);
        expect(knoraDate.era).toEqual('CE');
        expect(knoraDate.calendar).toEqual('julian');

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('1700 CE - 1750 CE (julian)');
    });

     it('should contain a period with a year precision without calendar', () => {

        testHostComponent.calendar = false;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('1700 CE - 1750 CE');
    });

    it('should contain a period with a year precision without era', () => {

        testHostComponent.era = false;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('1700 - 1750 (julian)');
    });

    it('should contain a period with a year precision without era and without calendar', () => {

        testHostComponent.era = false;

        testHostComponent.calendar = false;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('1700 - 1750');
    });

    it('should contain a period with a month precision', () => {

        testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE', 3, 11);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('March 1700 CE - November 1750 CE (julian)');

    });

    it('should contain a period with a day precision', () => {

        testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE', 4, 8, 12, 30);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('April 12, 1700 CE - August 30, 1750 CE (julian)');
    });

    it('should contain a period with different precisions', () => {

        testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE', undefined, 2);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('1700 CE - February 1750 CE (julian)');
    });

    it('should contain one date', () => {

        testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'gregorian', 1690, 1690, 'CE', 'CE', 3, 3, 18, 18);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('March 18, 1690 CE (gregorian)');
    });

    it('should contain one date without calendar', () => {

        testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'gregorian', 1690, 1690, 'CE', 'CE', 3, 3, 18, 18);

        testHostComponent.calendar = false;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('March 18, 1690 CE');
    });

    it('should contain one date without era', () => {

        testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'gregorian', 1690, 1690, 'CE', 'CE', 3, 3, 18, 18);

        testHostComponent.era = false;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('March 18, 1690 (gregorian)');
    });

    it('should contain one date without calendar and without era', () => {

        testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'gregorian', 1690, 1690, 'CE', 'CE', 3, 3, 18, 18);

        testHostComponent.calendar = false;

        testHostComponent.era = false;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const dateVal = hostCompDe.query(By.directive(DateValueComponent));

        const divDebugElement: DebugElement = dateVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText.trim()).toEqual('March 18, 1690');
    }); */

});
