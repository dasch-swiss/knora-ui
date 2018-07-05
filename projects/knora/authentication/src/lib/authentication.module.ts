import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import {
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
} from '@angular/material';
import { KuiCoreModule } from '@knora/core';
import { KuiActionModule } from '@knora/action';

import { LoginFormComponent } from './login-form/login-form.component';
import { AuthenticationComponent } from './authentication/authentication.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        KuiActionModule,
        KuiCoreModule,
        ReactiveFormsModule
    ],
    entryComponents: [
        LoginFormComponent
    ],
    providers: [],
    declarations: [
        AuthenticationComponent,
        LoginFormComponent
    ],
    exports: [
        AuthenticationComponent,
        LoginFormComponent
    ]
})
export class KuiAuthenticationModule {
}
