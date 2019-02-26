import { Component, Input, OnInit } from '@angular/core';
import { KnoraConstants } from '@knora/core';

@Component({
  selector: 'kui-table-view',
  templateUrl: './table-view.component.html',
  styleUrls: ['./table-view.component.scss']
})
export class TableViewComponent implements OnInit {

  @Input() result;
  @Input() ontologyInfo;
  @Input() isLoading;

  KnoraConstants = KnoraConstants;

  constructor() { }

  ngOnInit() {
  }

}
