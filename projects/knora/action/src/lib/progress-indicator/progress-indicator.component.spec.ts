import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProgressIndicatorComponent } from './progress-indicator.component';
import { MatIconModule } from '@angular/material';
import { Component, DebugElement, OnInit, ViewChild } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('ProgressIndicatorComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule
            ],
            declarations: [
                ProgressIndicatorComponent,
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
        expect(testHostComponent.progressIndicatorComponent).toBeTruthy();
    });

    it('should display a red spinner as progress indicator', () => {
        expect(testHostComponent.progressIndicatorComponent).toBeTruthy();
        expect(testHostComponent.progressIndicatorComponent.color).toEqual('red');
        expect(testHostComponent.progressIndicatorComponent.status).toEqual(0);

        const hostCompDe = testHostFixture.debugElement;

        const progressEl = hostCompDe.query(By.directive(ProgressIndicatorComponent));

        const divProgressElement = progressEl.query(By.css('.kui-progress-indicator'));

        const submitEl = divProgressElement.query(By.css('div'));

        const spinnerEl = submitEl.query(By.css('div'));

        expect(spinnerEl.styles).toEqual({ 'border-top-color': 'red', 'border-left-color': 'red' });

    });

    it('should change the color of the progress indicator from red to blue', () => {
        expect(testHostComponent.progressIndicatorComponent).toBeTruthy();
        expect(testHostComponent.progressIndicatorComponent.color).toEqual('red');
        expect(testHostComponent.progressIndicatorComponent.status).toEqual(0);

        const hostCompDe = testHostFixture.debugElement;

        const progressEl = hostCompDe.query(By.directive(ProgressIndicatorComponent));

        const divProgressElement = progressEl.query(By.css('.kui-progress-indicator'));

        const submitEl = divProgressElement.query(By.css('div'));

        const spinnerEl = submitEl.query(By.css('div'));

        expect(spinnerEl.styles).toEqual({ 'border-top-color': 'red', 'border-left-color': 'red' });

        // change the color of the spinner
        testHostComponent.progressIndicatorComponent.color = 'blue';

        testHostFixture.detectChanges();

        // expect the spinner to be blue
        expect(spinnerEl.styles).toEqual({ 'border-top-color': 'blue', 'border-left-color': 'blue' });
        expect(spinnerEl.styles).toEqual({ 'border-top-color': 'blue', 'border-left-color': 'blue' });
    });

    it('should update the progress indicator according to the status value', () => {
        expect(testHostComponent.progressIndicatorComponent).toBeTruthy();
        expect(testHostComponent.progressIndicatorComponent.color).toEqual('red');
        expect(testHostComponent.progressIndicatorComponent.status).toEqual(0);

        const hostCompDe = testHostFixture.debugElement;

        const progressEl = hostCompDe.query(By.directive(ProgressIndicatorComponent));

        const divProgressElement = progressEl.query(By.css('.kui-progress-indicator'));

        const submitEl = divProgressElement.query(By.css('div'));

        const spinnerEl = submitEl.query(By.css('div'));

        expect(spinnerEl.attributes.class).toEqual('spinner');

        // update status value to 1
        testHostComponent.progressIndicatorComponent.status = 1;

        testHostFixture.detectChanges();

        const divEl = divProgressElement.query(By.css('div'));

        const matIconEl = divProgressElement.query(By.css('mat-icon'));

        // new status: done
        expect(matIconEl.attributes.class).toBe('after-submit mat-icon notranslate');
        expect(matIconEl.nativeElement.innerText).toEqual('done');
        expect(matIconEl.styles.color).toEqual('red');
    });

    it('should display the default progress indicator when the status is undefined', () => {
        expect(testHostComponent.progressIndicatorComponent).toBeTruthy();
        expect(testHostComponent.progressIndicatorComponent.color).toEqual('red');
        expect(testHostComponent.progressIndicatorComponent.status).toEqual(0);

        // change the status to undefined
        testHostComponent.progressIndicatorComponent.status = undefined;

        expect(testHostComponent.progressIndicatorComponent.status).toBe(undefined);

        testHostFixture.detectChanges();

        const hostCompDe = testHostFixture.debugElement;

        const progressEl = hostCompDe.query(By.directive(ProgressIndicatorComponent));

        const divProgressElement = progressEl.query(By.css('.kui-progress-indicator'));

        const lineEl = divProgressElement.query(By.css('.line'));

        const bounceEl = lineEl.query(By.css('div'));

        // expect the default progress indicator
        expect(bounceEl.styles).toEqual({ 'background-color': 'red' });
        expect(bounceEl.attributes.class).toEqual('bounce1');

    });

});

/**
 * Test host component to simulate parent component with a progress bar.
 */
@Component({
    template: `
        <kui-progress-indicator #progressIndicator [status]="status" [color]="color"></kui-progress-indicator>`
})
class TestHostComponent implements OnInit {

    @ViewChild('progressIndicator') progressIndicatorComponent: ProgressIndicatorComponent;

    status = 0;
    color: string = 'red';

    constructor() {
    }

    ngOnInit() { }
}
