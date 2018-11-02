import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkValueComponent } from './link-value.component';
import { KnoraConstants, OntologyInformation, ReadLinkValue } from '@knora/core';
import { Component, OnInit, ViewChild } from '@angular/core';

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
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-link-value #linkVal [valueObject]="linkValue"></kui-link-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('linkVal') linkValueComponent: LinkValueComponent;

    linkValue;

    constructor() {
    }

    ngOnInit() {
        this.linkValue = new ReadLinkValue('id', 'propIri', 'iri');
    }
}
