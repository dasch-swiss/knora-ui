import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';

@Component({
    selector: 'app-search-results',
    templateUrl: './search-results.component.html',
    styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

    module = AppDemo.viewerModule;

    // demo configuration incl. code to display for the simple search results
    simpleSearchResults: Example = {
        title: 'Simple Search Results',
        subtitle: '',
        name: 'search-results',
        code: {
            html: `
<kui-search-results></kui-search-results>`,
            ts: '',
            scss: ''
        }
    };

    // demo configuration incl. code to display for search results filtered by project
    searchResultsByProject: Example = {
        title: 'Search Results filtered by Project',
        subtitle: '',
        name: 'search-results',
        code: {
            html: `
<kui-search-results [projectIri]="projectIri"></kui-search-results>`,
            ts: `
export class SearchResultsComponent {

    projectIri = 'http://rdfh.ch/projects/0001';  // project iri

    constructor() { }

}`,
            scss: ''
        }
    };

    // demo configuration incl. code to display for search results with search mode and query params
    searchResultsWithModeAndParams: Example = {
        title: 'Search Results with search mode and query parameters',
        subtitle: '',
        name: 'search-results',
        code: {
            html: `
<!-- example of an extended search where we pass a gravsearch query as search parameter -->
<kui-search-results [searchMode]="'extended'" [searchQuery]="gravsearch"></kui-search-results>`,
            ts: `
export class SearchResultsComponent {

    gravsearch: string = \`PREFIX knora-api: <http://api.knora.org/ontology/knora-api/simple/v2#>
                        CONSTRUCT {
                        ?mainRes knora-api:isMainResource true .
                        } WHERE {
                        ?mainRes a knora-api:Resource .
                        ?mainRes a <http://0.0.0.0:3333/ontology/0001/anything/simple/v2#BlueThing> .
                        }
                        OFFSET 0\`;

    constructor() { }
}`,
            scss: ''
        }
    };

    constructor() { }

    ngOnInit() {
    }

}
