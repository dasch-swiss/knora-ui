import { Component, Input, OnInit } from '@angular/core';
import { DateRangeSalsah, DateSalsah, ReadDateValue } from '@knora/core';

@Component({
  selector: 'kui-date-value',
  templateUrl: './date-value.component.html',
  styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent implements OnInit {

  @Input() valueObject: ReadDateValue;
  @Input() calendar?: boolean;
  @Input() era?: boolean;

  date: DateSalsah | DateRangeSalsah;

  constructor() { }

  ngOnInit() {
    this.date = this.valueObject.getDateSalsah();
  }

}
