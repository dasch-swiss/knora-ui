import { Component, Input, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { KnoraConstants, PropertyValue, Value, ValueLiteral } from '@knora/core';
import { UriElementComponent } from '@knora/viewer';

@Component({
    selector: 'uri-value',
    templateUrl: './uri-value.component.html',
    styleUrls: ['./uri-value.component.scss']
})
export class UriValueComponent implements PropertyValue {

    @ViewChild('uriVal', {static: false}) uriValueElement: UriElementComponent;

    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = KnoraConstants.UriValue;

    getValue(): Value {

        return new ValueLiteral(String(this.uriValueElement.eleVal), KnoraConstants.xsdUri);
    }

}
