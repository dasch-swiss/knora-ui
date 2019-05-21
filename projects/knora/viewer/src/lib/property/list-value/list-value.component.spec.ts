import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueComponent } from './list-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { KuiCoreConfig, KuiCoreConfigToken, ListCacheService, ReadListValue } from '@knora/core';
import { By } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ListNodeV2 } from '@knora/core';

describe('ListValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let spyListCacheService;

    beforeEach(async(() => {

        spyListCacheService = jasmine.createSpyObj('ListCacheService', ['getListNode']);

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
                {provide: ListCacheService, useValue: spyListCacheService},
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    },
                },
                {
                    provide: KuiCoreConfigToken,
                    useValue: KuiCoreConfig
                },
            ]
        })
            .compileComponents();

        spyListCacheService.getListNode.and.callFake((nodeIri) => {
            return of(new ListNodeV2(nodeIri, 'test' + nodeIri, 1, ''));
        });
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
        const listCacheService = TestBed.get(ListCacheService);

        expect(testHostComponent.listValueComponent.valueObject.listNodeIri).toEqual('http://rdfh.ch/8be1b7cf7103');

        const hostCompDe = testHostFixture.debugElement;

        const listVal = hostCompDe.query(By.directive(ListValueComponent));

        const spanDebugElement: DebugElement = listVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('testhttp://rdfh.ch/8be1b7cf7103');

        expect(listCacheService.getListNode).toHaveBeenCalledTimes(1);
        expect(listCacheService.getListNode).toHaveBeenCalledWith('http://rdfh.ch/8be1b7cf7103');

    });

    it('should be equal to the list node Iri "http://rdfh.ch/9sdf8sfd2jf9"', () => {
        const listCacheService = TestBed.get(ListCacheService);

        testHostComponent.listValue = new ReadListValue('id', 'propIri', 'http://rdfh.ch/9sdf8sfd2jf9');

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const listVal = hostCompDe.query(By.directive(ListValueComponent));

        const spanDebugElement: DebugElement = listVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('testhttp://rdfh.ch/9sdf8sfd2jf9');

        expect(listCacheService.getListNode).toHaveBeenCalledTimes(2);
        expect(listCacheService.getListNode).toHaveBeenCalledWith('http://rdfh.ch/8be1b7cf7103');
        expect(listCacheService.getListNode).toHaveBeenCalledWith('http://rdfh.ch/9sdf8sfd2jf9');
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
        this.listValue = new ReadListValue('id', 'propIri', 'http://rdfh.ch/8be1b7cf7103');
    }
}
