import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { KuiActionModule } from '@knora/action';

import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
    imports: [
        CommonModule,
        KuiActionModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        ReactiveFormsModule
    ],
    declarations: [
        LoginFormComponent
    ],
    exports: [
        LoginFormComponent
    ]
})
export class KuiAuthenticationModule {
}
