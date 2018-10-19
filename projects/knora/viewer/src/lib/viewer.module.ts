import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { KuiActionModule } from '@knora/action';
import { KuiCoreModule } from '@knora/core';

import {
    MatAutocompleteModule,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatNativeDateModule,
    MatSlideToggleModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';

import {
    BooleanValueComponent,
    ColorValueComponent,
    DateValueComponent,
    DecimalValueComponent,
    ExternalResValueComponent,
    GeometryValueComponent,
    GeonameValueComponent,
    IntegerValueComponent,
    IntervalValueComponent,
    LinkValueComponent,
    ListValueComponent,
    TextfileValueComponent,
    TextValueAsHtmlComponent,
    TextValueAsStringComponent,
    TextValueAsXmlComponent,
    TextValueComponent,
    UriValueComponent
} from './property';

import {
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
    TextComponent
} from './resource/';

import {
    CompareViewComponent,
    GraphViewComponent,
    GridViewComponent,
    ListViewComponent,
    PropertiesViewComponent,
    ResourceViewComponent,
    TableViewComponent
} from './view';

@NgModule({
    imports: [
        CommonModule,
        KuiCoreModule,
        KuiActionModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatCardModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        MatListModule,
        MatNativeDateModule,
        MatSlideToggleModule,
        MatToolbarModule,
        MatTooltipModule,
        ReactiveFormsModule

    ],
    declarations: [
        StillImageComponent,
        MovingImageComponent,
        AudioComponent,
        DddComponent,
        TextComponent,
        DocumentComponent,
        CollectionComponent,
        RegionComponent,
        AnnotationComponent,
        LinkObjComponent,
        ObjectComponent,
        TextValueComponent,
        TextValueAsStringComponent,
        TextValueAsHtmlComponent,
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
        PropertiesViewComponent
    ],
    exports: [
        StillImageComponent,
        MovingImageComponent,
        AudioComponent,
        DddComponent,
        TextComponent,
        DocumentComponent,
        CollectionComponent,
        RegionComponent,
        AnnotationComponent,
        LinkObjComponent,
        ObjectComponent,
        TextValueComponent,
        TextValueAsStringComponent,
        TextValueAsHtmlComponent,
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
        PropertiesViewComponent
    ]
})
export class KuiViewerModule {
}
