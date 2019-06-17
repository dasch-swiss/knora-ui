import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  MatAutocompleteModule,
  MatCheckboxModule,
  MatDatepickerModule,
  MatFormFieldModule,
  MatIconModule,
  MatListModule,
  MatMenuModule,
  MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { JdnDatepickerDirective, ReversePipe } from '@knora/action';
import { KuiCoreConfig, KuiCoreConfigToken } from '@knora/core';
import { SearchPanelComponent } from './search-panel.component';
import { FulltextSearchComponent } from '../fulltext-search/fulltext-search.component';
import { ExtendedSearchComponent } from '../extended-search/extended-search.component';
import { SelectOntologyComponent } from '../extended-search/select-ontology/select-ontology.component';
import { SelectPropertyComponent } from '../extended-search/select-property/select-property.component';
import { SpecifyPropertyValueComponent } from '../extended-search/select-property/specify-property-value/specify-property-value.component';
import { SelectResourceClassComponent } from '../extended-search/select-resource-class/select-resource-class.component';
import { BooleanValueComponent } from '../extended-search/select-property/specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from '../extended-search/select-property/specify-property-value/date-value/date-value.component';
import { DecimalValueComponent } from '../extended-search/select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from '../extended-search/select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from '../extended-search/select-property/specify-property-value/link-value/link-value.component';
import { TextValueComponent } from '../extended-search/select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from '../extended-search/select-property/specify-property-value/uri-value/uri-value.component';
import { ListValueComponent } from '../extended-search/select-property/specify-property-value/list-value/list-value.component';
import { ListDisplayComponent } from '../extended-search/select-property/specify-property-value/list-value/list-display/list-display.component';

import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ExpertSearchComponent } from '../expert-search/expert-search.component';

describe('SearchPanelComponent', () => {
  let component: SearchPanelComponent;
  let fixture: ComponentFixture<SearchPanelComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatAutocompleteModule,
        MatCheckboxModule,
        MatDatepickerModule,
        MatIconModule,
        MatListModule,
        MatMenuModule,
        MatFormFieldModule,
        MatSelectModule,
        FormsModule,
        ReactiveFormsModule,
        RouterTestingModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        HttpClientModule,
      ],
      declarations: [
        SearchPanelComponent,
        FulltextSearchComponent,
        ExtendedSearchComponent,
        ExpertSearchComponent,
        SelectOntologyComponent,
        SelectPropertyComponent,
        SelectResourceClassComponent,
        SpecifyPropertyValueComponent,
        BooleanValueComponent,
        DateValueComponent,
        DecimalValueComponent,
        IntegerValueComponent,
        LinkValueComponent,
        TextValueComponent,
        UriValueComponent,
        ReversePipe,
        JdnDatepickerDirective,
        ListValueComponent,
        ListDisplayComponent
      ],
      providers: [
        {
          provide: KuiCoreConfigToken,
          useValue: KuiCoreConfig
        },
        HttpClient,
        {
          provide: ActivatedRoute,
          useValue: {
            params: null
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
