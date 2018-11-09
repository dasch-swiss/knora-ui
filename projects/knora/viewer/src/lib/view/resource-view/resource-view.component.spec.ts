import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatCardModule, MatListModule } from '@angular/material';
import { GndDirective, KeyPipe } from '@knora/action';
import {
  IncomingService,
  KnoraConstants,
  KuiCoreConfig,
  OntologyCacheService,
  OntologyInformation,
  OntologyService,
  ResourceService
} from '@knora/core';
import { ResourceViewComponent } from './resource-view.component';

import { AnnotationComponent } from '../../resource/annotation/annotation.component';
import { AudioComponent } from '../../resource/audio/audio.component';
import { CollectionComponent } from '../../resource/collection/collection.component';
import { DddComponent } from '../../resource/ddd/ddd.component';
import { DocumentComponent } from '../../resource/document/document.component';
import { LinkObjComponent } from '../../resource/link-obj/link-obj.component';
import { MovingImageComponent } from '../../resource/moving-image/moving-image.component';
import { ObjectComponent } from '../../resource/object/object.component';
import { RegionComponent } from '../../resource/region/region.component';
import { StillImageComponent } from '../../resource/still-image/still-image.component';
import { TextComponent } from '../../resource/text/text.component';

import { BooleanValueComponent } from '../../property/boolean-value/boolean-value.component';
import { ColorValueComponent } from '../../property/color-value/color-value.component';
import { DateValueComponent } from '../../property/date-value/date-value.component';
import { DecimalValueComponent } from '../../property/decimal-value/decimal-value.component';
import { GeometryValueComponent } from '../../property/geometry-value/geometry-value.component';
import { IntegerValueComponent } from '../../property/integer-value/integer-value.component';
import { IntervalValueComponent } from '../../property/interval-value/interval-value.component';
import { LinkValueComponent } from '../../property/link-value/link-value.component';
import { ListValueComponent } from '../../property/list-value/list-value.component';
import { TextValueAsStringComponent } from '../../property/text-value/text-value-as-string/text-value-as-string.component';
import { TextValueAsHtmlComponent } from '../../property/text-value/text-value-as-html/text-value-as-html.component';
import { TextValueAsXmlComponent } from '../../property/text-value/text-value-as-xml/text-value-as-xml.component';
import { TextfileValueComponent } from '../../property/textfile-value/textfile-value.component';
import { UriValueComponent } from '../../property/uri-value/uri-value.component';

describe('ResourceViewComponent', () => {
  let component: ResourceViewComponent;
  let fixture: ComponentFixture<ResourceViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule,
        MatCardModule,
        MatListModule
      ],
      declarations: [
        ResourceViewComponent,
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
        KeyPipe,
        GndDirective,
        BooleanValueComponent,
        ColorValueComponent,
        DateValueComponent,
        DecimalValueComponent,
        GeometryValueComponent,
        IntegerValueComponent,
        IntervalValueComponent,
        LinkValueComponent,
        ListValueComponent,
        TextValueAsStringComponent,
        TextValueAsHtmlComponent,
        TextValueAsXmlComponent,
        TextfileValueComponent,
        UriValueComponent
      ],
      providers: [
        IncomingService,
        OntologyCacheService,
        OntologyService,
        ResourceService,
        { provide: 'config', useValue: KuiCoreConfig },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResourceViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  xit('should create', () => {
    expect(component).toBeTruthy();
  });
});
