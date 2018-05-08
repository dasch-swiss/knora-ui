import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MatIconModule, MatListModule} from '@angular/material';

import {ModuleHeaderComponent} from '../../landing-page/partials/module-header/module-header.component';
import {ProgressIndicatorDemoComponent} from './progress-indicator-demo.component';
import {KnoraProgressIndicatorModule} from '@knora/progress-indicator';

describe('ProgressIndicatorDemoComponent', () => {
    let component: ProgressIndicatorDemoComponent;
    let fixture: ComponentFixture<ProgressIndicatorDemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
              KnoraProgressIndicatorModule,
              MatListModule,
              MatIconModule
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
