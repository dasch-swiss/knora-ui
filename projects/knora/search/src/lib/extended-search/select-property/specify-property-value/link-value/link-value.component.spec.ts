import { async, ComponentFixture, inject, TestBed } from '@angular/core/testing';

import { LinkValueComponent } from './link-value.component';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    MatAutocompleteModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
} from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiServiceResult, IRI, KuiCoreConfig, ReadResource, SearchService } from '@knora/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

declare let require: any; // http://stackoverflow.com/questions/34730010/angular2-5-minute-install-bug-require-is-not-defined
const jsonld = require('jsonld');

describe('LinkValueComponent', () => {
    let testHostComponent: TestHostComponent;
    let testHostFixture: ComponentFixture<TestHostComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                LinkValueComponent,
                TestHostComponent
            ],
            imports: [
                HttpClientTestingModule,
                FormsModule,
                MatAutocompleteModule,
                ReactiveFormsModule,
                MatFormFieldModule,
                MatIconModule,
                MatCheckboxModule,
                BrowserAnimationsModule,
                MatInputModule,
                RouterTestingModule.withRoutes([])
            ],
            providers: [
                {
                    provide: ActivatedRoute,
                    useValue: {
                        params: null
                    },
                },
                {
                    provide: 'config',
                    useValue: KuiCoreConfig
                },
                FormBuilder
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        testHostFixture = TestBed.createComponent(TestHostComponent);
        testHostComponent = testHostFixture.componentInstance;
        testHostFixture.detectChanges();

        expect(testHostComponent).toBeTruthy();
    });

    it('should create', () => {
        // access the test host component's child
        expect(testHostComponent.linkValue).toBeTruthy();
    });

    it('should have the correct resource class restriction', () => {
        // access the test host component's child
        expect(testHostComponent.linkValue).toBeTruthy();

        expect(testHostComponent.linkValue.restrictResourceClass).toEqual('http://0.0.0.0:3333/ontology/0801/beol/v2#person');
    });

    it('should search for resources by their label', inject([SearchService], (searchService) => {
        const result = new ApiServiceResult();
        result.status = 200;
        result.statusText = '';
        result.url = '';
        result.body = Euler;

        spyOn(searchService, 'searchByLabel').and.callFake(() => of(result));

        const promises = jsonld.promises;

        // mock jsonld processor
        spyOn(promises, 'compact').and.callFake((jsonldExpanded) => {

            expect(jsonldExpanded).toEqual(Euler);

            // return a mocked method for "then":
            // call the arg (function pointer) with the compacted jsonld as an argument
            return {
                then: function (funptr) {
                    // funptr is the method passed to promise.then
                    funptr(EulerCompacted);
                }
            };
        });

        testHostComponent.linkValue.searchByLabel('Leonhard Euler');

        testHostFixture.detectChanges();

        expect(testHostComponent.linkValue.resources.length).toEqual(2);

        expect(testHostComponent.linkValue.resources[0].id).toEqual('http://rdfh.ch/0802/test1compacted');

        expect(testHostComponent.linkValue.resources[1].id).toEqual('http://rdfh.ch/0802/test2compacted');
    }));

    it('should return a selected resource', () => {

        testHostComponent.linkValue.form.setValue({'resource': new ReadResource('http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ', 'testtype', 'testlabel', [], [], [], [], {})});

        testHostFixture.detectChanges();

        expect(testHostComponent.linkValue.getValue()).toEqual(new IRI('http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ'));
    });
});

/**
 * Test host component to simulate parent component.
 */
@Component({
    selector: `host-component`,
    template: `
        <link-value #linkVal [formGroup]="form"
                    [restrictResourceClass]="'http://0.0.0.0:3333/ontology/0801/beol/v2#person'"></link-value>`
})
class TestHostComponent implements OnInit {

    form;

    @ViewChild('linkVal') linkValue: LinkValueComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {
        this.form = this.fb.group({});

    }
}

