import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UriValueComponent } from './uri-value.component';
import { Component, OnInit, ViewChild, DebugElement } from '@angular/core';
import { ReadUriValue } from '@knora/core';
import { By } from '@angular/platform-browser';

fdescribe('UriValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [UriValueComponent, TestHostComponent]
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
        expect(testHostComponent.uriValueComponent).toBeTruthy();
    });

    it('should be equal to the uri value http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg', () => {
        expect(testHostComponent.uriValueComponent.valueObject.uri).toEqual('http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');

        const hostCompDe = testHostFixture.debugElement;

        const uriVal = hostCompDe.query(By.directive(UriValueComponent));

        const spanDebugElement: DebugElement = uriVal.query(By.css('a'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        const hrefAttribute = spanNativeElement.getAttribute('href');

        expect(spanNativeElement.innerText).toEqual('http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');

        expect(hrefAttribute).toEqual('http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
    });

    it('should be equal to the uri value http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g', () => {
        testHostComponent.uriValue = new ReadUriValue('id', 'propIri', 'http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const uriVal = hostCompDe.query(By.directive(UriValueComponent));

        const spanDebugElement: DebugElement = uriVal.query(By.css('a'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        const hrefAttribute = spanNativeElement.getAttribute('href');

        expect(spanNativeElement.innerText).toEqual('http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');

        expect(hrefAttribute).toEqual('http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');
    });
});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-uri-value #uriVal [valueObject]="uriValue"></kui-uri-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('uriVal') uriValueComponent: UriValueComponent;

    uriValue;

    constructor() {
    }

    ngOnInit() {
        this.uriValue = new ReadUriValue('id', 'propIri', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
    }
}
