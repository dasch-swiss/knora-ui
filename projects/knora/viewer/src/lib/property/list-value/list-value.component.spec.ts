import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueComponent } from './list-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadListValue } from '@knora/core';
import { By } from '@angular/platform-browser';

fdescribe('ListValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [ListValueComponent, TestHostComponent]
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
        expect(testHostComponent.listValueComponent).toBeTruthy();
    });

    it('should be equal to the list node label value "ListNodeLabel1"', () => {
        expect(testHostComponent.listValueComponent.valueObject.listNodeLabel).toEqual('ListNodeLabel1');

        const hostCompDe = testHostFixture.debugElement;

        const listVal = hostCompDe.query(By.directive(ListValueComponent));

        const spanDebugElement: DebugElement = listVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('ListNodeLabel1');
    });

    it('should be equal to the list node label value "ListNodeLabel2"', () => {
        testHostComponent.listValue = new ReadListValue('id', 'propIri', 'http://rdfh.ch/9sdf8sfd2jf9', 'ListNodeLabel2');

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const listVal = hostCompDe.query(By.directive(ListValueComponent));

        const spanDebugElement: DebugElement = listVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('ListNodeLabel2');
    });

});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-list-value #listVal [valueObject]="listValue"></kui-list-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('listVal') listValueComponent: ListValueComponent;

    listValue;

    constructor() {
    }

    ngOnInit() {
        this.listValue = new ReadListValue('id', 'propIri', 'http://rdfh.ch/8be1b7cf7103', 'ListNodeLabel1');
    }
}
