import { Component, Input, OnInit } from '@angular/core';
import { KnoraConstants } from '@knora/core';

@Component({
  selector: 'kui-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit {

  @Input() result;
  @Input() ontologyInfo;
  @Input() isLoading;

  KnoraConstants = KnoraConstants;

  constructor() { }

  ngOnInit() {
  }

}
