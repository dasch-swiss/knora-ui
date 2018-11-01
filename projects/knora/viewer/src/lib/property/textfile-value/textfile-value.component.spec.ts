import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TextfileValueComponent } from './textfile-value.component';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadTextFileValue } from '@knora/core';
import { By } from '@angular/platform-browser';

fdescribe('TextfileValueComponent', () => {
  let testHostComponent: TestHostComponent;
  let testHostFixture: ComponentFixture<TestHostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TextfileValueComponent, TestHostComponent]
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
    expect(testHostComponent.textfileValueComponent).toBeTruthy();
  });

  it('should contain the filename "TextFileName" and the urlname "http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg"', () => {
    expect(testHostComponent.textfileValueComponent.valueObject.textFilename).toEqual('TextFileName');
    expect(testHostComponent.textfileValueComponent.valueObject.textFileURL).toEqual('http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');

    const hostCompDe = testHostFixture.debugElement;

    const textfileVal = hostCompDe.query(By.directive(TextfileValueComponent));

    const spanDebugElement: DebugElement = textfileVal.query(By.css('a'));

    const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

    const hrefAttribute = spanNativeElement.getAttribute('href');

    expect(spanNativeElement.innerText).toEqual('TextFileName');

    expect(hrefAttribute).toEqual('http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');

  });

  it('should contain the filename "PDF_23984ujfosij" and the url "http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g"', () => {
    testHostComponent.textfileValue = new ReadTextFileValue('id', 'propIri', 'PDF_23984ujfosij', 'http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');

    testHostFixture.detectChanges();

    const hostCompDe = testHostFixture.debugElement;

    const textfileVal = hostCompDe.query(By.directive(TextfileValueComponent));

    const spanDebugElement: DebugElement = textfileVal.query(By.css('a'));

    const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

    const hrefAttribute = spanNativeElement.getAttribute('href');

    expect(spanNativeElement.innerText).toEqual('PDF_23984ujfosij');

    expect(hrefAttribute).toEqual('http://rdfh.ch/0801/-kjdnfg98dfgihu9erg9g');
  });

});


/**
 * Test host component to simulate parent component.
 */
@Component({
  template: `
      <kui-textfile-value #textfileVal [valueObject]="textfileValue"></kui-textfile-value>`
})
class TestHostComponent implements OnInit {

  @ViewChild('textfileVal') textfileValueComponent: TextfileValueComponent;

  textfileValue;

  constructor() {
  }

  ngOnInit() {
    this.textfileValue = new ReadTextFileValue('id', 'propIri', 'TextFileName', 'http://rdfh.ch/0801/-w3yv1iZT22qEe6GM4S4Hg');
  }
}
