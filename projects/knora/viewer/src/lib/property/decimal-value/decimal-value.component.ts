import { Component, Input, OnInit } from '@angular/core';
import { ReadDecimalValue } from '@knora/core';

@Component({
  selector: 'kui-decimal-value',
  templateUrl: './decimal-value.component.html',
  styleUrls: ['./decimal-value.component.scss']
})
export class DecimalValueComponent implements OnInit {

  @Input() valueObject: ReadDecimalValue;

  decimal: number;

  constructor() { }

  ngOnInit() {
    this.decimal = this.valueObject.decimal;
  }

}
