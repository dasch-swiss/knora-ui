import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule, MatIconModule, MatMenuModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AdminImageDirective } from './admin-image/admin-image.directive';
import { GndDirective } from './directives/gnd.directive';
import { JdnDatepickerDirective } from './directives/jdn-datepicker.directive';
import { ExistingNameDirective } from './existing-name/existing-name.directive';
import { KeyPipe } from './pipes/key.pipe';
import { ReversePipe } from './pipes/reverse.pipe';
import { SortByPipe } from './pipes/sort-by.pipe';

import { ProgressIndicatorComponent } from './progress-indicator/progress-indicator.component';
import { ResourceDialogComponent } from './resource-dialog/resource-dialog.component';
import { SortButtonComponent } from './sort-button/sort-button.component';

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
        ResourceDialogComponent,
        JdnDatepickerDirective
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
        JdnDatepickerDirective
    ]
})
export class KuiActionModule {
}
