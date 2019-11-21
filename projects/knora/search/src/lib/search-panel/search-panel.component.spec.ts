import { HttpClient, HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { KuiActionModule } from '@knora/action';
import { KuiCoreConfig, KuiCoreConfigToken } from '@knora/core';
import { ExpertSearchComponent } from '../expert-search/expert-search.component';
import { ExtendedSearchComponent } from '../extended-search/extended-search.component';
import { SelectOntologyComponent } from '../extended-search/select-ontology/select-ontology.component';
import { SelectPropertyComponent } from '../extended-search/select-property/select-property.component';
import { BooleanValueComponent } from '../extended-search/select-property/specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from '../extended-search/select-property/specify-property-value/date-value/date-value.component';
import { DecimalValueComponent } from '../extended-search/select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from '../extended-search/select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from '../extended-search/select-property/specify-property-value/link-value/link-value.component';
import { ListDisplayComponent } from '../extended-search/select-property/specify-property-value/list-value/list-display/list-display.component';
import { ListValueComponent } from '../extended-search/select-property/specify-property-value/list-value/list-value.component';
import { SpecifyPropertyValueComponent } from '../extended-search/select-property/specify-property-value/specify-property-value.component';
import { TextValueComponent } from '../extended-search/select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from '../extended-search/select-property/specify-property-value/uri-value/uri-value.component';
import { SelectResourceClassComponent } from '../extended-search/select-resource-class/select-resource-class.component';
import { FulltextSearchComponent } from '../fulltext-search/fulltext-search.component';
import { SearchPanelComponent } from './search-panel.component';
import { IntElementComponent, StringElementComponent } from '@knora/viewer';


describe('SearchPanelComponent', () => {
    let component: SearchPanelComponent;
    let fixture: ComponentFixture<SearchPanelComponent>;


    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                KuiActionModule,
                MatAutocompleteModule,
                MatCheckboxModule,
                MatDatepickerModule,
                MatIconModule,
                MatListModule,
                MatMenuModule,
                MatFormFieldModule,
                MatSelectModule,
                MatTooltipModule,
                FormsModule,
                ReactiveFormsModule,
                RouterTestingModule,
                BrowserAnimationsModule,
                HttpClientTestingModule,
                HttpClientModule
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
                ListValueComponent,
                ListDisplayComponent,
                IntElementComponent,
                StringElementComponent
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
