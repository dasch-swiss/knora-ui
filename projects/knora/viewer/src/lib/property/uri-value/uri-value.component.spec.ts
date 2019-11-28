import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UriValueComponent } from './uri-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadUriValue } from '@knora/core';
import { By } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatInputModule } from '@angular/material/input';
import { UriElementComponent } from '../../element/uri-element/uri-element.component';

describe('UriValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                BrowserAnimationsModule,
                MatInputModule],
            declarations: [UriValueComponent, TestHostComponent, UriElementComponent]
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

        expect(testHostComponent.uriValueComponent.uriValueElement.eleVal).toEqual('http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');

    });

    // the new uri has been made up!!
    it('should be equal to the uri value http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g', () => {
        testHostComponent.uriValue = new ReadUriValue('id', 'propIri', 'http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');

        testHostFixture.detectChanges();

        expect(testHostComponent.uriValueComponent.uriValueElement.eleVal).toEqual('http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');

    });
    // the new uri with label has been made up!!
    it('should be equal to the label value MyLabel', () => {
        testHostComponent.uriValue = new ReadUriValue('id', 'propIri', 'http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');
        testHostComponent.label = 'MyLabel';
        testHostFixture.detectChanges();

        expect(testHostComponent.uriValueComponent.uriValueElement.eleVal).toEqual('http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');

        expect(testHostComponent.uriValueComponent.uriValueElement.label).toEqual('MyLabel');
    });
});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-uri-value #uriVal [valueObject]="uriValue" [label]="label"></kui-uri-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('uriVal', { static: false }) uriValueComponent: UriValueComponent;

    uriValue;
    label;

    constructor() {
    }

    ngOnInit() {
        this.uriValue = new ReadUriValue('id', 'propIri', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
    }
}
