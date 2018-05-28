import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {MatButtonModule} from '@angular/material';
import {KuiCoreModule} from '@knora/core';
import {KuiProgressIndicatorModule} from '@knora/progress-indicator';

import {AuthenticationComponent} from './authentication.component';

describe('AuthenticationComponent', () => {
    let component: AuthenticationComponent;
    let fixture: ComponentFixture<AuthenticationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiProgressIndicatorModule,
                KuiCoreModule,
                MatButtonModule,
                RouterTestingModule
            ],
            declarations: [
                AuthenticationComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AuthenticationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
