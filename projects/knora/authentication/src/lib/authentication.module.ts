import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { KuiActionModule } from '@knora/action';

import { LoginFormComponent } from './login-form/login-form.component';
import { JwtInterceptor } from './interceptors/jwt.interceptor';
import { WithCredentialsInterceptor } from './interceptors/with-credentials.interceptor';

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
    ],
    providers: [
        { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: WithCredentialsInterceptor, multi: true}
    ]
})
export class KuiAuthenticationModule {
}
