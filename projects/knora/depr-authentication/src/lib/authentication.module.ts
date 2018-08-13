import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule, MatCardModule, MatDialogModule, MatFormFieldModule, MatIconModule, MatInputModule } from '@angular/material';
import { KuiActionModule } from '@knora/action';

import { AuthenticationComponent } from './authentication.component';
import { LoginComponent } from './login/login.component';

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
    providers: [
//        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
//        {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    ],
    declarations: [
        AuthenticationComponent,
        LoginComponent
    ],
    exports: [
        AuthenticationComponent,
        LoginComponent
    ]
})
export class KuiAuthenticationModule {
}
