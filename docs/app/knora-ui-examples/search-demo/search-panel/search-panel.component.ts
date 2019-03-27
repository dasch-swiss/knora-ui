import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

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

    constructor() {}

    ngOnInit() {}
}
