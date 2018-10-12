import { Component, Input, OnInit } from '@angular/core';
import { ReadListValue } from '@knora/core';

@Component({
  selector: 'kui-list-value',
  templateUrl: './list-value.component.html',
  styleUrls: ['./list-value.component.scss']
})
export class ListValueComponent implements OnInit {

  @Input() valueObject: ReadListValue;

  nodeLabel: string;

  constructor() { }

  ngOnInit() {
    this.nodeLabel = this.valueObject.listNodeLabel;
  }

}
