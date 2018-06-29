import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProgressIndicatorComponent} from './progress-indicator/progress-indicator.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatIconModule, MatMenuModule} from '@angular/material';
import {SortButtonComponent} from './sort-button/sort-button.component';
import {SortByPipe} from './sort-button/sort-by.pipe';
import {AdminImageDirective} from './admin-image/admin-image.directive';

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
        SortByPipe,
        AdminImageDirective
    ],
    exports: [
        ProgressIndicatorComponent,
        SortButtonComponent,
        SortByPipe,
        AdminImageDirective
    ]
})
export class KuiActionModule {
}
