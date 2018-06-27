import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { KuiCoreModule } from '@knora/core';
import { KuiActionModule } from '@knora/action';

import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ButtonComponent } from './button/button.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        KuiActionModule,
        KuiCoreModule
    ],
    declarations: [
        LoginComponent,
        LogoutComponent,
        ButtonComponent
    ],
    exports: [
        LoginComponent,
        LogoutComponent,
        ButtonComponent
    ]
})
export class KuiAuthenticationModule {
}
