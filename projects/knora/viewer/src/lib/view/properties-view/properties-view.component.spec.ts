import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PropertiesViewComponent } from './properties-view.component';
import { MatCardModule, MatListModule, MatTabsModule, MatCheckboxModule } from '@angular/material';
import { HttpClientModule } from '@angular/common/http';
import { KuiCoreModule } from '@knora/core';
import { BooleanValueComponent } from '../../property/boolean-value/boolean-value.component';
import { ColorValueComponent } from '../../property/color-value/color-value.component';
import { DateValueComponent } from '../../property/date-value/date-value.component';
import { DecimalValueComponent } from '../../property/decimal-value/decimal-value.component';
import { GeometryValueComponent } from '../../property/geometry-value/geometry-value.component';
import { IntegerValueComponent } from '../../property/integer-value/integer-value.component';
import { IntervalValueComponent } from '../../property/interval-value/interval-value.component';
import { LinkValueComponent } from '../../property/link-value/link-value.component';
import { ListValueComponent } from '../../property/list-value/list-value.component';
import { TextValueAsStringComponent } from '../../property/text-value/text-value-as-string/text-value-as-string.component';
import { TextValueAsHtmlComponent } from '../../property/text-value/text-value-as-html/text-value-as-html.component';
import { TextValueAsXmlComponent } from '../../property/text-value/text-value-as-xml/text-value-as-xml.component';
import { TextfileValueComponent } from '../../property/textfile-value/textfile-value.component';
import { UriValueComponent } from '../../property/uri-value/uri-value.component';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IntElementComponent } from '../../element/int-element/int-element.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TextElementComponent } from '../../element';

describe('PropertiesViewComponent', () => {
    let component: PropertiesViewComponent;
    let fixture: ComponentFixture<PropertiesViewComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [
                BrowserAnimationsModule,
                HttpClientModule,
                MatCheckboxModule,
                KuiCoreModule,
                MatCardModule,
                MatListModule,
                MatTabsModule,
                RouterTestingModule,
                MatInputModule,
                ReactiveFormsModule,
                MatFormFieldModule
            ],
            declarations: [
                PropertiesViewComponent,
                BooleanValueComponent,
                ColorValueComponent,
                DateValueComponent,
                DecimalValueComponent,
                GeometryValueComponent,
                IntegerValueComponent,
                IntElementComponent,
                IntervalValueComponent,
                LinkValueComponent,
                ListValueComponent,
                TextValueAsStringComponent,
                TextValueAsHtmlComponent,
                TextValueAsXmlComponent,
                TextfileValueComponent,
                UriValueComponent,
                TextElementComponent
            ]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PropertiesViewComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
