import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatIconModule, MatListModule } from '@angular/material';
import { FormsModule } from '@angular/forms';

import { SearchComponent } from './search.component';
import { SelectOntologyComponent } from './extended-search/select-ontology/select-ontology.component';
import { ExtendedSearchComponent } from './extended-search/extended-search.component';
import { SelectResourceClassComponent } from './extended-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './extended-search/select-property/select-property.component';

/* import { ReversePipe } from '@knora/core'; */

@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatListModule,
        FormsModule
    ],
    declarations: [
        SearchComponent,
        SelectOntologyComponent,
        ExtendedSearchComponent,
        SelectResourceClassComponent,
        SelectPropertyComponent,
        /*  ReversePipe */
    ],
    exports: [SearchComponent]
})
export class KuiSearchModule {
}
