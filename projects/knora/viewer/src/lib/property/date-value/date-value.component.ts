import { Component, Input, OnInit } from '@angular/core';
import { DateRangeSalsah, DateSalsah, Precision, ReadDateValue } from '@knora/core';

@Component({
  selector: 'kui-date-value',
  templateUrl: './date-value.component.html',
  styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent implements OnInit {

  @Input() valueObject: ReadDateValue;
  @Input() calendar?: boolean;
  @Input() era?: boolean;

  dates: DateFormatter[];
  period: boolean;

  constructor() { }

  ngOnInit() {
    const dateOrRange = this.valueObject.getDateSalsah();
    if (dateOrRange instanceof DateRangeSalsah) {
      // period (start and end dates)
      this.period = true;
      this.dates = [this.getJSDate(dateOrRange.start), this.getJSDate(dateOrRange.end)];
    } else {
      // one date
      this.period = false;
      this.dates = [this.getJSDate(dateOrRange)];
    }
  }

  /**
   * Converts a `DateSalsah` to a JS Date, providing necessary formatting information.
   * JULIAN and GREGORIAN calendar are the only available for the moment.
   *
   * @param date the date to be converted.
   * @return DateFormatter.
   */
  getJSDate(date: DateSalsah): DateFormatter {

    if (date.precision === Precision.yearPrecision) {
      return {
        format: 'yyyy',
        date: new Date(date.year),
        era: date.era,
        calendar: date.calendar
      };
    } else if (date.precision === Precision.monthPrecision) {
      return {
        format: 'MMMM ' + 'yyyy',
        date: new Date(date.year, date.month - 1), // 0 base month
        era: date.era,
        calendar: date.calendar
      };
    } else if (date.precision === Precision.dayPrecision) {
      return {
        format: 'longDate',
        date: new Date(date.year, date.month - 1, date.day),  // 0 base month
        era: date.era,
        calendar: date.calendar
      };
    } else {
      console.error('Error: incorrect precision for date');
    }

  }

}

/**
 * Date structure for the template
 */
export interface DateFormatter {
  format: string;
  date: Date;
  era: string;
  calendar: string;
}
