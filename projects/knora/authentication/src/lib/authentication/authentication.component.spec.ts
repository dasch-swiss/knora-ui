import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {KuiCoreModule} from '@knora/core';
import {AuthenticationComponent} from './authentication.component';
import {LoginButtonComponent} from '../login-button/login-button.component';
import {LogoutButtonComponent} from '../logout-button/logout-button.component';
import {LoginFormComponent} from '../login-form/login-form.component';

describe('AuthenticationComponent', () => {
    let component: AuthenticationComponent;
    let fixture: ComponentFixture<AuthenticationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiCoreModule
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
