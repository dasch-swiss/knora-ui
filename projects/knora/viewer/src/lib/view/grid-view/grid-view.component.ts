import { Component, Input, OnInit } from '@angular/core';
import { KnoraConstants } from '@knora/core';
import { Router } from '@angular/router';

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
