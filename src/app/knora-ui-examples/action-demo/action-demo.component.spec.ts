import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ActionDemoComponent} from './action-demo.component';
import {ModuleHeaderComponent} from '../../partials/module-header/module-header.component';
import {RouterTestingModule} from '@angular/router/testing';
import {MatIconModule} from '@angular/material';

describe('ActionDemoComponent', () => {
    let component: ActionDemoComponent;
    let fixture: ComponentFixture<ActionDemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MatIconModule
            ],
            declarations: [
                ActionDemoComponent,
                ModuleHeaderComponent
            ]
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
