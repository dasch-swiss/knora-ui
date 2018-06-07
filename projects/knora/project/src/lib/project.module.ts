import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProjectComponent} from './project.component';
import {DashboardComponent} from './dashboard/dashboard.component';

@NgModule({
    imports: [
        CommonModule
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
