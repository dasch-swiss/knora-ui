import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActionComponent} from './action.component';
import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule} from '@angular/material';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule

    ],
    declarations: [ActionComponent, ProgressIndicatorComponent],
    exports: [ActionComponent, ProgressIndicatorComponent]
})
export class KuiActionModule {
}
