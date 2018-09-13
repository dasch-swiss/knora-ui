import { Component, Directive, Host, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnoraConstants, PropertyValue, Value, ValueLiteral } from '@knora/core';
import { GregorianCalendarDate, JDNConvertibleCalendar, JDNPeriod } from 'jdnconvertiblecalendar';
import { DateAdapter, MAT_DATE_LOCALE, MatCalendar } from '@angular/material';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';

/** Custom header component containing a calendar format switcher */
@Component({
    selector: 'kui-calendar-header',
    template: `
      <mat-select placeholder="Calendar Format" [formControl]="form.controls['calendar']">
        <mat-option *ngFor="let cal of supportedCalendarFormats" [value]="cal">{{cal}}</mat-option>
      </mat-select>
      <mat-calendar-header></mat-calendar-header>
    `,
    styleUrls: []
})
export class HeaderComponent<D> implements OnInit {
    constructor(@Host() private _calendar: MatCalendar<JDNConvertibleCalendar>,
        private _dateAdapter: DateAdapter<JDNConvertibleCalendar>,
        @Inject(FormBuilder) private fb: FormBuilder) {
    }

    form: FormGroup;

    // a list of supported calendar formats (Gregorian and Julian)
    supportedCalendarFormats = JDNConvertibleCalendar.supportedCalendars;

    // the currently active calendar format
    activeFormat;

    ngOnInit() {

        // get the currently active calendar format from the date adapter
        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {
            this.activeFormat = this._dateAdapter.activeCalendarFormat;
        } else {
            console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
        }

        // build a form for the calendar format selection
        this.form = this.fb.group({
            calendar: [this.activeFormat, Validators.required]
        });

        // do the conversion when the user selects another calendar format
        this.form.valueChanges.subscribe((data) => {
            // pass the target calendar format to the conversion method
            this.convertDate(data.calendar);
        });

    }

    /**
     * Converts the date into the target format.
     *
     * @param calendar the target calendar format.
     */
    convertDate(calendar: 'Gregorian' | 'Julian') {

        if (this._dateAdapter instanceof JDNConvertibleCalendarDateAdapter) {

            // convert the date into the target calendar format
            const convertedDate = this._dateAdapter.convertCalendarFormat(this._calendar.activeDate, calendar);

            // set the new date
            this._calendar.activeDate = convertedDate;

            // select the new date in the datepicker UI
            this._calendar._dateSelected(convertedDate);

            // update view after calendar format conversion
            const view = this._calendar.currentView === 'month' ? this._calendar.monthView :
                (this._calendar.currentView === 'year' ? this._calendar.yearView : this._calendar.multiYearView);

            view.ngAfterContentInit();
        } else {
            console.log('date adapter is expected to be an instance of JDNConvertibleCalendarDateAdapter');
        }
    }
}
