import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatIconModule,
    MatSelectModule
} from '@angular/material';

import { ExtendedSearchComponent } from './extended-search.component';
import { SelectOntologyComponent } from './select-ontology/select-ontology.component';
import { SelectResourceClassComponent } from './select-resource-class/select-resource-class.component';
import { SelectPropertyComponent } from './select-property/select-property.component';
import { SpecifyPropertyValueComponent } from './select-property/specify-property-value/specify-property-value.component';
import { GravsearchGenerationService, KuiCoreConfig, OntologyCacheService, OntologyService } from '@knora/core';
import { BooleanValueComponent } from './select-property/specify-property-value/boolean-value/boolean-value.component';
import { DateValueComponent } from './select-property/specify-property-value/date-value/date-value.component';
import { DecimalValueComponent } from './select-property/specify-property-value/decimal-value/decimal-value.component';
import { IntegerValueComponent } from './select-property/specify-property-value/integer-value/integer-value.component';
import { LinkValueComponent } from './select-property/specify-property-value/link-value/link-value.component';
import { TextValueComponent } from './select-property/specify-property-value/text-value/text-value.component';
import { UriValueComponent } from './select-property/specify-property-value/uri-value/uri-value.component';
import { JdnDatepickerDirective } from '../../../../action/src/lib/directives/jdn-datepicker.directive';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OntologyMetadata } from '@knora/core';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('ExtendedSearchComponent', () => {

    let componentInstance: ExtendedSearchComponent;
    let fixture: ComponentFixture<ExtendedSearchComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ExtendedSearchComponent,
                SelectOntologyComponent,
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
                JdnDatepickerDirective
            ],
            imports: [
                HttpClientTestingModule,
                ReactiveFormsModule,
                FormsModule,
                HttpClientModule,
                MatCheckboxModule,
                MatIconModule,
                MatFormFieldModule,
                MatSelectModule,
                MatDatepickerModule,
                MatAutocompleteModule,
                BrowserAnimationsModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    }
                },
                { provide: 'config', useValue: KuiCoreConfig },
                FormBuilder,
                GravsearchGenerationService,
                OntologyCacheService,
                OntologyService,
                HttpClient,
                ExtendedSearchComponent
            ]
        })
            .compileComponents();

    }));

    beforeEach( inject([OntologyCacheService], (ontoCacheService) => {

        spyOn(ontoCacheService, 'getOntologiesMetadata').and.callFake(() => {

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

            return of(ontoMeta);

        });

        fixture = TestBed.createComponent(ExtendedSearchComponent);
        componentInstance = fixture.componentInstance;
        fixture.detectChanges();

    }));

    it('should create', () => {
        expect(componentInstance).toBeTruthy();
    });

    it('should correctly initialized the ontologies\' metadata', () => {

        const expectedOntoMetata =
            [
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


        expect(componentInstance.ontologies).toEqual(expectedOntoMetata);

    });

    /*it('should get the classes and properties for a specific ontology', async(inject([ExtendedSearchComponent, MockBackend], (component: ExtendedSearchComponent, mockBackend) => {

          // TODO: this involves an asynchronous function: find a way to check for the results

          const resClassesAndProps = componentInstance.getResourceClassesAndPropertiesForOntology('http://0.0.0.0:3333/ontology/0801/beol/v2')

      })));*/
});
