import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import {
    DateAdapter,
    MAT_DATE_LOCALE,
    MatDatepickerModule,
    MatFormFieldModule,
    MatNativeDateModule
} from '@angular/material';

import { JdnDatepickerDirective } from './jdn-datepicker.directive';
import { JDNConvertibleCalendarDateAdapter } from 'jdnconvertiblecalendardateadapter';
import { JDNConvertibleCalendar } from 'jdnconvertiblecalendar';
import { DateValueComponent } from '../../../../search/src/lib/extended-search/select-property/specify-property-value/date-value/date-value.component';

describe('JdnDatepickerDirective', () => {
    let component: DateValueComponent;
    let fixture: ComponentFixture<DateValueComponent>;
    let jdnDatepicker: DebugElement;
    let adapter: DateAdapter<JDNConvertibleCalendar>;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, FormsModule, ReactiveFormsModule],
            declarations: [DateValueComponent, JdnDatepickerDirective],
            providers: [
                { provide: DateAdapter, useClass: JDNConvertibleCalendarDateAdapter, deps: [MAT_DATE_LOCALE] }
            ]
        });
        fixture = TestBed.createComponent(DateValueComponent);
        component = fixture.componentInstance;
        jdnDatepicker = fixture.debugElement.query(By.css('jdnDatepicker'));
    });

    it('should create an instance', () => {
        const directive = new JdnDatepickerDirective(adapter);
        expect(directive).toBeTruthy();
    });

});
