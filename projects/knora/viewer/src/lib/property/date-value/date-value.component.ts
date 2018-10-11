import { Component, Input, OnInit } from '@angular/core';
import { DateSalsah, ReadDateValue } from '@knora/core';

@Component({
  selector: 'kui-date-value',
  templateUrl: './date-value.component.html',
  styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent implements OnInit {

  @Input() valueObject: ReadDateValue;
  @Input() calendar?: boolean;
  @Input() era?: boolean;

  date: DateSalsah;

  constructor() { }

  ngOnInit() {
    this.date = this.valueObject.getDate();
  }

}
