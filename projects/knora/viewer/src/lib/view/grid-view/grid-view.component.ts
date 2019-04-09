import { Component, Input, OnInit } from '@angular/core';
import { KnoraConstants, OntologyInformation } from '@knora/core';
import { Router } from '@angular/router';

@Component({
  selector: 'kui-grid-view',
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent implements OnInit {

  @Input() result: any;
  @Input() ontologyInfo: OntologyInformation;
  // @Input() isLoading: boolean;

  KnoraConstants = KnoraConstants;

  constructor(
    private _router: Router
  ) { }

  ngOnInit() {
  }

  openResource(id: string) {
    const url: string = '/resource/' + encodeURIComponent(id);
    this._router.navigate([url]);
}
}