const Euler = {
    '@graph': [{
        '@id': 'http://rdfh.ch/0802/test1',
        '@type': 'beol:person',
        'beol:beolIDs': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/B4VErwphRE-MG7MwSdjtKg',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'EulerJL, eulerjl'
        },
        'beol:comment': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/LnbIUMv7TCe4c9j9DYLswQ',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Sohn von J.A. Euler; russischer Artillerieoffizier, Oberst (1799)'
        },
        'beol:hasAlternativeName': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/FauMIpsuS4-CuTTC75Dyhw',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Эйлер, Иван'
        },
        'beol:hasBirthDate': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/xVyGp_DZQca3-P9WI7_WHg',
            '@type': 'knora-api:DateValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:dateValueHasCalendar': 'GREGORIAN',
            'knora-api:dateValueHasEndDay': 12,
            'knora-api:dateValueHasEndEra': 'CE',
            'knora-api:dateValueHasEndMonth': 11,
            'knora-api:dateValueHasEndYear': 1762,
            'knora-api:dateValueHasStartDay': 12,
            'knora-api:dateValueHasStartEra': 'CE',
            'knora-api:dateValueHasStartMonth': 11,
            'knora-api:dateValueHasStartYear': 1762,
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'GREGORIAN:1762-11-12 CE'
        },
        'beol:hasBirthPlace': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/xs5qLwojQtKT29E-bb_1Cw',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Berlin'
        },
        'beol:hasDeathDate': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/4ZUt2milRVWUlEIPVZiR5g',
            '@type': 'knora-api:DateValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:dateValueHasCalendar': 'GREGORIAN',
            'knora-api:dateValueHasEndDay': 27,
            'knora-api:dateValueHasEndEra': 'CE',
            'knora-api:dateValueHasEndMonth': 9,
            'knora-api:dateValueHasEndYear': 1827,
            'knora-api:dateValueHasStartDay': 27,
            'knora-api:dateValueHasStartEra': 'CE',
            'knora-api:dateValueHasStartMonth': 9,
            'knora-api:dateValueHasStartYear': 1827,
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'GREGORIAN:1827-09-27 CE'
        },
        'beol:hasDeathPlace': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/zpaMEpqzQtWhlZKQwXhV6w',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'SPb.'
        },
        'beol:hasFamilyName': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/KtMqxfiqRKmxxb8tZPKmHg',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Euler'
        },
        'beol:hasGivenName': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/32riPiIDTfGizZ0fd6inMA',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Johann Leonhard Rudolf'
        },
        'beol:hasIAFIdentifier': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/az0DszVIQI-wLayCzSlPXg',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': '(DE-588)missing'
        },
        'beol:mentionedIn': {
            '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/sfzMtvcaQkGnjm8A6PK_2Q',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'LEOO_IVA-4_NameIndex'
        },
        'knora-api:attachedToProject': {
            '@id': 'http://rdfh.ch/projects/yTerZGyxjZVqFMNNKXCDPF'
        },
        'knora-api:attachedToUser': {
            '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
        },
        'knora-api:creationDate': {
            '@type': 'xsd:dateTimeStamp',
            '@value': '2018-08-27T17:32:12.822Z'
        },
        'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
        'rdfs:label': 'Johann Leonhard Rudolf Euler'
    }, {
        '@id': 'http://rdfh.ch/0802/test2',
        '@type': 'beol:person',
        'beol:beolIDs': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/P9iJ8GS2TDuJoXSzk0sTqg',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'EulerL, eulerl'
        },
        'beol:comment': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/XKej2KLOQDq7fxGmxdLy9w',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Mathematik, Mechanik, Astronomie, Physik; MA UBasel 1724, AdW SPb. (Adj 1726, OM 1731--41, AM 1742, OM 1766), Berlin (OM 1741, AM 1766, Direktor der Mathematischen Klasse 1744--66, AM 1766), FRS (1747), Paris (AM 1755)'
        },
        'beol:hasAlternativeName': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/QotC40r2TVGQB9fo6iFRGw',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Эйлер, Леонард (Павлович)'
        },
        'beol:hasBirthDate': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/SfiLu0yJRxmw6YGe4OywXA',
            '@type': 'knora-api:DateValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:dateValueHasCalendar': 'GREGORIAN',
            'knora-api:dateValueHasEndDay': 15,
            'knora-api:dateValueHasEndEra': 'CE',
            'knora-api:dateValueHasEndMonth': 4,
            'knora-api:dateValueHasEndYear': 1707,
            'knora-api:dateValueHasStartDay': 15,
            'knora-api:dateValueHasStartEra': 'CE',
            'knora-api:dateValueHasStartMonth': 4,
            'knora-api:dateValueHasStartYear': 1707,
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'GREGORIAN:1707-04-15 CE'
        },
        'beol:hasBirthPlace': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/vAf7P56XR9CKuluIaK2ReQ',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Basel'
        },
        'beol:hasDeathDate': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/LKPUtTs1T1e88mg2PnrJ-A',
            '@type': 'knora-api:DateValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:dateValueHasCalendar': 'GREGORIAN',
            'knora-api:dateValueHasEndDay': 18,
            'knora-api:dateValueHasEndEra': 'CE',
            'knora-api:dateValueHasEndMonth': 9,
            'knora-api:dateValueHasEndYear': 1783,
            'knora-api:dateValueHasStartDay': 18,
            'knora-api:dateValueHasStartEra': 'CE',
            'knora-api:dateValueHasStartMonth': 9,
            'knora-api:dateValueHasStartYear': 1783,
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'GREGORIAN:1783-09-18 CE'
        },
        'beol:hasDeathPlace': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/SAeKM0zNQ3WP4Zcx0T-7ng',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'SPb.'
        },
        'beol:hasDictionaryEntries': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/zumsfqF4R9arHbW6BJ-xcw',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'DSB 4, NDSB 2; PE 1; NDB 4; DBE 3; MUB 4:2820'
        },
        'beol:hasFamilyName': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/o8u2ZDV8Rj-yaZ2n7ozz3w',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Euler'
        },
        'beol:hasGivenName': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/6DQUiLNeS-qwBbhsJWqS2A',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'Leonhard'
        },
        'beol:hasIAFIdentifier': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/3gA4cU7iR1iKxlZtWrMUFg',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': '(DE-588)118531379'
        },
        'beol:mentionedIn': {
            '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/6s8qJ8KeRN-E44YHsCXEig',
            '@type': 'knora-api:TextValue',
            'knora-api:attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'knora-api:valueAsString': 'LEOO_IVA-4_Bibliography'
        },
        'knora-api:attachedToProject': {
            '@id': 'http://rdfh.ch/projects/yTerZGyxjZVqFMNNKXCDPF'
        },
        'knora-api:attachedToUser': {
            '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
        },
        'knora-api:creationDate': {
            '@type': 'xsd:dateTimeStamp',
            '@value': '2018-08-27T17:32:12.822Z'
        },
        'knora-api:hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
        'rdfs:label': 'Leonhard Euler'
    }],
    '@context': {
        'rdf': 'http://www.w3.org/1999/02/22-rdf-syntax-ns#',
        'knora-api': 'http://api.knora.org/ontology/knora-api/v2#',
        'rdfs': 'http://www.w3.org/2000/01/rdf-schema#',
        'beol': 'http://api.02.unibas.dasch.swiss:443/ontology/0801/beol/v2#',
        'xsd': 'http://www.w3.org/2001/XMLSchema#'
    }
};

