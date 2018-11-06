import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextValueAsHtmlComponent } from './text-value-as-html.component';
import { OntologyInformation, ReadResource, ReadTextValueAsHtml, ReferredResourcesByStandoffLink } from '@knora/core';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
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
        expect(testHostComponent.htmlValueComponent.valueObject.html).toEqual('Html text');

        const hostCompDe = testHostFixture.debugElement;

        const htmlVal = hostCompDe.query(By.directive(TextValueAsHtmlComponent));

        const divDebugElement: DebugElement = htmlVal.query(By.css('div'));

        const spanNativeElement: HTMLElement = divDebugElement.nativeElement;
        console.log(spanNativeElement);

        expect(spanNativeElement.innerText).toEqual('Html text');
    });

    it('should display the referred resources by standoff link', () => {

    });

});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-text-value-as-html #htmlVal [valueObject]="htmlValue" [ontologyInfo]="ontoInfo" [bindEvents]="bindEvents"></kui-text-value-as-html>`
})
class TestHostComponent implements OnInit {

    @ViewChild('htmlVal') htmlValueComponent: TextValueAsHtmlComponent;

    htmlValue;
    ontoInfo;
    bindEvents;
    referredResource = new ReadResource('http://rdfh.ch/c9824353ae06', 'http://0.0.0.0:3333/ontology/0803/incunabula/v2#book', 'Holzschnitt', [], [], [], [], {});
    referredResources: ReferredResourcesByStandoffLink = { 'http://rdfh.ch/c9824353ae06': this.referredResource };

    constructor() {
    }

    ngOnInit() {
        this.htmlValue = new ReadTextValueAsHtml('id', 'propIri', 'Html text', this.referredResources);
    }
}
