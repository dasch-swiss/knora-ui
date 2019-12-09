import { Component, Input } from '@angular/core';
import { KnoraDate, KnoraPeriod, Precision, ReadDateValue } from '@knora/api';

@Component({
    selector: 'kui-date-value',
    templateUrl: './date-value.component.html',
    styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent {

    @Input()
    set calendar(value: boolean) {
        this._calendar = value;
    }

    get calendar() {
        return this._calendar;
    }

    @Input()
    set era(value: boolean) {
        this._era = value;
    }

    get era() {
        return this._era;
    }

    @Input()
    set valueObject(value: ReadDateValue) {
        this._dateValueObj = value;

        const dateOrRange: KnoraDate | KnoraPeriod = this.valueObject.date;
        if (dateOrRange instanceof KnoraPeriod) {
            // period (start and end dates)
            this.period = true;
            this.dates = [this.getJSDate(dateOrRange.start), this.getJSDate(dateOrRange.end)];
        } else {
            // single date
            this.period = false;
            this.dates = [this.getJSDate(dateOrRange)];
        }

    }

    get valueObject() {
        return this._dateValueObj;
    }

    dates: DateFormatter[];
    period: boolean;
    private _calendar: boolean;
    private _era: boolean;
    private _dateValueObj: ReadDateValue;

    constructor() { }

    /**
     * Converts a `KnoraDate` to a JS Date, providing necessary formatting information.
     * JULIAN and GREGORIAN calendar are the only available for the moment.
     *
     * @param date the date to be converted.
     * @return DateFormatter.
     */
    getJSDate(date: KnoraDate): DateFormatter {

        if (date.precision === Precision.yearPrecision) {
            return {
                format: 'yyyy',
                date: new Date(date.year.toString()),
                era: date.era,
                calendar: date.calendar
            };
        } else if (date.precision === Precision.monthPrecision) {
            return {
                format: 'MMMM ' + 'yyyy',
                date: new Date(date.year, date.month - 1, 1), // 0 base month
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