const EulerCompacted = {
    '@graph': [
        {
            '@id': 'http://rdfh.ch/0802/test1compacted',
            '@type': 'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#person',
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#beolIDs': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/B4VErwphRE-MG7MwSdjtKg',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'EulerJL, eulerjl'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#comment': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/LnbIUMv7TCe4c9j9DYLswQ',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Sohn von J.A. Euler; russischer Artillerieoffizier, Oberst (1799)'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasAlternativeName': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/FauMIpsuS4-CuTTC75Dyhw',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Эйлер, Иван'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasBirthDate': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/xVyGp_DZQca3-P9WI7_WHg',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#DateValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasCalendar': 'GREGORIAN',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndDay': 12,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndMonth': 11,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndYear': 1762,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartDay': 12,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartMonth': 11,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartYear': 1762,
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'GREGORIAN:1762-11-12 CE'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasBirthPlace': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/xs5qLwojQtKT29E-bb_1Cw',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Berlin'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasDeathDate': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/4ZUt2milRVWUlEIPVZiR5g',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#DateValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasCalendar': 'GREGORIAN',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndDay': 27,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndMonth': 9,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndYear': 1827,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartDay': 27,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartMonth': 9,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartYear': 1827,
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'GREGORIAN:1827-09-27 CE'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasDeathPlace': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/zpaMEpqzQtWhlZKQwXhV6w',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'SPb.'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasFamilyName': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/KtMqxfiqRKmxxb8tZPKmHg',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Euler'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasGivenName': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/32riPiIDTfGizZ0fd6inMA',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Johann Leonhard Rudolf'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasIAFIdentifier': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/az0DszVIQI-wLayCzSlPXg',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': '(DE-588)missing'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#mentionedIn': {
                '@id': 'http://rdfh.ch/0802/VKPSBh1IRw2lLhc2r6uCfQ/values/sfzMtvcaQkGnjm8A6PK_2Q',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'LEOO_IVA-4_NameIndex'
            },
            'http://api.knora.org/ontology/knora-api/v2#attachedToProject': {
                '@id': 'http://rdfh.ch/projects/yTerZGyxjZVqFMNNKXCDPF'
            },
            'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'http://api.knora.org/ontology/knora-api/v2#creationDate': {
                '@type': 'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
                '@value': '2018-08-27T17:32:12.822Z'
            },
            'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'http://www.w3.org/2000/01/rdf-schema#label': 'Johann Leonhard Rudolf Euler'
        },
        {
            '@id': 'http://rdfh.ch/0802/test2compacted',
            '@type': 'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#person',
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#beolIDs': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/P9iJ8GS2TDuJoXSzk0sTqg',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'EulerL, eulerl'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#comment': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/XKej2KLOQDq7fxGmxdLy9w',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Mathematik, Mechanik, Astronomie, Physik; MA UBasel 1724, AdW SPb. (Adj 1726, OM 1731--41, AM 1742, OM 1766), Berlin (OM 1741, AM 1766, Direktor der Mathematischen Klasse 1744--66, AM 1766), FRS (1747), Paris (AM 1755)'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasAlternativeName': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/QotC40r2TVGQB9fo6iFRGw',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Эйлер, Леонард (Павлович)'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasBirthDate': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/SfiLu0yJRxmw6YGe4OywXA',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#DateValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasCalendar': 'GREGORIAN',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndDay': 15,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndMonth': 4,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndYear': 1707,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartDay': 15,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartMonth': 4,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartYear': 1707,
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'GREGORIAN:1707-04-15 CE'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasBirthPlace': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/vAf7P56XR9CKuluIaK2ReQ',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Basel'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasDeathDate': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/LKPUtTs1T1e88mg2PnrJ-A',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#DateValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasCalendar': 'GREGORIAN',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndDay': 18,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndMonth': 9,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasEndYear': 1783,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartDay': 18,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartEra': 'CE',
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartMonth': 9,
                'http://api.knora.org/ontology/knora-api/v2#dateValueHasStartYear': 1783,
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'GREGORIAN:1783-09-18 CE'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasDeathPlace': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/SAeKM0zNQ3WP4Zcx0T-7ng',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'SPb.'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasDictionaryEntries': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/zumsfqF4R9arHbW6BJ-xcw',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'DSB 4, NDSB 2; PE 1; NDB 4; DBE 3; MUB 4:2820'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasFamilyName': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/o8u2ZDV8Rj-yaZ2n7ozz3w',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Euler'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasGivenName': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/6DQUiLNeS-qwBbhsJWqS2A',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'Leonhard'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#hasIAFIdentifier': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/3gA4cU7iR1iKxlZtWrMUFg',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': '(DE-588)118531379'
            },
            'http://api.01.unibas.dasch.swiss/ontology/0801/beol/v2#mentionedIn': {
                '@id': 'http://rdfh.ch/0802/Vcd2vupmRuOserhk03c7Vw/values/6s8qJ8KeRN-E44YHsCXEig',
                '@type': 'http://api.knora.org/ontology/knora-api/v2#TextValue',
                'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                    '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
                },
                'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
                'http://api.knora.org/ontology/knora-api/v2#valueAsString': 'LEOO_IVA-4_Bibliography'
            },
            'http://api.knora.org/ontology/knora-api/v2#attachedToProject': {
                '@id': 'http://rdfh.ch/projects/yTerZGyxjZVqFMNNKXCDPF'
            },
            'http://api.knora.org/ontology/knora-api/v2#attachedToUser': {
                '@id': 'http://rdfh.ch/users/PSGbemdjZi4kQ6GHJVkLGE'
            },
            'http://api.knora.org/ontology/knora-api/v2#creationDate': {
                '@type': 'http://www.w3.org/2001/XMLSchema#dateTimeStamp',
                '@value': '2018-08-27T17:32:12.822Z'
            },
            'http://api.knora.org/ontology/knora-api/v2#hasPermissions': 'CR knora-base:Creator|M knora-base:ProjectMember|V knora-base:KnownUser,knora-base:UnknownUser',
            'http://www.w3.org/2000/01/rdf-schema#label': 'Leonhard Euler'
        }
    ]
};
