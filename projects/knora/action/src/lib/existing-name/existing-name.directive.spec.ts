import { ExistingNameDirective } from './existing-name.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { existingNamesValidator } from '../existing-name/existing-name.directive';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ExistingNameDirective', () => {

    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    const existingNamesList: string[] = [
        'Ben', 'Tobias', 'André', 'Flavie', 'Ivan', 'Lucas'
    ];
    const existingNames: [RegExp] = [
        new RegExp('user')
    ];

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule, FormsModule,
                MatFormFieldModule, MatInputModule, BrowserAnimationsModule
            ],
            declarations: [
                ExistingNameDirective,
                TestHostComponent
            ]
        });

        fixture = TestBed.createComponent(TestHostComponent);
        component = fixture.componentInstance;
        component.ngOnInit();
    });

    it('should create an instance', () => {
        expect(component).toBeTruthy();
    });

    it('form invalid when empty', () => {
        expect(component.form.valid).toBeFalsy();
    });

    it('name input field validity', () => {
        const name = component.form.controls['name'];
        expect(name.valid).toBeFalsy();
    });

    it('should recognize the new name "Benjamin" and valid the form', () => {
        expect(component.dataMock).toEqual(existingNamesList);
        expect(component.form.valid).toBeFalsy();

        for (const user of existingNamesList) {
            existingNames.push(
                new RegExp('(?:^|\W)' + user.toLowerCase() + '(?:$|\W)')
            );
        }

        expect(component.existingNames).toEqual(existingNames);

        fixture.detectChanges();

        let errors = {};
        const name = component.form.controls['name'];
        expect(name.valid).toBeFalsy();

        // Name field is required
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();
        expect(existingNamesValidator(existingNames));

        // Set a new name
        name.setValue('Benjamin');
        fixture.detectChanges();

        errors = name.errors || {};
        expect(component.form.valid).toBeTruthy();
        expect(errors['required']).toBeFalsy();
        expect(existingNamesValidator(existingNames)).toBeTruthy();
        expect(component.form.controls.name.errors).toBe(null);
    });

    it('should recognize the existing name "Ben" and invalid the form', () => {
        fixture.detectChanges();
        expect(component.dataMock).toEqual(existingNamesList);
        expect(component.form.valid).toBeFalsy();

        for (const user of existingNamesList) {
            existingNames.push(
                new RegExp('(?:^|\W)' + user.toLowerCase() + '(?:$|\W)')
            );
        }

        expect(component.existingNames).toEqual(existingNames);

        let errors = {};
        const name = component.form.controls['name'];
        expect(name.valid).toBeFalsy();

        // Name field is required
        errors = name.errors || {};
        expect(errors['required']).toBeTruthy();
        expect(existingNamesValidator(existingNames));

        // Set an existing name
        name.setValue('Ben');
        fixture.detectChanges();

        errors = name.errors || {};
        expect(component.form.valid).toBeFalsy();
        expect(errors['required']).toBeFalsy();
        expect(existingNamesValidator(existingNames)).toBeTruthy();
        expect(component.form.controls.name.errors.existingName.name).toBe('ben');
    });

});

@Component({
    template: `
    <div>
        <form [formGroup]="form">
            <mat-form-field>
                <input matInput [formControl]="form.controls['name']" [placeholder]="'Name (should be unique)'">
                <mat-hint *ngIf="formErrors.name">
                    {{formErrors.name}}
                </mat-hint>
            </mat-form-field>

            <button [disabled]="!form.valid">
                Submit
            </button>
        </form>
    </div>

    <ul>
        <li *ngFor="let n of dataMock">{{n}}</li>
    </ul>
    `
})
class TestHostComponent implements OnInit {

    dataMock: string[] = [
        'Ben', 'Tobias', 'André', 'Flavie', 'Ivan', 'Lucas'
    ];

    existingNames: [RegExp] = [
        new RegExp('user')
    ];

    form: FormGroup;

    formErrors = {
        'name': ''
    };

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
