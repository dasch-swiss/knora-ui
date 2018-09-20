import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../app.demo';
import { ActivatedRoute } from '@angular/router';
import { Example } from '../../app.interfaces';

@Component({
  selector: 'app-search-demo',
  templateUrl: './search-demo.component.html',
  styleUrls: ['./search-demo.component.scss']
})
export class SearchDemoComponent implements OnInit {

  partOf = AppDemo.searchModule;


    // demo configuration incl. code to display
    searchPanel: Example = {
        title: 'Search Panel',
        subtitle: '',
        name: 'searchpanel',
        code: {
            html: `
            <kui-search [route]="'/modules/search'"></kui-search>
            
            <router-outlet></router-outlet>`,
            ts: '',
            scss: ''
        }
    };

  constructor(private _route: ActivatedRoute) {
    this._route.data
      .subscribe(
        (mod: any) => {
          this.partOf = mod.partOf;
        }
      );
  }

  ngOnInit() { }

}
