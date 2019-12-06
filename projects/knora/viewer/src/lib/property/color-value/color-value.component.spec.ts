import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadColorValue } from '@knora/api';
import { By } from '@angular/platform-browser';

import { ColorValueComponent } from './color-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `<kui-color-value #colorVal [valueObject]="colorValue"></kui-color-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('colorVal', { static: false }) colorValueComponent: ColorValueComponent;

    colorValue;

    constructor() {
    }

    ngOnInit() {
        this.colorValue = new ReadColorValue();
        this.colorValue.color = '#f0f0f0';
    }
}

describe('ColorValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
            ],
            declarations: [ColorValueComponent, TestHostComponent]
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
        expect(testHostComponent.colorValueComponent).toBeTruthy();
    });

    it('should contain a color value like #f0f0f0', () => {
        expect(testHostComponent.colorValueComponent.valueObject.color).toEqual('#f0f0f0');

        const hostCompDe = testHostFixture.debugElement;

        const colorVal = hostCompDe.query(By.directive(ColorValueComponent));

        const spanDebugElement: DebugElement = colorVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        const styleAttribute = spanNativeElement.getAttribute('style');

        expect(styleAttribute).toEqual('background-color: rgb(240, 240, 240);');

        expect(spanNativeElement.innerText).toEqual('#f0f0f0');
    });

    it('should contain a color value like #e5e5e5', () => {
        testHostComponent.colorValue = new ReadColorValue();
        testHostComponent.colorValue.color = '#e5e5e5';

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const colorVal = hostCompDe.query(By.directive(ColorValueComponent));

        const spanDebugElement: DebugElement = colorVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        const styleAttribute = spanNativeElement.getAttribute('style');

        expect(styleAttribute).toEqual('background-color: rgb(229, 229, 229);');

        expect(spanNativeElement.innerText).toEqual('#e5e5e5');

    });
});
