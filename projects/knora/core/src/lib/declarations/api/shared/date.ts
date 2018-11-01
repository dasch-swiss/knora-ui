/**
 * Precision for DateSalsah.
 */
export enum Precision {
    yearPrecision,
    monthPrecision,
    dayPrecision
}

/**
 * Represents a Salsah date object with a precision information.
 */
export class DateSalsah {

    precision: Precision;

    constructor(
        readonly calendar: string,
        readonly era: string,
        readonly year: number,
        readonly month?: number,
        readonly day?: number
    ) {
        if (this.month === undefined) {
            // year precision
            this.precision = Precision.yearPrecision;
        } else if (this.day === undefined) {
            // month precision
            this.precision = Precision.monthPrecision;
        } else {
            // day precision
            this.precision = Precision.dayPrecision;
        }

    }

}

/**
 * Represents a period (with start date and end date).
 */
export class DateRangeSalsah {

    constructor(
        readonly start: DateSalsah,
        readonly end: DateSalsah
    ) {
    }
}
