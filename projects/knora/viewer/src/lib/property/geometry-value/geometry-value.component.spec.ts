import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReadGeomValue } from '@knora/core';

import { GeometryValueComponent } from './geometry-value.component';

describe('GeometryValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [],
            declarations: [GeometryValueComponent, TestHostComponent]
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
        expect(testHostComponent.geometryValueComponent).toBeTruthy();
    });

    it('should contain a rectangle geomtric shape', () => {
        expect(testHostComponent.geometryValueComponent.valueObject.geometryString).toEqual('{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.17296511627906977,"y":0.08226691042047532},{"x":0.7122093023255814,"y":0.16544789762340037}],"type":"rectangle","original_index":1}');

        const hostCompDe = testHostFixture.debugElement;

        const geomVal = hostCompDe.query(By.directive(GeometryValueComponent));

        const spanDebugElement: DebugElement = geomVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.17296511627906977,"y":0.08226691042047532},{"x":0.7122093023255814,"y":0.16544789762340037}],"type":"rectangle","original_index":1}');

    });

    it('should contain a square geomtric shape', () => {
        testHostComponent.geometryValue = new ReadGeomValue('id', 'propIri', '{"status":"active","lineColor":"#cc0066","lineWidth":2,"points":[{"x":0.17296511627906977,"y":0.08226691042047532},{"x":0.7122093023255814,"y":0.16544789762340037}],"type":"square","original_index":1}');

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const geomVal = hostCompDe.query(By.directive(GeometryValueComponent));

        const spanDebugElement: DebugElement = geomVal.query(By.css('span'));

        const spanNativeElement: HTMLElement = spanDebugElement.nativeElement;

        expect(spanNativeElement.innerText).toEqual('{"status":"active","lineColor":"#cc0066","lineWidth":2,"points":[{"x":0.17296511627906977,"y":0.08226691042047532},{"x":0.7122093023255814,"y":0.16544789762340037}],"type":"square","original_index":1}');

    });

});

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `
<kui-geometry-value #geometryVal [valueObject]="geometryValue"></kui-geometry-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('geometryVal', { static: false }) geometryValueComponent: GeometryValueComponent;

    geometryValue;

    constructor() {
    }

    ngOnInit() {
        this.geometryValue = new ReadGeomValue('id', 'propIri', '{"status":"active","lineColor":"#ff3333","lineWidth":2,"points":[{"x":0.17296511627906977,"y":0.08226691042047532},{"x":0.7122093023255814,"y":0.16544789762340037}],"type":"rectangle","original_index":1}');
    }
}
