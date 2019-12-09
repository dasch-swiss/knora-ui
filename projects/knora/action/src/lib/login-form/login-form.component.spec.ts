import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { MatButtonModule } from '@angular/material';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RouterTestingModule } from '@angular/router/testing';
import { KuiActionModule } from '@knora/action';
import { KnoraApiConfig, KnoraApiConnection } from '@knora/api';
import { KnoraApiConfigToken, KnoraApiConnectionToken, KuiConfig, KuiConfigToken, KuiCoreModule, SessionService } from '@knora/core';

import { LoginFormComponent } from './login-form.component';

export class AppConfig {
    name: string;
    url: string;

    constructor(name: string, url: string) { }
}

describe('LoginFormComponent', () => {
    let component: LoginFormComponent;
    let fixture: ComponentFixture<LoginFormComponent>;

    const formBuilder: FormBuilder = new FormBuilder();

    const config = new KnoraApiConfig('http', '0.0.0.0', 3333);
    const appConfig = new AppConfig('knora app', '0.0.0.0:4200');

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiActionModule,
                KuiCoreModule,
                MatButtonModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                ReactiveFormsModule,
                RouterTestingModule
            ],
            declarations: [
                LoginFormComponent
            ],
            providers: [
                SessionService,
                {
                    provide: KuiConfigToken,
                    useValue: new KuiConfig(config, appConfig)
                },
                {
                    provide: KnoraApiConfigToken,
                    useValue: config
                },
                {
                    provide: KnoraApiConnectionToken,
                    useValue: new KnoraApiConnection(config)
                },
                {
                    provide: FormBuilder,
                    useValue: formBuilder
                }
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginFormComponent);
        component = fixture.componentInstance;
        component.form = formBuilder.group({
            username: null,
            password: null
        });
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
