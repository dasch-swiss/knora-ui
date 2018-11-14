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

    private static separator = '-';

    readonly precision: Precision;

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

    /**
     * Returns a string representation of the date with the calendar.
     *
     * @returns {string}
     */
    getDateAsStringWithCalendar() {
        return this.calendar + ':' + this.getDateAsString();
    }

    /**
     * Returns a string representation of the date (without calendar).
     *
     * @returns {string}
     */
    getDateAsString(): string {

        let dateString = '(' + this.era + ') ';

        switch (this.precision) {

            case Precision.yearPrecision: {
                dateString += this.year.toString();
                break;
            }

            case Precision.monthPrecision: {
                dateString += this.year + DateSalsah.separator + this.month;
                break;
            }

            case Precision.dayPrecision: {
                dateString += this.year + DateSalsah.separator + this.month + DateSalsah.separator + this.day;
                break;
            }

            default: {
                break;
            }

        }

        return dateString;
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

    /**
     * Returns a string representation of the date range (with preceding calendar).
     *
     * @returns {string}
     */
    getDateAsString() {
        return this.start.getDateAsStringWithCalendar() + ':' + this.end.getDateAsString();
    }
}
