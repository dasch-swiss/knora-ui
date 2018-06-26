import {
    async,
    ComponentFixture,
    TestBed
} from '@angular/core/testing';

import {
    SortButtonComponent
} from './sort-button.component';
import {
    MatMenuModule,
    MatIconModule
} from '@angular/material';

describe('SortButtonComponent', () => {
    let component: SortButtonComponent;
    let fixture: ComponentFixture < SortButtonComponent > ;

    beforeEach(async (() => {
        TestBed.configureTestingModule({
                imports: [
                    MatIconModule,
                    MatMenuModule
                ],
                declarations: [
                    SortButtonComponent
                ]
            })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SortButtonComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
