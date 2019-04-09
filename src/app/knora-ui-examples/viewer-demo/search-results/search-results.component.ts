import { Component, OnInit } from '@angular/core';
import { AppDemo } from 'src/app/app.config';
import { Example } from 'src/app/app.interfaces';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrls: ['./search-results.component.scss']
})
export class SearchResultsComponent implements OnInit {

  module = AppDemo.searchModule;

  // demo configuration incl. code to display
  searchResults: Example = {
    title: 'Search Results',
    subtitle: '',
    name: 'searchresults',
    code: {
      html: `
<!-- param route is where the router-outlet is defined for search results -->
<kui-search-results></kui-search-results>

<router-outlet></router-outlet>`,
      ts: '',
      scss: ''
    }
  };

  constructor() { }

  ngOnInit() {
  }

}
