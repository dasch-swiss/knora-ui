import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StillImageComponent } from './object/still-image/still-image.component';
import { MovingImageComponent } from './object/moving-image/moving-image.component';
import { AudioComponent } from './object/audio/audio.component';
import { DddComponent } from './object/ddd/ddd.component';
import { TextComponent } from './object/text/text.component';
import { DocumentComponent } from './object/document/document.component';
import { CollectionComponent } from './object/collection/collection.component';
import { RegionComponent } from './object/region/region.component';
import { AnnotationComponent } from './object/annotation/annotation.component';
import { LinkObjComponent } from './object/link-obj/link-obj.component';
import { TextValueComponent } from './property/text-value/text-value.component';
import { DateValueComponent } from './property/date-value/date-value.component';
import { IntegerValueComponent } from './property/integer-value/integer-value.component';
import { ColorValueComponent } from './property/color-value/color-value.component';
import { DecimalValueComponent } from './property/decimal-value/decimal-value.component';
import { UriValueComponent } from './property/uri-value/uri-value.component';
import { BooleanValueComponent } from './property/boolean-value/boolean-value.component';
import { GeometryValueComponent } from './property/geometry-value/geometry-value.component';
import { GeonameValueComponent } from './property/geoname-value/geoname-value.component';
import { IntervalValueComponent } from './property/interval-value/interval-value.component';
import { ListValueComponent } from './property/list-value/list-value.component';
import { LinkValueComponent } from './property/link-value/link-value.component';
import { ExternalResValueComponent } from './property/external-res-value/external-res-value.component';
import { ListViewComponent } from './view/list-view/list-view.component';
import { GridViewComponent } from './view/grid-view/grid-view.component';
import { TableViewComponent } from './view/table-view/table-view.component';
import { ObjectViewComponent } from './view/object-view/object-view.component';
import { CompareViewComponent } from './view/compare-view/compare-view.component';
import { GraphViewComponent } from './view/graph-view/graph-view.component';

import { MatCheckboxModule, MatFormFieldModule, MatInputModule, MatNativeDateModule, MatSlideToggleModule } from '@angular/material';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
    imports: [
        CommonModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatFormFieldModule,
        MatInputModule,
        MatNativeDateModule,
        MatSlideToggleModule,
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
        TextValueComponent,
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
        ObjectViewComponent,
        CompareViewComponent,
        GraphViewComponent
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
        TextValueComponent,
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
        ObjectViewComponent,
        CompareViewComponent,
        GraphViewComponent
    ]
})
export class KuiViewerModule {
}
