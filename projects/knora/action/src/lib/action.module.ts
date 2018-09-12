import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';

import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';
import { SortButtonComponent } from './sort-button/sort-button.component';
import { SortByPipe } from './pipes/sort-by.pipe';
import { AdminImageDirective } from './admin-image/admin-image.directive';
import { ExistingNameDirective } from './existing-name/existing-name.directive';
import { ReversePipe } from './pipes/reverse.pipe';
import { KeyPipe } from './pipes/key.pipe';
import { GndDirective } from './directives/gnd.directive';
import { MathJaxDirective } from './directives/mathjax.directive';
import { ResourceDialogComponent } from './resource-dialog/resource-dialog.component';


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
        ExistingNameDirective,
        ReversePipe,
        KeyPipe,
        GndDirective,
        MathJaxDirective,
        ResourceDialogComponent
    ],
    exports: [
        ProgressIndicatorComponent,
        SortButtonComponent,
        ResourceDialogComponent,
        SortByPipe,
        AdminImageDirective,
        ExistingNameDirective,
        ReversePipe,
        KeyPipe,
        GndDirective,
        MathJaxDirective
    ]
})
export class KuiActionModule {
}
