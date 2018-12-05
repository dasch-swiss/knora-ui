import { Component, OnInit } from '@angular/core';
import { AppDemo } from '../../app.config';
import { ActivatedRoute } from '@angular/router';
import { Example } from '../../app.interfaces';

@Component({
  selector: 'app-search-demo',
  templateUrl: './search-demo.component.html',
  styleUrls: ['./search-demo.component.scss']
})
export class SearchDemoComponent implements OnInit {


  constructor() {

  }

  ngOnInit() { }

}
