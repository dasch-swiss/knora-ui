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

    // demo configuration incl. code to display
    searchPanel: Example = {
        title: 'Search Panel',
        subtitle: '',
        name: 'searchpanel',
        code: {
            html: `
<!-- param route is where the router-outlet is defined for search results -->
<kui-search [route]="'/search/'"></kui-search>

<router-outlet></router-outlet>`,
            ts: '',
            scss: ''
        }
    };

    constructor() {}

    ngOnInit() {}
}
