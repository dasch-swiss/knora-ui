import { Component, Host, Inject, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { KnoraConstants, PropertyValue, Value, ValueLiteral } from '@knora/core';
import { GregorianCalendarDate, JDNConvertibleCalendar, JDNPeriod } from 'jdnconvertiblecalendar';
import { HeaderComponent } from './header-calendar/header-calendar.component';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'date-value',
    templateUrl: './date-value.component.html',
    styleUrls: ['./date-value.component.scss', '../../../../assets/style/search.scss']
})
export class DateValueComponent implements OnInit, OnDestroy, PropertyValue {

    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = KnoraConstants.DateValue;

    form: FormGroup;

    // custom header for the datepicker
    headerComponent = HeaderComponent;

    constructor (@Inject(FormBuilder) private fb: FormBuilder) {
    }

    ngOnInit() {

        // init datepicker
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
        // get calendar period
        const calendarPeriod = dateObj.toCalendarPeriod();
        // get the date
        const dateString = `${calendarFormat.toUpperCase()}:${calendarPeriod.periodStart.year}-${calendarPeriod.periodStart.month}-${calendarPeriod.periodStart.day}:${calendarPeriod.periodEnd.year}-${calendarPeriod.periodEnd.month}-${calendarPeriod.periodEnd.day}`;

        return new ValueLiteral(String(dateString), KnoraConstants.dateSimple);
    }
}
