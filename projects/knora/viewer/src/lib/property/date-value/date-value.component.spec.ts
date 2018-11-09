import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DateValueComponent } from './date-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadDateValue } from '@knora/core';
import { By } from '@angular/platform-browser';

fdescribe('DateValueComponent', () => {
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

  it('should contain a yyyy date with era and calendar', () => {
    expect(testHostComponent.dateValueComponent.valueObject.startYear).toEqual(1700);
    expect(testHostComponent.dateValueComponent.valueObject.endYear).toEqual(1750);
    expect(testHostComponent.dateValueComponent.valueObject.startEra).toEqual('CE');
    expect(testHostComponent.dateValueComponent.valueObject.endEra).toEqual('CE');
    expect(testHostComponent.dateValueComponent.valueObject.calendar).toEqual('julian');

    const hostCompDe = testHostFixture.debugElement;

    const dateVal = hostCompDe.query(By.directive(DateValueComponent));

    const divDebugElement: DebugElement = dateVal.query(By.css('div'));

    const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

    expect(spanNativeElement.innerText).toEqual('1700 CE - 1750 CE (julian)');
  });

  it('should contain a MMMM yyyy date with era and calendar', () => {

    testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE', 3, 11);

    testHostFixture.detectChanges();

    const hostCompDe = testHostFixture.debugElement;

    const dateVal = hostCompDe.query(By.directive(DateValueComponent));

    const divDebugElement: DebugElement = dateVal.query(By.css('div'));

    const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

    expect(spanNativeElement.innerText).toEqual('March 1700 CE - November 1750 CE (julian)');

  });

  it('should contain a DD MMMM yyyy date with era and calendar', () => {

    testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE', 4, 8, 12, 30);

    testHostFixture.detectChanges();

    const hostCompDe = testHostFixture.debugElement;

    const dateVal = hostCompDe.query(By.directive(DateValueComponent));

    const divDebugElement: DebugElement = dateVal.query(By.css('div'));

    const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

    console.log(spanNativeElement.innerText);
    expect(spanNativeElement.innerText).toEqual('April 12, 1700 CE - August 30, 1750 CE (julian)');
  });

  it('should contain 2 dates with different precisions', () => {

    testHostComponent.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE', undefined, 8);

    testHostFixture.detectChanges();

    const hostCompDe = testHostFixture.debugElement;

    const dateVal = hostCompDe.query(By.directive(DateValueComponent));

    const divDebugElement: DebugElement = dateVal.query(By.css('div'));

    const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

    console.log(spanNativeElement.innerText);
    expect(spanNativeElement.innerText).toEqual('1700 CE - August 1750 CE (julian)');
  });

});


/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
      <kui-date-value #dateVal [valueObject]="dateValue" [calendar]="true" [era]="true"></kui-date-value>`
})
class TestHostComponent implements OnInit {

  @ViewChild('dateVal') dateValueComponent: DateValueComponent;

  dateValue;
  calendar: boolean;
  era: boolean;

  constructor() {
  }

  ngOnInit() {
    this.dateValue = new ReadDateValue('id', 'propIri', 'julian', 1700, 1750, 'CE', 'CE');
  }
}

