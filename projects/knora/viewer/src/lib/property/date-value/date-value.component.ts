import { Component, Input, OnInit } from '@angular/core';
import { ReadDateValue } from '@knora/core';

@Component({
  selector: 'kui-date-value',
  templateUrl: './date-value.component.html',
  styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent implements OnInit {

  @Input() valueObject: ReadDateValue;

  constructor() { }

  ngOnInit() {
  }

}
