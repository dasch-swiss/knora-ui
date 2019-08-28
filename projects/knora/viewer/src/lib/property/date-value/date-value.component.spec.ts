import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateValueComponent } from './date-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadDateValue } from '@knora/core';
import { By } from '@angular/platform-browser';

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

    it('should contain a period with a year precision', () => {
        expect(testHostComponent.dateValueComponent.valueObject.startYear).toEqual(1700);
        expect(testHostComponent.dateValueComponent.valueObject.endYear).toEqual(1750);
        expect(testHostComponent.dateValueComponent.valueObject.startEra).toEqual('CE');
        expect(testHostComponent.dateValueComponent.valueObject.endEra).toEqual('CE');
        expect(testHostComponent.dateValueComponent.valueObject.calendar).toEqual('julian');

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
    });

});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-date-value #dateVal [valueObject]="dateValue" [calendar]="calendar" [era]="era"></kui-date-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('dateVal', { static: false }) dateValueComponent: DateValueComponent;

    dateValue;
    calendar = true;
    era = true;

    constructor() {
    }

    ngOnInit() {
        this.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE');
    }
}

