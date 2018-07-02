import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule
} from '@angular/material';
import { KuiCoreModule } from '@knora/core';
import { KuiActionModule } from '@knora/action';

import { LoginFormComponent } from './login-form/login-form.component';
import { LoginButtonComponent } from './login-button/login-button.component';
import { LogoutButtonComponent } from './logout-button/logout-button.component';
import { AuthenticationComponent } from './authentication/authentication.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        KuiActionModule,
        KuiCoreModule
    ],
    entryComponents: [
        LoginFormComponent
    ],
    providers: [],
    declarations: [
        AuthenticationComponent,
        LoginFormComponent,
        LoginButtonComponent,
        LogoutButtonComponent
    ],
    exports: [
        AuthenticationComponent,
        LoginFormComponent,
        LoginButtonComponent,
        LogoutButtonComponent
    ]
})
export class KuiAuthenticationModule {
}
