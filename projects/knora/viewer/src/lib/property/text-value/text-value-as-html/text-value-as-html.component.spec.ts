import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextValueAsHtmlComponent } from './text-value-as-html.component';
import {
    OntologyInformation,
    ReadResource,
    ReadTextValueAsHtml,
    ReferredResourcesByStandoffLink,
    ResourceClass,
    ResourceClasses,
    ResourceClassIrisForOntology
} from '@knora/core';
import { Component, DebugElement, OnInit, ViewChild, } from '@angular/core';
import { By } from '@angular/platform-browser';

fdescribe('TextValueAsHtmlComponent', () => {
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
        expect(testHostComponent.htmlValueComponent.valueObject.html).toEqual('<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="salsah-link">link</a></p>');

        const hostCompDe = testHostFixture.debugElement;

        const htmlVal = hostCompDe.query(By.directive(TextValueAsHtmlComponent));

        const divDebugElement: DebugElement = htmlVal.query(By.css('div'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="salsah-link">link</a></p>');
    });

    it('should display the referred resources by standoff link', () => {

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

        testHostComponent.ontoInfo = ontoInfo;

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const htmlVal = hostCompDe.query(By.directive(TextValueAsHtmlComponent));

        const divDebugElement: DebugElement = htmlVal.query(By.css('div'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="salsah-link">link</a></p>');

        const text = testHostFixture.nativeElement.querySelector('.salsah-link');

        expect(text.getAttribute('class')).toEqual('salsah-link');

        text.click();

        testHostFixture.detectChanges();

        expect(testHostComponent.refResClickedIri).toEqual('http://rdfh.ch/c9824353ae06');

    });

});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-text-value-as-html #htmlVal [valueObject]="htmlValue" [ontologyInfo]="ontoInfo" [bindEvents]="bindEvents" (referredResourceClicked)="refResClicked($event)"></kui-text-value-as-html>`
})
class TestHostComponent implements OnInit {

    @ViewChild('htmlVal') htmlValueComponent: TextValueAsHtmlComponent;

    htmlValue;
    ontoInfo;
    bindEvents = true;
    referredResource = new ReadResource('http://rdfh.ch/c9824353ae06', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book', 'Holzschnitt', [], [], [], [], {});
    referredResources: ReferredResourcesByStandoffLink = { 'http://rdfh.ch/c9824353ae06': this.referredResource };
    refResClickedIri: string;

    constructor() {
    }

    ngOnInit() {
        this.htmlValue = new ReadTextValueAsHtml('id', 'propIri', '<p>This is a very simple HTML document with a <a href="http://rdfh.ch/c9824353ae06" class="salsah-link">link</a></p>', this.referredResources);
    }

    refResClicked(refResIri: string) {
        this.refResClickedIri = refResIri;
    }
}
