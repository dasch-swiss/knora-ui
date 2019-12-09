import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReadListValue } from '@knora/api';

import { ListValueComponent } from './list-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `<kui-list-value #listVal [valueObject]="listValue"></kui-list-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('listVal', { static: false }) listValueComponent: ListValueComponent;

    listValue: ReadListValue;

    constructor() {
    }

    ngOnInit() {
        this.listValue = new ReadListValue();
        this.listValue.listNode = 'http://rdfh.ch/8be1b7cf7103';
        this.listValue.listNodeLabel = 'countries';
    }
}

describe('ListValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {

        TestBed.configureTestingModule({
            declarations: [
                ListValueComponent,
                TestHostComponent
            ],
            imports: [
                HttpClientTestingModule,
                BrowserAnimationsModule,
                RouterTestingModule.withRoutes([]),
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    },
                }
            ]
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

    it('should be equal to the list node Iri "http://rdfh.ch/8be1b7cf7103"', () => {
        console.log('list value component ', testHostComponent.listValueComponent.valueObject);
        expect(testHostComponent.listValueComponent.valueObject.listNode).toEqual('http://rdfh.ch/8be1b7cf7103');

        const hostCompDe = testHostFixture.debugElement;

        const listVal = hostCompDe.query(By.directive(ListValueComponent));
        console.log('listVal', listVal);

        const spanDebugElement: DebugElement = listVal.query(By.css('span'));
        console.log('spanDebugElement', spanDebugElement);

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;
        console.log('spanNativeElement', spanNativeElement);

        expect(spanNativeElement.innerText).toEqual('countries');

    });

    it('should be equal to the list node Iri "http://rdfh.ch/9sdf8sfd2jf9"', () => {

        testHostComponent.listValue = new ReadListValue();
        testHostComponent.listValue.listNode = 'http://rdfh.ch/9sdf8sfd2jf9';
        testHostComponent.listValue.listNodeLabel = 'cantons';

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const listVal = hostCompDe.query(By.directive(ListValueComponent));

        const spanDebugElement: DebugElement = listVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('cantons');
    });

});
