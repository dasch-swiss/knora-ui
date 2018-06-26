import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {MatButtonModule, MatCardModule, MatFormFieldModule, MatIconModule, MatInputModule} from '@angular/material';
import {KuiActionModule} from '@knora/action';

import {LoginComponent} from './login/login.component';
import {LogoutComponent} from './logout/logout.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatButtonModule,
        MatFormFieldModule,
        KuiActionModule
    ],
    declarations: [
        LoginComponent,
        LogoutComponent
    ],
    exports: [
        LoginComponent,
        LogoutComponent
    ]
})
export class KuiAuthenticationModule {
}
