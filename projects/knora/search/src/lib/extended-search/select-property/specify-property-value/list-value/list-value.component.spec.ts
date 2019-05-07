import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListValueComponent } from './list-value.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { KuiCoreConfig, KuiCoreConfigToken, ListCacheService, Property } from '@knora/core';
import { MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ListDisplayComponent } from './list-display/list-display.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';
import { ListNodeV2 } from '@knora/core';

describe('ListValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    let spyListCacheService;

    beforeEach(async(() => {

        spyListCacheService = jasmine.createSpyObj('ListCacheService', ['getList']);

        TestBed.configureTestingModule({
            declarations: [
                ListValueComponent,
                TestHostComponent,
                ListDisplayComponent
            ],
            imports: [
                HttpClientTestingModule,
                FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
                MatInputModule,
                MatMenuModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                { provide: ListCacheService, useValue: spyListCacheService },
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
                FormBuilder
            ]
        })
            .compileComponents();

        const testList = new ListNodeV2(
            'http://rdfh.ch/lists/0001/treeList',
            'tree list'
        );

        testList.children.push(new ListNodeV2(
            'http://rdfh.ch/lists/0001/treeList/01',
            'tree list 01',
            1,
            'http://rdfh.ch/lists/0001/treeList'
        ));

        spyListCacheService.getList.and.returnValue(of(testList));

    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should create', () => {
        // access the test host component's child
        expect(testHostComponent.listValue).toBeTruthy();
    });

    it('should have called ListCacheService\'s getList method', () => {
        const listCacheService = TestBed.get(ListCacheService);

        expect(listCacheService.getList).toHaveBeenCalledTimes(1);
        expect(listCacheService.getList).toHaveBeenCalledWith('http://rdfh.ch/lists/0001/treeList');
    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <list-value #listVal [formGroup]="form" [property]="property"></list-value>`
})
class TestHostComponent implements OnInit {

    form;
    property: Property;

    @ViewChild('listVal') listValue: ListValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

        this.property = new Property(
            'http://0.0.0.0:3333/ontology/0001/anything/v2#hasListItem',
            'http://api.knora.org/ontology/knora-api/v2#ListValue',
            undefined,
            'Text',
            ['http://api.knora.org/ontology/knora-api/v2#hasValue'],
            true,
            false,
            false,
            ['hlist=<http://rdfh.ch/lists/0001/treeList>']
        );
    }
}
