import { Component, Inject, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { KnoraConstants, PropertyValue, Value, ValueLiteral } from '@knora/core';
import { IntElementComponent } from '@knora/viewer';

// https://stackoverflow.com/questions/45661010/dynamic-nested-reactive-form-expressionchangedafterithasbeencheckederror
const resolvedPromise = Promise.resolve(null);

@Component({
    selector: 'integer-value',
    templateUrl: './integer-value.component.html',
    styleUrls: ['./integer-value.component.scss']
})
export class IntegerValueComponent implements PropertyValue {

    @ViewChild('integerVal', {static: false}) integerValueElement: IntElementComponent;

    // parent FormGroup
    @Input() formGroup: FormGroup;

    type = KnoraConstants.IntValue;

    getValue(): Value {
        return new ValueLiteral(String(this.integerValueElement.eleVal), KnoraConstants.xsdInteger);
    }

}
