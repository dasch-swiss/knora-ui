import { DateRangeSalsah, DateSalsah, Precision } from './date';
/**
 * @deprecated DataSalsah is deprecated since v10.0.0; It's replaced by KnoraDate from knora-api-js-lib
 */
/*
xdescribe('DateSalsah', () => {

    xit('should create a DateSalsah with day precision', () => {
        const date = new DateSalsah('Gregorian', 'CE', 2018, 11, 14);

        expect(date).toBeTruthy();

        expect(date.year).toEqual(2018);
        expect(date.month).toEqual(11);
        expect(date.day).toEqual(14);

        expect(date.precision).toEqual(Precision.dayPrecision);

        expect(date.getDateAsString()).toEqual('Gregorian:(CE) 2018-11-14');

        expect(date.getDateAsStringWithoutCalendar()).toEqual('(CE) 2018-11-14');
    });

    xit('should create a DateSalsah with month precision', () => {
        const date = new DateSalsah('Gregorian', 'CE', 2018, 11);

        expect(date).toBeTruthy();

        expect(date.year).toEqual(2018);
        expect(date.month).toEqual(11);

        expect(date.precision).toEqual(Precision.monthPrecision);

        expect(date.getDateAsString()).toEqual('Gregorian:(CE) 2018-11');
        expect(date.getDateAsStringWithoutCalendar()).toEqual('(CE) 2018-11');
    });

    xit('should create a DateSalsah with year precision', () => {
        const date = new DateSalsah('Gregorian', 'CE', 2018);

        expect(date).toBeTruthy();

        expect(date.year).toEqual(2018);

        expect(date.precision).toEqual(Precision.yearPrecision);

        expect(date.getDateAsString()).toEqual('Gregorian:(CE) 2018');
        expect(date.getDateAsStringWithoutCalendar()).toEqual('(CE) 2018');
    });

    xit('should create a DateRangeSalsah ', () => {
        const date1 = new DateSalsah('Gregorian', 'CE', 2018, 11, 14);
        const date2 = new DateSalsah('Gregorian', 'CE', 2018, 11, 15);

        expect(date1).toBeTruthy();
        expect(date2).toBeTruthy();

        const range = new DateRangeSalsah(date1, date2);

        expect(range).toBeTruthy();

        expect(range.getDateAsString()).toEqual('Gregorian:(CE) 2018-11-14:(CE) 2018-11-15');
    });

});
*/
