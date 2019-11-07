import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
@Component({
  selector: 'kui-int-element',
  templateUrl: './int-element.component.html',
  styleUrls: ['./int-element.component.scss']
})
export class IntElementComponent implements OnInit {

    @Input() formGroup: FormGroup;

    @Input() set intVal(value: number) {
        this._intVal = value || null;
    }

    @Input() readonlyValue = false;

    _intVal: number;

    form: FormGroup;

    constructor (@Inject(FormBuilder) private fb: FormBuilder) {

    }

    ngOnInit() {

        this.form = this.fb.group({
            integer: [this._intVal, Validators.compose([Validators.required, Validators.pattern(/^-?\d+$/)])] // only allow for integer values (no fractions)
        });

    }

}
