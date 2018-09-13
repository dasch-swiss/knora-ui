import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { KuiActionModule } from '@knora/action';

import { LoginFormComponent } from './login-form/login-form.component';

@NgModule({
    imports: [
        CommonModule,
        KuiActionModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatDialogModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        HttpClientModule
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
