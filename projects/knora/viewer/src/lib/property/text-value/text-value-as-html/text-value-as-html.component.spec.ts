import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReadResource, ReadTextValueAsHtml } from '@knora/api';

import { TextValueAsHtmlComponent } from './text-value-as-html.component';

export class ReferredResourcesByStandoffLink {
    [index: string]: ReadResource;
}

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-text-value-as-html #htmlVal [valueObject]="htmlValue" [bindEvents]="bindEvents" (referredResourceClicked)="refResClicked($event)"></kui-text-value-as-html>`
})
class TestHostComponent implements OnInit {

    @ViewChild('htmlVal', { static: false }) htmlValueComponent: TextValueAsHtmlComponent;

    htmlValue;
    bindEvents = true;
    referredResources: ReferredResourcesByStandoffLink;
    refResClickedIri: string;

    constructor() {
    }

    ngOnInit() {
        this.htmlValue = new ReadTextValueAsHtml();
        this.htmlValue.html = '<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="kui-link">link</a></p>';

        this.htmlValue.referredResource = new ReadResource();
        this.htmlValue.referredResource.id = 'http://rdfh.ch/c9824353ae06';
        this.htmlValue.referredResource.label = 'Holzschnitt';
    }

    refResClicked(refResIri: string) {
        this.refResClickedIri = refResIri;
    }
}


describe('TextValueAsHtmlComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [
                TextValueAsHtmlComponent,
                TestHostComponent
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
        expect(testHostComponent.htmlValueComponent).toBeTruthy();
    });

    it('should contain html', () => {
        expect(testHostComponent.htmlValueComponent.valueObject.html).toEqual('<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="kui-link">link</a></p>');

        const hostCompDe = testHostFixture.debugElement;

        const htmlVal = hostCompDe.query(By.directive(TextValueAsHtmlComponent));

        const divDebugElement: DebugElement = htmlVal.query(By.css('div'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="kui-link">link</a></p>');
    });

    it('should display the referred resources by standoff link', () => {

        // TODO: fix the test with the MockFactory from knora/api lib

        /* const resClassesForOnto: ResourceClassIrisForOntology = {
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
                    [],
                    []
                )
        }; */

        // const ontoInfo = new OntologyInformation(resClassesForOnto, resClasses, {});

        // testHostComponent.ontoInfo = ontoInfo;
        expect(testHostComponent.htmlValueComponent.valueObject.html).toEqual('<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="kui-link">link</a></p>');

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const htmlVal = hostCompDe.query(By.directive(TextValueAsHtmlComponent));

        const divDebugElement: DebugElement = htmlVal.query(By.css('div'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="kui-link">link</a></p>');

        const text = testHostFixture.nativeElement.querySelector('.kui-link');

        expect(text.getAttribute('class')).toEqual('kui-link');

        /* text.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.refResClickedIri).toEqual('http://rdfh.ch/c9824353ae06'); */

    });

});
