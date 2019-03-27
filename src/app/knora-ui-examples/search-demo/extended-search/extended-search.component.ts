import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';

@Component({
    selector: 'app-extended-search',
    templateUrl: './extended-search.component.html',
    styleUrls: ['./extended-search.component.scss']
})
export class ExtendedSearchComponent implements OnInit {
    module = AppDemo.searchModule;

    // demo configuration incl. code to display
    searchPanel: Example = {
        title: 'Search Panel',
        subtitle: '',
        name: 'searchpanel',
        code: {
            html: `
<!-- param route is where the router-outlet is defined for search results -->
<kui-extended-search [route]="'/search'"></kui-search>

<router-outlet></router-outlet>`,
            ts: '',
            scss: ''
        }
    };

    constructor() {}

    ngOnInit() {}
}
