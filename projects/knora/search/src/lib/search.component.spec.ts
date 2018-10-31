import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { SearchComponent } from './search.component';
import { ExtendedSearchComponent } from './extended-search/extended-search.component';
import { SelectOntologyComponent } from './extended-search/select-ontology/select-ontology.component';
import { SelectResourceClassComponent } from './extended-search/select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './extended-search/select-property/select-property.component';
import { SpecifyPropertyValueComponent } from './extended-search/select-property/specify-property-value/specify-property-value.component';
import { ReversePipe } from '@knora/action';
import { KuiCoreConfig, OntologyCacheService, OntologyService } from '@knora/core';
import { BooleanValueComponent } from './extended-search/select-property/specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from './extended-search/select-property/specify-property-value/date-value/date-value.component';
import { DecimalValueComponent } from './extended-search/select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from './extended-search/select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from './extended-search/select-property/specify-property-value/link-value/link-value.component';
import { TextValueComponent } from './extended-search/select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from './extended-search/select-property/specify-property-value/uri-value/uri-value.component';
import { JdnDatepickerDirective } from '../../../action/src/lib/directives/jdn-datepicker.directive';
import { of } from 'rxjs';
import { OntologyMetadata } from '../../../core/src/lib/services';

describe('SearchComponent', () => {
    let component: SearchComponent;
    let fixture: ComponentFixture<SearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                SearchComponent,
                ExtendedSearchComponent,
                SelectOntologyComponent,
                SelectResourceClassComponent,
                SelectPropertyComponent,
                SpecifyPropertyValueComponent,
                ReversePipe,
                BooleanValueComponent,
                DateValueComponent,
                DecimalValueComponent,
                IntegerValueComponent,
                LinkValueComponent,
                TextValueComponent,
                UriValueComponent,
                JdnDatepickerDirective
            ],
            imports: [
                BrowserAnimationsModule,
                FormsModule,
                HttpClientModule,
                MatCheckboxModule,
                MatFormFieldModule,
                MatIconModule,
                MatInputModule,
                MatListModule,
                MatSelectModule,
                ReactiveFormsModule,
                RouterTestingModule,
                MatDatepickerModule,
                MatAutocompleteModule
            ],
            providers: [
                HttpClient,
                OntologyCacheService,
                OntologyService,
                {provide: 'config', useValue: KuiCoreConfig}
            ]
        })
            .compileComponents();
    }));

    beforeEach(inject([OntologyCacheService], (ontoCacheService) => {

        // needed on init of extended search
        const ontoMeta = [
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/anything/v2', 'The anything ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0001/something/v2', 'The something ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/00FF/images/v2', 'The images demo ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0801/beol/v2', 'The BEOL ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0802/biblio/v2', 'The Biblio ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0803/incunabula/v2', 'The incunabula ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/0804/dokubib/v2', 'The dokubib ontology'),
            new OntologyMetadata('http://0.0.0.0:3333/ontology/08AE/webern/v2', 'The Anton Webern project ontology'),
            new OntologyMetadata('http://api.knora.org/ontology/knora-api/v2', 'The knora-api ontology in the complex schema')
        ];

        spyOn(ontoCacheService, 'getOntologiesMetadata').and.returnValue(of(ontoMeta));

        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
