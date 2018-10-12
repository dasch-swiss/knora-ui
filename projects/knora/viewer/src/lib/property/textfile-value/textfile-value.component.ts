import { Component, Input, OnInit } from '@angular/core';
import { KnoraConstants, ReadTextFileValue } from '@knora/core';

@Component({
  selector: 'kui-textfile-value',
  templateUrl: './textfile-value.component.html',
  styleUrls: ['./textfile-value.component.scss']
})
export class TextfileValueComponent implements OnInit {

  @Input() valueObject: ReadTextFileValue;

  fileUrl;

  constructor() { }

  ngOnInit() {
    this.fileUrl = this.valueObject.makeUrl;
  }

}
