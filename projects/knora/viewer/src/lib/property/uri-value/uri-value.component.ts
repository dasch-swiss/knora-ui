import { Component, Input, OnInit } from '@angular/core';
import { ReadUriValue } from '@knora/core';

@Component({
  selector: 'kui-uri-value',
  templateUrl: './uri-value.component.html',
  styleUrls: ['./uri-value.component.scss']
})
export class UriValueComponent implements OnInit {

  @Input() valueObject: ReadUriValue;

  constructor() { }

  ngOnInit() {
  }

}
