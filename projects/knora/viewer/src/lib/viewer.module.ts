import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
// import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { KuiActionModule } from '@knora/action';
import { KuiCoreModule } from '@knora/core';

import { BooleanValueComponent } from './property/boolean-value/boolean-value.component';
import { ColorValueComponent } from './property/color-value/color-value.component';
import { DateValueComponent } from './property/date-value/date-value.component';
import { DecimalValueComponent } from './property/decimal-value/decimal-value.component';
import { ExternalResValueComponent } from './property/external-res-value/external-res-value.component';
import { GeometryValueComponent } from './property/geometry-value/geometry-value.component';
import { GeonameValueComponent } from './property/geoname-value/geoname-value.component';
import { IntegerValueComponent } from './property/integer-value/integer-value.component';
import { IntervalValueComponent } from './property/interval-value/interval-value.component';
import { LinkValueComponent } from './property/link-value/link-value.component';
import { ListValueComponent } from './property/list-value/list-value.component';
import { TextValueAsHtmlComponent } from './property/text-value/text-value-as-html/text-value-as-html.component';
import { TextValueAsStringComponent } from './property/text-value/text-value-as-string/text-value-as-string.component';
import { TextValueAsXmlComponent } from './property/text-value/text-value-as-xml/text-value-as-xml.component';
import { TextfileValueComponent } from './property/textfile-value/textfile-value.component';
import { UriValueComponent } from './property/uri-value/uri-value.component';
import { AnnotationComponent } from './resource/annotation/annotation.component';
import { AudioComponent } from './resource/audio/audio.component';
import { CollectionComponent } from './resource/collection/collection.component';
import { DddComponent } from './resource/ddd/ddd.component';
import { DocumentComponent } from './resource/document/document.component';
import { LinkObjComponent } from './resource/link-obj/link-obj.component';
import { MovingImageComponent } from './resource/moving-image/moving-image.component';
import { ObjectComponent } from './resource/object/object.component';
import { RegionComponent } from './resource/region/region.component';
import { StillImageComponent } from './resource/still-image/still-image.component';
import { TextComponent } from './resource/text/text.component';
import { CompareViewComponent } from './view/compare-view/compare-view.component';
import { GraphViewComponent } from './view/graph-view/graph-view.component';
import { GridViewComponent } from './view/grid-view/grid-view.component';
import { ListViewComponent } from './view/list-view/list-view.component';
import { PropertiesToolbarComponent } from './view/properties-view/properties-toolbar/properties-toolbar.component';
import { PropertiesViewComponent } from './view/properties-view/properties-view.component';
import { ResourceViewComponent } from './view/resource-view/resource-view.component';
import { SearchResultsComponent } from './view/search-results/search-results.component';
import { TableViewComponent } from './view/table-view/table-view.component';

@NgModule({
    imports: [
        CommonModule,
        KuiCoreModule,
        KuiActionModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatSlideToggleModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule,
        FlexLayoutModule
    ],
    declarations: [
        AnnotationComponent,
        AudioComponent,
        CollectionComponent,
        DddComponent,
        DocumentComponent,
        LinkObjComponent,
        MovingImageComponent,
        ObjectComponent,
        RegionComponent,
        StillImageComponent,
        TextComponent,
        TextValueAsHtmlComponent,
        TextValueAsStringComponent,
        TextValueAsXmlComponent,
        TextfileValueComponent,
        DateValueComponent,
        IntegerValueComponent,
        ColorValueComponent,
        DecimalValueComponent,
        UriValueComponent,
        BooleanValueComponent,
        GeometryValueComponent,
        GeonameValueComponent,
        IntervalValueComponent,
        ListValueComponent,
        LinkValueComponent,
        ExternalResValueComponent,
        ListViewComponent,
        GridViewComponent,
        TableViewComponent,
        ResourceViewComponent,
        CompareViewComponent,
        GraphViewComponent,
        PropertiesViewComponent,
        SearchResultsComponent,
        PropertiesToolbarComponent
    ],
    exports: [
        AnnotationComponent,
        AudioComponent,
        CollectionComponent,
        DddComponent,
        DocumentComponent,
        LinkObjComponent,
        MovingImageComponent,
        ObjectComponent,
        RegionComponent,
        StillImageComponent,
        TextComponent,
        TextValueAsHtmlComponent,
        TextValueAsStringComponent,
        TextValueAsXmlComponent,
        TextfileValueComponent,
        DateValueComponent,
        IntegerValueComponent,
        ColorValueComponent,
        DecimalValueComponent,
        UriValueComponent,
        BooleanValueComponent,
        GeometryValueComponent,
        GeonameValueComponent,
        IntervalValueComponent,
        ListValueComponent,
        LinkValueComponent,
        ExternalResValueComponent,
        ListViewComponent,
        GridViewComponent,
        TableViewComponent,
        ResourceViewComponent,
        CompareViewComponent,
        GraphViewComponent,
        PropertiesViewComponent,
        SearchResultsComponent
    ]
})
export class KuiViewerModule {
}
