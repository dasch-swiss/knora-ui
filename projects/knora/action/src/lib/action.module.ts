import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ActionComponent} from './action.component';
import {ProgressIndicatorComponent} from './progress-indicator/progress-indicator.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {SortButtonComponent} from './sort-button/sort-button.component';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule

    ],
    declarations: [ActionComponent, ProgressIndicatorComponent, SortButtonComponent],
    exports: [ActionComponent, ProgressIndicatorComponent, SortButtonComponent]
})
export class KuiActionModule {
}
