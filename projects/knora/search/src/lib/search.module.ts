import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatSelectModule,
    MatTooltipModule
} from '@angular/material';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KuiCoreModule } from '@knora/core';
import { KuiActionModule } from '@knora/action';
import { KuiViewerModule } from '@knora/viewer';

import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';

import { SearchComponent } from './search.component';
import { FulltextSearchComponent } from './fulltext-search/fulltext-search.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { ExtendedSearchComponent } from './extended-search/extended-search.component';

import { SelectOntologyComponent } from './extended-search/select-ontology/select-ontology.component';
import { SelectResourceClassComponent } from './extended-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './extended-search/select-property/select-property.component';
import { SpecifyPropertyValueComponent } from './extended-search/select-property/specify-property-value/specify-property-value.component';
import { BooleanValueComponent } from './extended-search/select-property/specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from './extended-search/select-property/specify-property-value/date-value/date-value.component';
import { DecimalValueComponent } from './extended-search/select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from './extended-search/select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from './extended-search/select-property/specify-property-value/link-value/link-value.component';
import { TextValueComponent } from './extended-search/select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from './extended-search/select-property/specify-property-value/uri-value/uri-value.component';
import { HeaderComponent } from './extended-search/select-property/specify-property-value/date-value/header-calendar/header-calendar.component';
import { ExpertSearchComponent } from './expert-search/expert-search.component';


@NgModule({
    imports: [
        CommonModule,
        BrowserAnimationsModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatSelectModule,
        MatTooltipModule,
        FormsModule,
        ReactiveFormsModule,
        KuiCoreModule,
        KuiActionModule,
        KuiViewerModule,
        MatJDNConvertibleCalendarDateAdapterModule
    ],
    declarations: [
        SearchComponent,
        SelectOntologyComponent,
        ExtendedSearchComponent,
        SelectResourceClassComponent,
        SelectPropertyComponent,
        SpecifyPropertyValueComponent,
        BooleanValueComponent,
        DateValueComponent,
        DecimalValueComponent,
        IntegerValueComponent,
        LinkValueComponent,
        TextValueComponent,
        UriValueComponent,
        HeaderComponent,
        FulltextSearchComponent,
        SearchPanelComponent,
        ExpertSearchComponent
    ],
    exports: [
        SearchComponent,
        SearchPanelComponent,
        FulltextSearchComponent,
        ExtendedSearchComponent,
        DateValueComponent,
        ExpertSearchComponent
    ],
    entryComponents: [
        HeaderComponent
    ]
})
export class KuiSearchModule {
}
