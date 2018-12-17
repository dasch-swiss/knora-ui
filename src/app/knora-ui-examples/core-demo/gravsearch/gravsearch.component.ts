import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-gravsearch',
    templateUrl: './gravsearch.component.html',
    styleUrls: ['./gravsearch.component.scss']
})
export class GravsearchComponent implements OnInit {

    module = AppDemo.coreModule;

    exampleGravSearch: Example = {
        title: 'getAllGroups()',
        subtitle: 'returns a list of all (project specific) groups',
        name: 'getAllGroups',
        code: {
            html: ``,
            ts: `
// iri of the resource class
const resClass: string;

// selected properties to filter by 
const properties: PropertyWithValue[];

const gravsearch: string = this._gravSearchService.createGravsearchQuery(properties, resClass, 0);
                    
// e.g. you can use the generated gravsearch query with the 
// searchService and the method doExtendedSearch(gravsearch)
`,
            scss: ``
        }
    };

    constructor() {
    }

    ngOnInit() {
    }

}
