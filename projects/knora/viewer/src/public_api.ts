/*
 * Public API Surface of viewer
 */

// resource viewer
export * from './lib/resource/still-image/still-image.component';
export * from './lib/resource/moving-image/moving-image.component';
export * from './lib/resource/audio/audio.component';
export * from './lib/resource/ddd/ddd.component';
export * from './lib/resource/text/text.component';
export * from './lib/resource/document/document.component';
export * from './lib/resource/collection/collection.component';
export * from './lib/resource/region/region.component';
export * from './lib/resource/annotation/annotation.component';
export * from './lib/resource/link-obj/link-obj.component';
export * from './lib/resource/object/object.component';

// property (gui) element
export * from './lib/property/text-value/text-value.component';
export * from './lib/property/date-value/date-value.component';
export * from './lib/property/integer-value/integer-value.component';
export * from './lib/property/color-value/color-value.component';
export * from './lib/property/decimal-value/decimal-value.component';
export * from './lib/property/uri-value/uri-value.component';
export * from './lib/property/boolean-value/boolean-value.component';
export * from './lib/property/geometry-value/geometry-value.component';
export * from './lib/property/geoname-value/geoname-value.component';
export * from './lib/property/interval-value/interval-value.component';
export * from './lib/property/list-value/list-value.component';
export * from './lib/property/link-value/link-value.component';
export * from './lib/property/external-res-value/external-res-value.component';

// different kind of views
export * from './lib/view/list-view/list-view.component';
export * from './lib/view/grid-view/grid-view.component';
export * from './lib/view/table-view/table-view.component';
export * from './lib/view/resource-view/resource-view.component';
export * from './lib/view/compare-view/compare-view.component';
export * from './lib/view/graph-view/graph-view.component';
export * from './lib/view/properties-view/properties-view.component';

// viewer module
export * from './lib/viewer.module';
