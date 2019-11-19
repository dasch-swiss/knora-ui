import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ModuleHeaderComponent } from '../../../partials/module-header/module-header.component';
import { KuiAuthenticationModule } from '@knora/authentication';
import { KuiCoreModule } from '@knora/core';

import { LoginComponent } from './login.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LoginComponent', () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiAuthenticationModule,
                KuiCoreModule,
                BrowserAnimationsModule
            ],
            declarations: [
                ModuleHeaderComponent,
                LoginComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
