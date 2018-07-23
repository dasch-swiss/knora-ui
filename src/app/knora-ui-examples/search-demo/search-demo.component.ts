import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../app.config';
import { ActivatedRoute } from '@angular/router';
import { GravSearchService } from '@knora/core';

@Component({
  selector: 'app-search-demo',
  templateUrl: './search-demo.component.html',
  styleUrls: ['./search-demo.component.scss']
})
export class SearchDemoComponent implements OnInit {

  partOf = AppDemo.searchModule;

  result: string;

  constructor(private _route: ActivatedRoute, private gravSearchService: GravSearchService) {
    this._route.data
      .subscribe(
        (mod: any) => {
          this.partOf = mod.partOf;
        }
      );
  }

  ngOnInit() {
    // this.getSearch();
  }

  /* getSearch() {
    this.result = JSON.parse(localStorage.getItem('prevSearch'));
    return this.result;
  } */

}
