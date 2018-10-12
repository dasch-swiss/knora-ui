import { Component, Input, OnInit } from '@angular/core';
import { ReadGeomValue } from '@knora/core';

@Component({
  selector: 'kui-geometry-value',
  templateUrl: './geometry-value.component.html',
  styleUrls: ['./geometry-value.component.scss']
})
export class GeometryValueComponent implements OnInit {

  @Input() valueObject: ReadGeomValue;

  geometry: string;

  constructor() { }

  ngOnInit() {
    this.geometry = this.valueObject.geometryString;
  }

}
