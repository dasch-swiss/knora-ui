import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KuiProgressIndicatorComponent} from './progress-indicator.component';
import {MatIconModule} from '@angular/material';

describe('KuiProgressIndicatorComponent', () => {
    let component: KuiProgressIndicatorComponent;
    let fixture: ComponentFixture<KuiProgressIndicatorComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                MatIconModule
            ],
            declarations: [KuiProgressIndicatorComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(KuiProgressIndicatorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
