import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListDisplayComponent } from './list-display.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ListNodeV2 } from '@knora/core';
import { MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { By } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ListDisplayComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ListDisplayComponent,
                TestHostComponent
            ],
            imports: [
                MatMenuModule,
                BrowserAnimationsModule
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
        // access the test host component's child
        expect(testHostComponent.childMenu).toBeTruthy();
    });

    it('should open the menu for child nodes', () => {

        const ele: DebugElement = testHostFixture.debugElement;

        ele.nativeElement.click();

        testHostFixture.detectChanges();

        const openListButtonDe = ele.query(By.css('button'));

        const openListButtonEle: HTMLElement = openListButtonDe.nativeElement;

        openListButtonEle.click();

        testHostFixture.detectChanges();

        const listNodeEle = ele.query(By.css('.mat-menu-content button'));

        // select root node
        listNodeEle.nativeElement.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.selectedNode.id).toEqual('http://rdfh.ch/lists/0001/treeList');

    });
});


/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
    <button mat-stroked-button [matMenuTriggerFor]="mainMenu" type="button">
        <span *ngIf="!selectedNode">Select list value</span>
        <span *ngIf="selectedNode">{{selectedNode.label}}</span>
    </button>
        
    <mat-menu #mainMenu="matMenu" [overlapTrigger]="false">
        <button mat-menu-item [matMenuTriggerFor]="childMenu" (click)="getSelectedNode(testList)"
                type="button">
            {{testList.label}}
        </button>
        
        <mat-menu #childMenu="matMenu" [overlapTrigger]="false">
            <span *ngFor="let child of children">
                <span *ngIf="child.children && child.children.length > 0">
                    <button mat-menu-item [matMenuTriggerFor]="menu.childMenu" (click)="setValue(child)" type="button">
                        {{child.label}}
                    </button>
                    <list-display #menu [children]="child.children" (selectedNode)="setValue($event)"></list-display>
                </span>
        
                <span *ngIf="!child.children || child.children.length === 0">
                    <button mat-menu-item (click)="setValue(child)" type="button">
                        {{child.label}}
                    </button>
                </span>
            </span>
        </mat-menu>

    </mat-menu>`
})
class TestHostComponent implements OnInit {

    testList;

    selectedNode: ListNodeV2;

    children: ListNodeV2[];

    @ViewChild(MatMenuTrigger, { static: false }) menuTrigger: MatMenuTrigger;

    @ViewChild('childMenu', { static: true }) public childMenu: MatMenuTrigger;

    constructor() {
    }

    getSelectedNode(item: ListNodeV2) {
        this.menuTrigger.closeMenu();
        this.selectedNode = item;
    }

    ngOnInit() {

        const testList = new ListNodeV2(
            'http://rdfh.ch/lists/0001/treeList',
            'tree list'
        );

        const testListChild1 = new ListNodeV2(
            'http://rdfh.ch/lists/0001/treeList/01',
            'tree list 01',
            1,
            'http://rdfh.ch/lists/0001/treeList'
        );

        const testListChild2 = new ListNodeV2(
            'http://rdfh.ch/lists/0001/treeList/02',
            'tree list 02',
            2,
            'http://rdfh.ch/lists/0001/treeList'
        );

        testListChild1.children.push(testListChild2);

        testList.children.push(testListChild1);

        this.testList = testList;
    }
}
