import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule, MatListModule} from '@angular/material';
import {KuiProgressIndicatorModule} from '@knora/progress-indicator';

import {ModuleHeaderComponent} from '../../partials/module-header/module-header.component';
import {ProgressIndicatorDemoComponent} from './progress-indicator-demo.component';
import {RouterTestingModule} from '@angular/router/testing';


describe('ProgressIndicatorDemoComponent', () => {
    let component: ProgressIndicatorDemoComponent;
    let fixture: ComponentFixture<ProgressIndicatorDemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiProgressIndicatorModule,
                MatListModule,
                MatIconModule,
                RouterTestingModule
            ],
            declarations: [
                ProgressIndicatorDemoComponent,
                ModuleHeaderComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ProgressIndicatorDemoComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
