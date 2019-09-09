import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatMenuTrigger } from '@angular/material';
import { StringLiteral } from '@knora/core/public_api';
import { Placeholder } from '@angular/compiler/src/i18n/i18n_ast';

@Component({
    selector: 'kui-string-literal-input',
    templateUrl: './string-literal-input.component.html',
    styleUrls: ['./string-literal-input.component.scss']
})
export class StringLiteralInputComponent implements OnInit {


    languages: string[] = ['de', 'fr', 'it', 'en'];

    /**
     * Optional placeholder for the input field e.g. Label
     *
     * @param  {string} [placeholder='Label']
     */
    @Input() placeholder?: string = 'Label';

    /**
     * Optional predefined (selected) language: en, de, it, fr, etc.
     *
     * @param  {string} language
     */
    @Input() language?: string;

    /**
     * Optional form field input type: textarea? set to true for textarea
     * otherwise it's a simple (short) input field
     *
     * @param  {boolean} [textarea=false]
     */
    @Input() textarea?: boolean = false;

    /**
     * Optional form field value of type StringLiteral[]
     *
     * @param {StringLiteral[]} value
     */
    @Input() value?: StringLiteral[] = [];

    /**
     * Optional disable the input field in case of no right to edit the field/value
     *
     * @param {boolean}: [disabled=false]
     */
    @Input() disabled?: boolean = false;

    /**
     * Returns (output) an array of StringLiteral when the focus is not anymore on the input field.
     *
     * @emits {StringLiteral[]} dataChanged
     */
    @Output() dataChanged: EventEmitter<StringLiteral[]> = new EventEmitter<StringLiteral[]>();

    @ViewChild('textInput', { static: false }) textInput: ElementRef;

    @ViewChild('btnToSelectLanguage', { static: false }) btnToSelectLanguage: MatMenuTrigger;

    form: FormGroup;

    constructor (
        private _fb: FormBuilder
    ) {

        // set selected language, if it's not defined yet
        if (!this.language) {
            if (localStorage.getItem('session') !== null) {
                // get language from the logged-in user profile data
                this.language = JSON.parse(localStorage.getItem('session')).user.lang;
            } else {
                // get default language from browser
                this.language = navigator.language.substr(0, 2);
            }
        }

        // does the defined language exists in our supported languages list?
        if (this.languages.indexOf(this.language) === -1) {
            // if not, select the first language from our list of supported languages
            this.language = this.languages[0];
        }

    }

    ngOnInit() {

        // if (this.placeholder.length > 0) {
        //     this.placeholder += ' (' + this.language + ')';
        // }

        // reset stringLiterals if they have empty values
        this.resetValues();

        // build the form
        this.form = this._fb.group({
            text: new FormControl(
                {
                    value: '',
                    disabled: this.disabled
                },
                {
                    updateOn: 'blur'
                }
            )
        });
        // update values on form change
        this.form.valueChanges.subscribe(data => this.onValueChanged());

        // get value from stringLiterals
        const val = this.getValueFromStringLiteral(this.language);
        this.updateFormField(val);


    }

    onValueChanged() {
        if (!this.form) {
            return;
        }

        this.updateStringLiterals(this.language, this.form.controls['text'].value);

        this.dataChanged.emit(this.value);

    }

    toggleAll() {
        // TODO: open/show all languages with their values
    }

    setLanguage(lang: string) {

        if (this.language === lang) {
            // console.warn('DO NOTHING! this language was already selected');
        } else {
            // clean stringLIteral value for previous language, if text field is empty
            this.updateStringLiterals(this.language, this.form.controls['text'].value);

            this.language = lang;
            // update form field value / reset in case of no value
            const val = this.getValueFromStringLiteral(lang);
            this.updateFormField(val);
        }
    }

    switchFocus() {
        // close the menu
        if (!this.textarea && this.btnToSelectLanguage && this.btnToSelectLanguage.menuOpen) {
            this.btnToSelectLanguage.closeMenu();
        }

        if (!this.disabled) {
            this.form.controls['text'].enable();
            this.textInput.nativeElement.focus();
        }
    }

    updateFormField(value: string) {
        if (!value) {
            value = '';
        }
        this.form.controls['text'].setValue(value);
    }

    updateStringLiterals(lang: string, value?: string) {
        const index = this.value.findIndex(i => i.language === lang);

        if (index > -1 && this.value[index].value.length > 0) {
            // value is not empty and exists in list of stringLiterals
            // console.log('update existing value for ' + lang + ' on position ' + index);
            this.value[index].value = value;
        }

        if ((!value || value.length === 0) && index > -1) {
            // value is empty: delete stringLiteral item for this language
            // console.log('delete empty value for ' + lang + ' on position ' + index);
            this.value.splice(index, 1);
        }

        if (index < 0 && value) {
            // value doesn't exist in stringLiterals: add one
            // console.log('add new value (' + value + ') for ' + lang);
            this.value.push({
                language: lang,
                value: value
            });
        }

    }

    resetValues() {
        const length: number = this.value.length;

        if (length > 0) {
            let index = length - 1;
            while (index >= 0) {
                // remove items with empty value
                if (!this.value[index].value.length) {
                    this.value.splice(index, 1);
                }
                index--;
            }

            // does an item for selected lanuage exists
            if (this.value.findIndex(i => i.language === this.language) === -1) {
                this.language = this.value[0].language;
            }

        } else {
            this.value = [];
        }
    }

    getValueFromStringLiteral(lang: string): string {
        // console.log('existing value in', this.value);
        // get index for this language
        const index = this.value.findIndex(i => i.language === lang);

        if (this.value[index] && this.value[index].value.length > 0) {
            return this.value[index].value;
        } else {
            return undefined;
        }

    }

}
