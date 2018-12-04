import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortButtonComponent } from './sort-button.component';
import { MatIconModule, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { Component, DebugElement, OnInit, ViewChild, } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('SortButtonComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule,
                MatMenuModule,
                BrowserAnimationsModule
            ],
            declarations: [SortButtonComponent, TestHostComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should create an instance', () => {
        expect(testHostComponent.sortButtonComponent).toBeTruthy();
    });

    it('should sort the list by lastname', () => {
        expect(testHostComponent.sortButtonComponent).toBeTruthy();
        expect(testHostComponent.sortKey).toBe('creator');

        const hostCompDe = testHostFixture.debugElement;

        const sortBtnEl = hostCompDe.query(By.directive(SortButtonComponent));

        const spanEl: DebugElement = hostCompDe.query(By.css('span'));

        // expect the button position to be 'right'
        expect(spanEl.properties).toEqual({ 'className': 'left' });

        const sortSelectionBtnEl: DebugElement = spanEl.query(By.css('button'));

        const matIconEl: DebugElement = sortSelectionBtnEl.query(By.css('mat-icon'));

        // expect that the button label is 'sort'
        expect(matIconEl.nativeElement.innerText).toEqual('sort');

        // click on the sort button to trigger the sort selection menu
        sortSelectionBtnEl.triggerEventHandler('click', null);

        const matMenuEl = spanEl.query(By.css('mat-menu'));

        const sortSelectionEl = matMenuEl.references.sortSelection;

        // expect that items's names of the sort list are 'Prename', 'Last name' and 'Creator'
        expect(sortSelectionEl._items[0]._elementRef.nativeElement.innerText).toEqual('Prename');
        expect(sortSelectionEl._items[1]._elementRef.nativeElement.innerText).toEqual('Last name');
        expect(sortSelectionEl._items[2]._elementRef.nativeElement.innerText).toEqual('Creator');

        // sort by 'lastname' through a click event
        const item2 = sortSelectionEl._items[1]._elementRef.nativeElement;
        item2.click();
        testHostFixture.detectChanges();

        // expect the sort key to be 'lastname'
        expect(testHostComponent.sortKey).toBe('lastname');
    });
});

/**
 * Test host component to simulate parent component with a progress bar.
 */
@Component({
    template: `
    <kui-sort-button #sortButton [sortProps]="sortProps" [(sortKey)]="sortKey" [position]="position">
    </kui-sort-button>`
})
class TestHostComponent implements OnInit {

    @ViewChild('sortButton') sortButtonComponent: SortButtonComponent;

    sortProps: any = [{
        key: 'prename',
        label: 'Prename'
    },
    {
        key: 'lastname',
        label: 'Last name'
    },
    {
        key: 'creator',
        label: 'Creator'
    }
    ];
    sortKey: string = 'creator';
    position: string = 'left';

    constructor() {
    }

    ngOnInit() { }
}
