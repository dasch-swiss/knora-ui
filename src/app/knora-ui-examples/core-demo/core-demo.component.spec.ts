import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';

import {CoreDemoComponent} from './core-demo.component';
import {ModuleHeaderComponent} from '../../partials/module-header/module-header.component';
import {MatIconModule} from '@angular/material';

describe('CoreDemoComponent', () => {
    let component: CoreDemoComponent;
    let fixture: ComponentFixture<CoreDemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                MatIconModule
            ],
            declarations: [
                CoreDemoComponent,
                ModuleHeaderComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CoreDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
