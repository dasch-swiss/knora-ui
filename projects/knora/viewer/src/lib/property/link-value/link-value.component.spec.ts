import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ReadLinkValue, ReadResource } from '@knora/api';

import { LinkValueComponent } from './link-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-link-value #linkVal [valueObject]="linkValue" (referredResourceClicked)="refResClicked($event)"></kui-link-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('linkVal', { static: false }) linkValueComponent: LinkValueComponent;

    linkValue: ReadLinkValue;

    readResource = new ReadResource();
    refResClickedIri: string;

    constructor() {
    }

    refResClicked(linkValue: ReadLinkValue) {
        this.refResClickedIri = linkValue.linkedResourceIri;
    }

    ngOnInit() {
        this.linkValue = new ReadLinkValue();
        this.linkValue.linkedResourceIri = 'http://rdfh.ch/test';

        this.readResource.id = 'http://rdfh.ch/test';
        this.readResource.label = 'test book label';
    }
}

describe('LinkValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [LinkValueComponent, TestHostComponent],
            providers: [
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
        expect(testHostComponent.linkValueComponent).toBeTruthy();
    });

    it('should display the referred resource\'s Iri', () => {
        expect(testHostComponent.linkValueComponent.valueObject.linkedResourceIri).toEqual('http://rdfh.ch/test');

        const hostCompDe = testHostFixture.debugElement;

        const linkVal = hostCompDe.query(By.directive(LinkValueComponent));

        const spanDebugElement: DebugElement = linkVal.query(By.css('a'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('http://rdfh.ch/test');

        expect(spanNativeElement.getAttribute('class')).toEqual('kui-link');

        spanNativeElement.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.refResClickedIri).toEqual('http://rdfh.ch/test');
    });

    it('should display the referred resource\'s label', () => {

        const referredResource = new ReadResource();
        referredResource.id = 'http://rdfh.ch/test2';
        referredResource.label = 'test book label';

        testHostComponent.linkValue = new ReadLinkValue();
        testHostComponent.linkValue.linkedResourceIri = 'http://rdfh.ch/test2';
        testHostComponent.linkValue.linkedResource = referredResource;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const linkVal = hostCompDe.query(By.directive(LinkValueComponent));

        const spanDebugElement: DebugElement = linkVal.query(By.css('a'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('test book label');

        expect(spanNativeElement.getAttribute('class')).toEqual('kui-link');

        spanNativeElement.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.refResClickedIri).toEqual('http://rdfh.ch/test2');

    });

});
