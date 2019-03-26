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

    usage = `<p>To set the search bar, you have to add a <b>&lt;kui-search&gt;</b> tag wherever you want in your template. <br>Customize the input "[route]" to match your own route.<br>For example in search.component.html:<b> &lt;kui-search [route]="'/modules/search'"&gt;&lt;/kui-search&gt;</b></p>`;

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
