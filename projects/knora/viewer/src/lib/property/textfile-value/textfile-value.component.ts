import { Component, Input, OnInit } from '@angular/core';
import { KnoraConstants, ReadLinkValue } from '@knora/core';

@Component({
  selector: 'kui-textfile-value',
  templateUrl: './textfile-value.component.html',
  styleUrls: ['./textfile-value.component.scss']
})
export class TextfileValueComponent implements OnInit {

  @Input() valueObject: ReadLinkValue;

  KnoraConstants = KnoraConstants;

  constructor() { }

  ngOnInit() {
  }

}
