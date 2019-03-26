import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

/**
 * The search-panel contains the kui-fulltext-search and the kui-extended-search components.
 */
@Component({
    selector: 'app-search-panel',
    templateUrl: './search-panel.component.html',
    styleUrls: ['./search-panel.component.scss']
})
export class SearchPanelComponent implements OnInit {

    module = AppDemo.searchModule;

    // demo configuration incl. code to display
    searchPanel: Example = {
        title: 'Search Panel',
        subtitle: '',
        name: 'searchpanel',
        code: {
            html: `
<kui-search-panel [route]="'/search/'"></kui-search>

<router-outlet></router-outlet>`,
            ts: '',
            scss: ''
        }
    };

    constructor() { }


    ngOnInit() {

    }

}
