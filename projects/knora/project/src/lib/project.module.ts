import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './project.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {MatCardModule, MatChipsModule} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatChipsModule
    ],
    declarations: [
        ProjectComponent,
        DashboardComponent
    ],
    exports: [
        ProjectComponent,
        DashboardComponent
    ]
})
export class KuiProjectModule { }
