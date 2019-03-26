import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';

@Component({
    selector: 'app-fulltext-search',
    templateUrl: './fulltext-search.component.html',
    styleUrls: ['./fulltext-search.component.scss']
})
export class FulltextSearchComponent implements OnInit {
    module = AppDemo.searchModule;

    // full-text search: demo configuration incl. code to display
    searchFulltext: Example = {
        title: 'Full-text search',
        subtitle: '',
        name: 'fulltext-search',
        code: {
            html: `
<!-- param route is where the router-outlet is defined for search results -->
<kui-fulltext-search [route]="'/search'"></kui-fulltext-search>

<router-outlet></router-outlet>`,
            ts: '',
            scss: ''
        }
    };

    // full-text search with project filter: demo configuration incl. code to display
    searchFulltextProject: Example = {
        title: 'Full-text search with project filter',
        subtitle: '',
        name: 'fulltext-search',
        code: {
            html: `
    <!-- param route is where the router-outlet is defined for search results -->
    <kui-fulltext-search [route]="'/search'" [projectfilter]="true"></kui-fulltext-search>

    <router-outlet></router-outlet>`,
            ts: '',
            scss: ''
        }
    };

    constructor() {}

    ngOnInit() {}
}
