import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';

import {ProgressIndicatorComponent} from './progress-indicator/progress-indicator.component';
import {SortButtonComponent} from './sort-button/sort-button.component';
import {SortByPipe} from './sort-button/sort-by.pipe';

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatButtonModule,
        MatIconModule,
        MatMenuModule

    ],
    declarations: [
        ProgressIndicatorComponent,
        SortButtonComponent,
        SortByPipe
    ],
    exports: [
        ProgressIndicatorComponent,
        SortButtonComponent,
        SortByPipe
    ]
})
export class KuiActionModule {
}
