import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';

import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';
import { SortButtonComponent } from './sort-button/sort-button.component';
import { SortByPipe } from './pipes/sort-by.pipe';
import { AdminImageDirective } from './admin-image/admin-image.directive';
import { ReversePipe } from './pipes/reverse.pipe';
import { KeyPipe } from './pipes/key.pipe';


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
        AdminImageDirective,
        ReversePipe,
        KeyPipe
    ],
    exports: [
        ProgressIndicatorComponent,
        SortButtonComponent,
        SortByPipe,
        AdminImageDirective,
        ReversePipe,
        KeyPipe
    ]
})
export class KuiActionModule {
}
