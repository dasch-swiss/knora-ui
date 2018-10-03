import { HttpClient, HttpClientModule } from '@angular/common/http';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatSelectModule
} from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ReversePipe } from '@knora/action';
import { KUI_CORE_CONFIG_TOKEN, KuiCoreConfig, OntologyCacheService, OntologyService } from '@knora/core';
import { ExtendedSearchComponent } from './extended-search/extended-search.component';
import { SelectOntologyComponent } from './extended-search/select-ontology/select-ontology.component';
import { SelectPropertyComponent } from './extended-search/select-property/select-property.component';
import { SpecifyPropertyValueComponent } from './extended-search/select-property/specify-property-value/specify-property-value.component';
import { SelectResourceClassComponent } from './extended-search/select-resource-class/select-resource-class.component';

import { SearchComponent } from './search.component';

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
                ReversePipe
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
                RouterTestingModule
            ],
            providers: [
                HttpClient,
                OntologyCacheService,
                OntologyService,
                {provide: KUI_CORE_CONFIG_TOKEN, useValue: KuiCoreConfig}
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
