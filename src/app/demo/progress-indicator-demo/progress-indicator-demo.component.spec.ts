import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HeaderComponent} from '../../framework/header/header.component';

import {ProgressIndicatorDemoComponent} from './progress-indicator-demo.component';
import {KgProgressIndicatorModule} from '@knora/progress-indicator';
import {MatListModule} from '@angular/material';

describe('ProgressIndicatorDemoComponent', () => {
    let component: ProgressIndicatorDemoComponent;
    let fixture: ComponentFixture<ProgressIndicatorDemoComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
              KgProgressIndicatorModule,
              MatListModule
            ],
            declarations: [
                ProgressIndicatorDemoComponent,
                HeaderComponent
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
