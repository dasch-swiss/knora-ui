import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    ProgressIndicatorComponent
} from './progress-indicator.component';
import {
    MatIconModule
} from '@angular/material';

describe('ProgressIndicatorComponent', () => {
    let component: ProgressIndicatorComponent;
    let fixture: ComponentFixture < ProgressIndicatorComponent > ;

    beforeEach(async (() => {
        TestBed.configureTestingModule({
                imports: [
                    MatIconModule
                ],
                declarations: [
                    ProgressIndicatorComponent
                ]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProgressIndicatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

  it('should create', () => {
        expect(component).toBeDefined();
        expect(component).toBeTruthy();
    });

});
