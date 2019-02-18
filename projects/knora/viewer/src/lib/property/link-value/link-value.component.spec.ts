import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkValueComponent } from './link-value.component';
import { OntologyInformation, ReadLinkValue, ResourceClass, ResourceClassIrisForOntology, ResourceClasses, ReadResource } from '@knora/core';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

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
        expect(testHostComponent.linkValueComponent.valueObject.referredResourceIri).toEqual('http://rdfh.ch/test');

        const hostCompDe = testHostFixture.debugElement;

        const linkVal = hostCompDe.query(By.directive(LinkValueComponent));

        const spanDebugElement: DebugElement = linkVal.query(By.css('a'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('http://rdfh.ch/test');

        expect(spanNativeElement.getAttribute('class')).toEqual('salsah-link');

        spanNativeElement.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.refResClickedIri).toEqual('http://rdfh.ch/test');
    });

    it('should display the referred resource\'s label', () => {

        const referredResource = new ReadResource(
            'http://rdfh.ch/test',
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
            'test book label',
            [],
            [],
            [],
            [],
            {}
        );

        const resClassesForOnto: ResourceClassIrisForOntology = {
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2': [
                'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book'
            ]
        };

        const resClasses: ResourceClasses = {
            'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book':
                new ResourceClass(
                    'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book',
                    'book.png',
                    'A book.',
                    'book',
                    []
                )
        };

        const ontoInfo = new OntologyInformation(resClassesForOnto, resClasses, {});

        const linkValue = new ReadLinkValue('id', 'propIri', 'http://rdfh.ch/test', referredResource);

        testHostComponent.ontoInfo = ontoInfo;
        testHostComponent.linkValue = linkValue;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const linkVal = hostCompDe.query(By.directive(LinkValueComponent));

        const spanDebugElement: DebugElement = linkVal.query(By.css('a'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('test book label');

        expect(spanNativeElement.getAttribute('class')).toEqual('salsah-link');

        spanNativeElement.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.refResClickedIri).toEqual('http://rdfh.ch/test');

    });

});

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-link-value #linkVal [valueObject]="linkValue" [ontologyInfo]="ontoInfo" (referredResourceClicked)="refResClicked($event)"></kui-link-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('linkVal') linkValueComponent: LinkValueComponent;

    linkValue;
    ontoInfo;

    refResClickedIri: string;

    constructor() {
    }

    refResClicked(linkValue: ReadLinkValue) {
        this.refResClickedIri = linkValue.referredResourceIri;
    }

    ngOnInit() {
        this.linkValue = new ReadLinkValue('id', 'propIri', 'http://rdfh.ch/test');
    }
}
