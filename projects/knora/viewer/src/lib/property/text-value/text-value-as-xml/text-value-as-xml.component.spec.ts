import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TextValueAsXmlComponent } from './text-value-as-xml.component';
import { ReadTextValueAsXml } from '@knora/core';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('TextValueAsXmlComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [TextValueAsXmlComponent, TestHostComponent]
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
        expect(testHostComponent.xmlValueComponent).toBeTruthy();
    });

    it('should contain xml', () => {
        expect(testHostComponent.xmlValueComponent.valueObject.xml).toEqual('<?xml version="1.0" encoding="UTF-8"?> <text>Ich liebe die <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">Dinge</a>, sie sind alles für mich.</text>');

        const hostCompDe = testHostFixture.debugElement;

        const decimalVal = hostCompDe.query(By.directive(TextValueAsXmlComponent));

        const spanDebugElement: DebugElement = decimalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('<?xml version="1.0" encoding="UTF-8"?> <text>Ich liebe die <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">Dinge</a>, sie sind alles für mich.</text>');
    });

    it('should contain a new xml', () => {
        testHostComponent.xmlValue = new ReadTextValueAsXml('id', 'propIri', '<?xml version="1.0" encoding="UTF-8"?> <text>I like this <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">thing</a>, everything belongs to my grandma.</text>', 'http://rdfh.ch/0801/-dfgoij98duger8zt4');

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const decimalVal = hostCompDe.query(By.directive(TextValueAsXmlComponent));

        const spanDebugElement: DebugElement = decimalVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('<?xml version="1.0" encoding="UTF-8"?> <text>I like this <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">thing</a>, everything belongs to my grandma.</text>');
    });
});


/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
        <kui-text-value-as-xml #xmlVal [valueObject]="xmlValue"></kui-text-value-as-xml>`
})
class TestHostComponent implements OnInit {

    @ViewChild('xmlVal', { static: false }) xmlValueComponent: TextValueAsXmlComponent;

    xmlValue;

    constructor() {
    }

    ngOnInit() {
        this.xmlValue = new ReadTextValueAsXml('id', 'propIri', '<?xml version="1.0" encoding="UTF-8"?> <text>Ich liebe die <a href="http://rdfh.ch/0001/a-thing" class="salsah-link">Dinge</a>, sie sind alles für mich.</text>', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
    }
}
