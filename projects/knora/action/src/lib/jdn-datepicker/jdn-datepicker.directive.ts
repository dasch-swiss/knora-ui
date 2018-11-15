import { Directive } from '@angular/core';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';
import { DateAdapter, MAT_DATE_LOCALE } from '@angular/material';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';

/**
* JdnDatepickerDirective creates a wrapper element that provides a new adapter with each instance of the datepicker.
*/
@Directive({
    selector: 'jdn-datepicker',
    providers: [
        { provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter, deps: [MAT_DATE_LOCALE] }
    ]
})
export class JdnDatepickerDirective {
    constructor(private adapter: DateAdapter<JDNConvertibleCalendar>) { }
}
