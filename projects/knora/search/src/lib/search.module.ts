import { MatInputModule } from '@angular/material/input';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { KuiCoreModule } from '@knora/core';
import { KuiActionModule } from '@knora/action';
import { KuiViewerModule } from '@knora/viewer';
import { MatJDNConvertibleCalendarDateAdapterModule } from 'jdnconvertiblecalendardateadapter';

import { DateValueComponent } from './extended-search/select-property/specify-property-value/date-value/date-value.component';
import { SearchPanelComponent } from './search-panel/search-panel.component';
import { ExtendedSearchComponent } from './extended-search/extended-search.component';
import { ExpertSearchComponent } from './expert-search/expert-search.component';
import { SelectOntologyComponent } from './extended-search/select-ontology/select-ontology.component';
import { SelectResourceClassComponent } from './extended-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './extended-search/select-property/select-property.component';
import { SpecifyPropertyValueComponent } from './extended-search/select-property/specify-property-value/specify-property-value.component';
import { BooleanValueComponent } from './extended-search/select-property/specify-property-value/boolean-value/boolean-value.component';
import { FulltextSearchComponent } from './fulltext-search/fulltext-search.component';
import { DecimalValueComponent } from './extended-search/select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from './extended-search/select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from './extended-search/select-property/specify-property-value/link-value/link-value.component';
import { TextValueComponent } from './extended-search/select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from './extended-search/select-property/specify-property-value/uri-value/uri-value.component';
import { HeaderComponent } from './extended-search/select-property/specify-property-value/date-value/header-calendar/header-calendar.component';
import { ListValueComponent } from './extended-search/select-property/specify-property-value/list-value/list-value.component';
import { ListDisplayComponent } from './extended-search/select-property/specify-property-value/list-value/list-display/list-display.component';

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
        ListValueComponent,
        ListDisplayComponent,
        ExpertSearchComponent
    ],
    exports: [
        SearchPanelComponent,
        FulltextSearchComponent,
        ExtendedSearchComponent,
        ExpertSearchComponent,
        DateValueComponent
    ],
    entryComponents: [
        HeaderComponent
    ]
})
export class KuiSearchModule {
}
