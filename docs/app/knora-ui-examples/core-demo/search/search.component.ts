import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-search',
    templateUrl: './search.component.html',
    styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

    module = AppDemo.coreModule;

    exampleFulltextSearchCountQuery: Example = {
        title: 'doFulltextSearchCountQuery(searchTerm)',
        subtitle: 'Perform a fulltext search count query.',
        name: 'doFulltextSearchCountQuery',
        code: {
            html: `<p>Number of results: {{numberOfAllResults}}<p>`,
            ts: `
searchTerm: string; // provided parameters
numberOfAllResults: number; // total number of results (count query)

constructor(
    private _searchService: SearchService) {}

getCountQueryResult() {
    // perform count query
    this._searchService.doFulltextSearchCountQuery(searchTerm)
    .subscribe(
        this.showNumberOfAllResults;
    );
}

/**
 * Shows total number of results returned by a count query.
 *
 * @param {ApiServiceResult} countQueryResult the response to a count query.
 */
private showNumberOfAllResults = (countQueryResult: ApiServiceResult) => {

    const resPromises = jsonld.promises;
    // compact JSON-LD using an empty context: expands all Iris
    const resPromise = resPromises.compact(countQueryResult.body, {});

    resPromise.then((compacted) => {
        this.numberOfAllResults = compacted[KnoraConstants.schemaNumberOfItems];
    });
}
`,
            scss: ``
        }
    };

    exampleExtendedSearch: Example = {
        title: 'doExtendedSearch(searchTerm)',
        subtitle: 'Perform the extended search.',
        name: 'doExtendedSearch',
        code: {
            html: ``,
            ts: `
searchTerm: string; // provided parameters

constructor(
    private _searchService: SearchService) {}

getExtendedSearchResult() {
    // perform the extended search
    this._searchService.doExtendedSearch(searchTerm)
    .subscribe(
        // e.g. convert search results from JSON-LD to a [[ReadResourcesSequence]]
        // and requests information about ontology entities.
    );
}
`,
            scss: ``
        }
    };

    constructor() {
    }

    ngOnInit() {
    }

}
