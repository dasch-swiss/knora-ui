import { Component, Input, ViewChild } from '@angular/core';

import { FormGroup } from '@angular/forms';
import { KnoraConstants, PropertyValue, Value, ValueLiteral } from '@knora/core';
import { TextElementComponent } from '@knora/viewer';

@Component({
    selector: 'text-value',
    templateUrl: './text-value.component.html',
    styleUrls: ['./text-value.component.scss']
})
export class TextValueComponent implements PropertyValue {

    @ViewChild('stringVal', {static: false}) stringValueElement: TextElementComponent;

    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = KnoraConstants.TextValue;

    getValue(): Value {
        return new ValueLiteral(String(this.stringValueElement.eleVal), KnoraConstants.xsdString);
    }

}
