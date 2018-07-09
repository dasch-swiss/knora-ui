import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../app.config';

@Component({
  selector: 'app-search-demo',
  templateUrl: './search-demo.component.html',
  styleUrls: ['./search-demo.component.scss']
})
export class SearchDemoComponent implements OnInit {

  partOf = AppDemo.searchModule;

  constructor() { }

  ngOnInit() {
  }

}
