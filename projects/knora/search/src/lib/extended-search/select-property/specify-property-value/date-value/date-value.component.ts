import { Component, Host, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { KnoraConstants, PropertyValue, Value, ValueLiteral } from '@knora/core';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { DateAdapter, MatCalendar } from '@angular/material';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'date-value',
    templateUrl: './date-value.component.html',
    styleUrls: ['./date-value.component.scss']
})
export class DateValueComponent implements OnInit, OnDestroy, PropertyValue {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = KnoraConstants.DateValue;

    form: FormGroup;

    // custom header for the datepicker
    headerComponent = HeaderComponent;

    constructor(@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {

        this.form = this.fb.group({
            dateValue: [null, Validators.compose([Validators.required])]
        });

        this.form.valueChanges.subscribe((data) => {
            // console.log(data.dateValue);
        });

        resolvedPromise.then(() => {
            // add form to the parent form group
            this.formGroup.addControl('propValue', this.form);
        });

    }

    ngOnDestroy() {

        // remove form from the parent form group
        resolvedPromise.then(() => {
            this.formGroup.removeControl('propValue');
        });

    }

    getValue(): Value {

        const dateObj: JDNConvertibleCalendar = this.form.value.dateValue;

        // get calendar format
        const calendarFormat = dateObj.calendarName;

        const calendarPeriod = dateObj.toCalendarPeriod();

        const dateString = `${calendarFormat.toUpperCase()}:${calendarPeriod.periodStart.year}-${calendarPeriod.periodStart.month}-${calendarPeriod.periodStart.day}:${calendarPeriod.periodEnd.year}-${calendarPeriod.periodEnd.month}-${calendarPeriod.periodEnd.day}`;

        return new ValueLiteral(String(dateString), KnoraConstants.DateValue);
    }
}

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
