import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionDemoComponent} from './action-demo.component';

describe('ActionDemoComponent', () => {
    let component: ActionDemoComponent;
    let fixture: ComponentFixture<ActionDemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ActionDemoComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ActionDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
