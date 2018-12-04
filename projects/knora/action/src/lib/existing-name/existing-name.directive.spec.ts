import { ExistingNameDirective } from './existing-name.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, DebugElement, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { existingNamesValidator } from '../existing-name/existing-name.directive';
import { By } from '@angular/platform-browser';
import { MatFormFieldModule, MatInputModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

fdescribe('ExistingNameDirective', () => {

    let component: TestHostComponent;
    let fixture: ComponentFixture<TestHostComponent>;
    const existingNamesList: string[] = [
        'Ben', 'Tobias', 'André', 'Flavie', 'Ivan', 'Lucas'
    ];
    let existingNames: [RegExp] = [
        new RegExp('user'),
        new RegExp('(?:^|\W)' + 'ben' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'tobias' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'andré' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'flavie' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'ivan' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'lucas' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'ben' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'tobias' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'andré' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'flavie' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'ivan' + '(?:$|\W)'),
        new RegExp('(?:^|\W)' + 'lucas' + '(?:$|\W)')
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

        fixture.detectChanges();

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

    it('should recognize a new name', () => {
        expect(component.dataMock).toEqual(existingNamesList);
        expect(component.existingNames).toEqual(existingNames);

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
        expect(errors['required']).toBeFalsy();
        expect(existingNamesValidator(existingNames));
    });

    it('should recognize an existing name', () => {
        expect(component.dataMock).toEqual(existingNamesList);
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
        expect(errors['required']).toBeFalsy();
        expect(existingNamesValidator(existingNames));
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
