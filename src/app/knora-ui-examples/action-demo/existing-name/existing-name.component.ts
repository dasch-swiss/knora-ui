import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { existingNamesValidator } from '@knora/action';
import { AppDemo } from '../../../app.config';
import { Example } from '../../../app.interfaces';

@Component({
    selector: 'app-existing-name',
    templateUrl: './existing-name.component.html',
    styleUrls: ['./existing-name.component.scss']
})
export class ExistingNameComponent implements OnInit {

    module = AppDemo.actionModule;

    // demo configuration incl. code to display
    existingName: Example = {
        title: 'Existing Name Validator',
        subtitle: '',
        name: 'existingName',
        code: {
            html: `
<form [formGroup]="form" class="center card">
    <mat-form-field>
        <input matInput 
               [formControl]="form.controls['name']" 
               [placeholder]="'Name (should be unique)'">
        <mat-hint *ngIf="formErrors.name">
            {{formErrors.name}}
        </mat-hint>
    </mat-form-field>

    <button mat-button color="primary" [disabled]="!form.valid">
        Submit
    </button>
</form>`,
            ts: `
dataMock: string[] = [
    'Max', 'Peter', 'Paul', 'John'
];

// list of existing names
existingNames: [RegExp] = [
    new RegExp('user')
];

// define your form group
form: FormGroup;

// error handling on the defined fields e.g. name
formErrors = {
    'name': ''
};

// error message on the defined fields in formErrors
validationMessages = {
    'name': {
        'required': 'A name is required',
        'existingName': 'This name exists already.'
    }
};

constructor(private _formBuilder: FormBuilder) {

}

ngOnInit() {
    // create a list of names, which already exists
    for (const user of this.dataMock) {
        this.existingNames.push(
            new RegExp('(?:^|\\W)' + user.toLowerCase() + '(?:$|\\W)')
        );
    }

    // build form
    this.form = this._formBuilder.group({
        'name': new FormControl({
            value: '', disabled: false
        }, [
            Validators.required,
            existingNamesValidator(this.existingNames)
        ])
    });

    // detect changes in the form
    this.form.valueChanges.subscribe(
        data => this.onValueChanged(data)
    );

    this.onValueChanged();
}


onValueChanged(data?: any) {

    if (!this.form) {
        return;
    }

    // check if the form is valid
    Object.keys(this.formErrors).map(field => {
        this.formErrors[field] = '';
        const control = this.form.get(field);
        if (control && control.dirty && !control.valid) {
            const messages = this.validationMessages[field];
            Object.keys(control.errors).map(key => {
                this.formErrors[field] += messages[key] + ' ';
            });
        }
    });
}`,
            scss: ''
        }
    };


// data, which usally comes from an API
    dataMock: string[] = [
        'Max', 'Peter', 'Paul', 'John'
    ];

    // list of existing names
    existingNames: [RegExp] = [
        new RegExp('user')
    ];

    // define your form group
    form: FormGroup;

    // error handling on the defined fields e.g. name
    formErrors = {
        'name': ''
    };

    // error message on the defined fields in formErrors
    validationMessages = {
        'name': {
            'required': 'A name is required',
            'existingName': 'This name exists already.'
        }
    };

    constructor(private _formBuilder: FormBuilder) {

    }

    ngOnInit() {
        // create a list of names, which already exists
        for (const user of this.dataMock) {
            this.existingNames.push(
                new RegExp('(?:^|\W)' + user.toLowerCase() + '(?:$|\W)')
            );
        }

        // build form
        this.form = this._formBuilder.group({
            'name': new FormControl({
                value: '', disabled: false
            }, [
                Validators.required,
                existingNamesValidator(this.existingNames)
            ])
        });

        // detect changes in the form
        this.form.valueChanges.subscribe(
            data => this.onValueChanged(data)
        );

        this.onValueChanged();
    }


    onValueChanged(data?: any) {

        if (!this.form) {
            return;
        }

        // check if the form is valid
        Object.keys(this.formErrors).map(field => {
            this.formErrors[field] = '';
            const control = this.form.get(field);
            if (control && control.dirty && !control.valid) {
                const messages = this.validationMessages[field];
                Object.keys(control.errors).map(key => {
                    this.formErrors[field] += messages[key] + ' ';
                });
            }
        });
    }

}
