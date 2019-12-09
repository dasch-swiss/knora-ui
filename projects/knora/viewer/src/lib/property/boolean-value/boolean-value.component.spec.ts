import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { ReadBooleanValue } from '@knora/api';
import { MatCheckbox, MatCheckboxModule } from '@angular/material/checkbox';
import { By } from '@angular/platform-browser';

import { BooleanValueComponent } from './boolean-value.component';

/**
 * Test host component to simulate parent component.
 */
@Component({
    template: `<kui-boolean-value #boolVal [valueObject]="boolValue"></kui-boolean-value>`
})
class TestHostComponent implements OnInit {

    @ViewChild('boolVal', { static: false }) booleanValueComponent: BooleanValueComponent;

    boolValue;

    constructor() {
    }

    ngOnInit() {
        this.boolValue = new ReadBooleanValue();
        this.boolValue.bool = true;
    }
}

describe('BooleanValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatCheckboxModule
            ],
            declarations: [
                BooleanValueComponent,
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
        expect(testHostComponent.booleanValueComponent).toBeTruthy();
    });

    it('should be read-only in template', () => {
        const hostCompDe = testHostFixture.debugElement;

        const matCheckBoxDebugElement: DebugElement = hostCompDe.query(By.directive(MatCheckbox));

        expect(matCheckBoxDebugElement.componentInstance.disabled).toBe(true);
    });

    it('should contain a boolean value that is true', () => {
        expect(testHostComponent.booleanValueComponent.valueObject.bool).toBe(true);

        const hostCompDe = testHostFixture.debugElement;

        const boolVal = hostCompDe.query(By.directive(BooleanValueComponent));

        const matCheckBoxDebugElement: DebugElement = boolVal.query(By.directive(MatCheckbox));

        expect(matCheckBoxDebugElement.componentInstance.checked).toBe(true);
    });

    it('should contain a boolean value that is false', () => {

        testHostComponent.boolValue = new ReadBooleanValue();
        testHostComponent.boolValue.bool = false;

        testHostFixture.detectChanges();

        expect(testHostComponent.booleanValueComponent.valueObject.bool).toBe(false);

        const hostCompDe = testHostFixture.debugElement;

        const boolVal = hostCompDe.query(By.directive(BooleanValueComponent));

        const matCheckBoxDebugElement: DebugElement = boolVal.query(By.directive(MatCheckbox));

        expect(matCheckBoxDebugElement.componentInstance.checked).toBe(false);
    });

});
